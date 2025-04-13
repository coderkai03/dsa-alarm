import { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ThemedText } from '../components/ThemedText';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GEMINI_API_KEY!);

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface Answer {
  questionIndex: number;
  userAnswer: number;
  isCorrect: boolean;
}

async function generateQuestions(topics: string[]): Promise<Question[]> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `Generate 3 short multiple choice questions about ${topics.join(', ')}.
Return ONLY a JSON array with this exact format:
[{
  "question": "What is the time complexity of bubble sort?",
  "options": ["O(n)", "O(n^2)", "O(log n)", "O(n log n)"],
  "correctAnswer": 1
}, {
  "question": "second question here",
  "options": ["option1", "option2", "option3", "option4"],
  "correctAnswer": 0
}, {
  "question": "third question here",
  "options": ["option1", "option2", "option3", "option4"],
  "correctAnswer": 0
}]

Rules:
1. Return ONLY the JSON array, no other text
2. Each question must have exactly 4 options
3. correctAnswer must be 0-3
4. Questions should be about: ${topics.join(', ')}
5. Make questions challenging but not too difficult`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean the response text to ensure valid JSON
    const cleanedText = text.trim()
      .replace(/^```json\s*/, '') // Remove leading ```json
      .replace(/```$/, '')        // Remove trailing ```
      .replace(/^\s*```\s*/, '')  // Remove just leading ```
      .trim();
    
    try {
      const questions = JSON.parse(cleanedText);
      
      // Validate the response structure
      if (!Array.isArray(questions) || questions.length !== 3 || 
          !questions.every(q => 
            typeof q.question === 'string' &&
            Array.isArray(q.options) &&
            q.options.length === 4 &&
            typeof q.correctAnswer === 'number' &&
            q.correctAnswer >= 0 &&
            q.correctAnswer <= 3
          )) {
        throw new Error('Invalid response structure');
      }
      
      return questions;
    } catch (parseError) {
      console.error('JSON Parse error:', parseError);
      console.error('Received text:', cleanedText);
      return defaultQuestions;
    }
  } catch (error) {
    console.error('Error generating questions:', error);
    return defaultQuestions;
  }
}

async function generateStudySuggestions(topics: string[], answers: Answer[]): Promise<string[]> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `Generate 3 short study suggestions based on this quiz performance:
- Topics: ${topics.join(', ')}
- Score: ${answers.filter(a => a.isCorrect).length} correct out of ${answers.length}

Return ONLY a JSON array with exactly 3 strings like this:
[
  "First specific suggestion with resource",
  "Second specific suggestion with resource",
  "Third specific suggestion with resource"
]

Make suggestions specific to the topics and include actual resource recommendations (LeetCode problems, articles, or videos).
Return ONLY the JSON array, no other text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean the response text
    const cleanedText = text.trim()
      .replace(/^```json\s*/, '')
      .replace(/```$/, '')
      .replace(/^\s*```\s*/, '')
      .trim();
    
    try {
      const suggestions = JSON.parse(cleanedText);
      
      if (!Array.isArray(suggestions) || suggestions.length !== 3 || 
          !suggestions.every(s => typeof s === 'string')) {
        throw new Error('Invalid suggestions format');
      }
      
      return suggestions;
    } catch (parseError) {
      console.error('JSON Parse error:', parseError);
      return [
        'Practice more questions on these topics',
        'Review the fundamental concepts',
        'Try solving similar problems on LeetCode'
      ];
    }
  } catch (error) {
    console.error('Error generating suggestions:', error);
    return [
      'Practice more questions on these topics',
      'Review the fundamental concepts',
      'Try solving similar problems on LeetCode'
    ];
  }
}

// Fallback questions in case API fails
const defaultQuestions = [
  {
    question: 'What is the time complexity of accessing an element in an array by index?',
    options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'],
    correctAnswer: 0
  },
  {
    question: 'Which operation in a singly linked list has O(1) time complexity?',
    options: [
      'Insertion at beginning',
      'Insertion at end',
      'Finding middle element',
      'Reversing the list'
    ],
    correctAnswer: 0
  },
  {
    question: 'What is the space complexity of a recursive binary search?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n^2)'],
    correctAnswer: 1
  }
];

