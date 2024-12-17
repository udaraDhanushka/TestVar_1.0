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
  // description?: string;
  description?: string | null;
  createdBy: number;
  createdAt: Date;
  updatedAt: Date;
  flashcardSets?: FlashcardSet[];
}

export interface FlashcardSet {
  // flashcards: any;
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
  hiddenCards: any;
  // [x: string]: any;
  id: number;
  question: string;
  answer: string;
  tags: string[];
  publishedStatus: boolean;
  flashcardSetId: number;
  createdBy: number;
  createdAt: Date;
}

export interface Rating {
  id: number;
  userId: number;
  flashcardId: number;
  rating: number;
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