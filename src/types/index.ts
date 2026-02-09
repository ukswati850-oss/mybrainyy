export type Priority = 'low' | 'medium' | 'high';
export type Status = 'todo' | 'in-progress' | 'done';
export type Persona = 'general' | 'student' | 'creator' | 'hustler' | 'calm';
export type SubscriptionTier = 'free' | 'pro' | 'elite' | 'enterprise';
export type CoachingStyle = 'supportive' | 'strict' | 'analytical' | 'zen';
export type TeamRole = 'owner' | 'admin' | 'member' | 'guest';

export interface Task {
  id: string;
  title: string;
  description?: string;
  deadline?: Date;
  priority: Priority;
  status: Status;
  createdAt: Date;
  category?: string;
  tags?: string[];
  assignedTo?: string; // User ID
  teamId?: string;
}

export interface Habit {
  id: string;
  title: string;
  frequency: 'daily' | 'weekly';
  streak: number;
  completedDates: string[]; // ISO date strings
  category: 'health' | 'learning' | 'productivity' | 'mindfulness';
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  progress: number; // 0-100
  milestones: { id: string; title: string; isCompleted: boolean }[];
  deadline?: Date;
  category: string;
}

export interface MoodLog {
  id: string;
  date: string; // ISO date string
  mood: 'great' | 'good' | 'neutral' | 'stressed' | 'bad';
  note?: string;
  energyLevel?: number; // 1-10
  sleepHours?: number;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  name: string;
  focusDuration: number; // minutes
  persona: Persona;
  coachingStyle: CoachingStyle;
}

export interface UserStats {
  xp: number;
  level: number;
  tasksCompleted: number;
  focusMinutes: number;
  badges: string[];
  subscriptionTier: SubscriptionTier;
  referrals: number;
  socialScore: number;
}

export interface BrainDumpEntry {
  id: string;
  content: string;
  aiResponse?: string;
  createdAt: Date;
  extractedTasks?: Task[];
}

// Phase 3 Data
export interface IncomeEntry {
  id: string;
  title: string;
  amount: number;
  type: 'active' | 'passive' | 'expense';
  date: string;
  category: string;
}

export interface LearningResource {
  id: string;
  title: string;
  type: 'book' | 'video' | 'course';
  status: 'to-learn' | 'learning' | 'completed';
  notes?: string;
  flashcards?: { front: string; back: string }[];
}

// Phase 4 New Types
export interface Team {
  id: string;
  name: string;
  members: { id: string; name: string; role: TeamRole; avatar?: string }[];
  projects: { id: string; title: string; status: 'active' | 'completed' }[];
}

export interface Integration {
  id: string;
  name: string;
  type: 'calendar' | 'communication' | 'storage' | 'productivity';
  isConnected: boolean;
  icon: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  participants: number;
  rewardXP: number;
  joined: boolean;
}