export default function Questions() {
  const { topics } = useLocalSearchParams<{ topics: string }>();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [studySuggestions, setStudySuggestions] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function loadQuestions() {
      setLoading(true);
      const topicsList = topics?.split(',') || [];
      try {
        const generatedQuestions = await generateQuestions(topicsList);
        setQuestions(generatedQuestions);
      } catch (error) {
        console.error('Error loading questions:', error);
        setQuestions(defaultQuestions);
      }
      setLoading(false);
    }

    loadQuestions();
  }, [topics]);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswer = async (optionIndex: number) => {
    const isCorrect = optionIndex === currentQuestion.correctAnswer;
    setSelectedAnswer(optionIndex);
    
    // Record the answer
    setAnswers(prev => [...prev, {
      questionIndex: currentQuestionIndex,
      userAnswer: optionIndex,
      isCorrect
    }]);
    
    // Wait a moment to show if answer was correct
    setTimeout(async () => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null);
      } else {
        // All questions answered, show results
        const topicsList = topics?.split(',') || [];
        const suggestions = await generateStudySuggestions(topicsList, [
          ...answers,
          { questionIndex: currentQuestionIndex, userAnswer: optionIndex, isCorrect }
        ]);
        setStudySuggestions(suggestions);
        setShowResults(true);
      }
    }, 1000);
  };

  const ResultsView = () => {
    const correctAnswers = answers.filter(a => a.isCorrect).length;
    const totalQuestions = questions.length;
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);
    
    return (
      <View style={styles.container}>
        <ThemedText style={styles.resultTitle}>Quiz Complete!</ThemedText>
        
        <View style={styles.scoreContainer}>
          <ThemedText style={styles.scoreText}>
            Score: {correctAnswers}/{totalQuestions} ({percentage}%)
          </ThemedText>
        </View>

        <View style={styles.suggestionsContainer}>
          <ThemedText style={styles.suggestionsTitle}>Study Suggestions:</ThemedText>
          {studySuggestions.map((suggestion, index) => (
            <ThemedText key={index} style={styles.suggestion}>
              • {suggestion}
            </ThemedText>
          ))}
        </View>

        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            // Navigate back to topics selection
            router.back();
          }}
        >
          <ThemedText style={styles.retryButtonText}>Try Another Quiz</ThemedText>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ThemedText>Loading questions...</ThemedText>
      </View>
    );
  }

  if (!currentQuestion && !showResults) {
    return (
      <View style={styles.container}>
        <ThemedText>No questions available for selected topics.</ThemedText>
      </View>
    );
  }

  if (showResults) {
    return <ResultsView />;
  }

  return (
    <View style={styles.container}>
      <ThemedText style={styles.questionText}>
        {currentQuestion.question}
      </ThemedText>

      <View style={styles.optionsContainer}>
        {currentQuestion.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionButton,
              selectedAnswer === index && (
                index === currentQuestion.correctAnswer
                  ? styles.correctAnswer
                  : styles.wrongAnswer
              )
            ]}
            onPress={() => handleAnswer(index)}
            disabled={selectedAnswer !== null}
          >
            <ThemedText style={styles.optionText}>{option}</ThemedText>
          </TouchableOpacity>
        ))}
      </View>

      <ThemedText style={styles.progress}>
        Question {currentQuestionIndex + 1} of {questions.length}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  questionText: {
    fontSize: 20,
    marginBottom: 30,
    textAlign: 'center',
  },
  optionsContainer: {
    gap: 15,
  },
  optionButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#2c2c2c',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
  },
  correctAnswer: {
    backgroundColor: '#2e7d32',
  },
  wrongAnswer: {
    backgroundColor: '#c62828',
  },
  progress: {
    marginTop: 30,
    textAlign: 'center',
    fontSize: 14,
    opacity: 0.7,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  scoreContainer: {
    backgroundColor: '#2c2c2c',
    padding: 20,
    borderRadius: 10,
    marginBottom: 30,
  },
  scoreText: {
    fontSize: 20,
    textAlign: 'center',
  },
  suggestionsContainer: {
    backgroundColor: '#2c2c2c',
    padding: 20,
    borderRadius: 10,
    marginBottom: 30,
  },
  suggestionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  suggestion: {
    fontSize: 16,
    marginBottom: 10,
    lineHeight: 22,
  },
  retryButton: {
    backgroundColor: '#2e7d32',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 