# GitGud
*the alarm clock for CS majors!*

## 💡 Inspiration  
As CS majors, we realized two things:  
1️⃣ We need to get better at DSA.  
2️⃣ We also need to wake up before 2 PM to do that.  

Tech interviews are brutal, and let’s be honest — practicing LeetCode is the broccoli of coding. So we thought: what if we turned our morning alarm into a coding dojo?  

GitGud is our way of combining ✨productivity✨ with panic — solving DSA questions first thing in the morning so we can *finally* pass a tech screen (and maybe stop being “currently seeking opportunities” on LinkedIn 🙃).

---

## 🚨 What it does  
GitGud is an alarm clock app that forces you to solve a DSA (Data Structures & Algorithms) question before the alarm stops ringing.  

It’s brutal. It’s effective. It’s... oddly satisfying.  

Here’s what it does:  
- Wake you up with a customizable alarm  
- Show a short coding question — usually fill-in-the-blank style  
- Only dismiss the alarm when you get it right 😈  
- Optionally link your GitHub to push daily commits to your contribution graph  
- Track your streaks and celebrate consistency 🎉  

No snoozing, no shortcuts — just morning grind.

---

## 🔧 How we built it  
- 📱 **React Native + Expo** for building a cross-platform mobile app  
- 🔥 **Firebase** for authentication, user data, and streak tracking  
- 🧠 **Local database** of curated DSA questions for now, with future plans for spaced repetition  
- 🔐 **GitHub OAuth** for connecting to your profile (because if you're coding, might as well flex those green squares)  
- 🎨 UI/UX focused on being clean and motivational, not anxiety-inducing (LeetCode, we’re looking at you)  

---

## 🧩 Challenges we ran into  
- Running alarms and app logic in the background, especially on iOS, required some serious finesse  
- iOS permissions made us feel like we were hacking the Pentagon  
- Getting the balance right between “fun morning challenge” and “rage quit at 7 AM”  
- Debugging alarms at 3 AM while ironically missing sleep 😴

---

## 🏆 Accomplishments that we're proud of  
- Alarm + question flow works seamlessly now  
- Actually *fun* to use — testers didn’t hate waking up to code  
- GitHub integration works, so users can commit through their wakeup grind  
- We didn’t sleep through our own demo 😎  
- The name slaps. Admit it.  

---

## 📚 What we learned  
- How to navigate platform-specific quirks in React Native (looking at you, iOS)  
- Firebase is awesome for fast prototyping + auth  
- Balancing UX and behavior change is hard but super rewarding  
- You can make DSA... kinda fun?  
- Also learned that apparently, you're not allowed to call your alarm app "Get Woke" on the App Store 😂

---

## 🚀 What's next for GitGud  
- Adaptive question difficulty based on user performance 🧠  
- Spaced repetition and review mode for failed questions  
- More question types (multiple choice, drag and drop, brain teasers)  
- Daily coding streaks with badge rewards and shareable stats  
- Community-made question packs (crowdsource the pain 🫠)  
- Launching publicly so we can all *finally* get jobs and stop writing “Open to Work” posts 💼
