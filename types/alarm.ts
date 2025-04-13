export interface Alarm {
  id: string;
  time: string;
  label: string;
  isActive: boolean;
  daysActive: string[];
  topics: string[];
  countdownSeconds?: number;
  countdownEndTime?: number;
}
