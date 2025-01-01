import { HiddenFlashcard } from "@prisma/client";

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Collection {
  id: number;
  name: string;
  description?: string | null;
  createdBy: number;
  createdAt: Date;
  updatedAt: Date;
  flashcardSets?: FlashcardSet[];
}

export interface FlashcardSet {
  id: number;
  name: string;
  description?: string | null;
  collectionId: number;
  createdBy: number;
  createdAt: Date;
  updatedAt: Date;
  flashcards: Flashcard[];
}

export interface Flashcard {
  id: number;
  question: string;
  answer: string;
  tags: string[];
  publishedStatus: boolean;
  flashcardSetId: number;
  createdBy: number;
  createdAt: Date;
  ratings: Rating[];
  hiddenCards: HiddenFlashcard[];
}

export interface CompletionStats {
  gotIt: number;
  knewIt: number;
}

export interface Rating {
  id: number;
  userId: number;
  flashcardSetId: number;
  rating: number;
  feedback?: string;
  createdAt: Date;
}

export interface Session {
  id: number;
  userId: number;
  startTime: Date;
  endTime?: Date;
  result: any;
  createdAt: Date;
}