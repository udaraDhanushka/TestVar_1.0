/*
  Warnings:

  - You are about to drop the column `flashcardId` on the `Rating` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,flashcardSetId]` on the table `Rating` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `flashcardSetId` to the `Rating` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Rating" DROP CONSTRAINT "Rating_flashcardId_fkey";

-- DropIndex
DROP INDEX "Rating_userId_flashcardId_key";

-- AlterTable
ALTER TABLE "Rating" DROP COLUMN "flashcardId",
ADD COLUMN     "feedback" TEXT,
ADD COLUMN     "flashcardSetId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "_FlashcardToRating" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_FlashcardToRating_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_FlashcardToRating_B_index" ON "_FlashcardToRating"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Rating_userId_flashcardSetId_key" ON "Rating"("userId", "flashcardSetId");

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_flashcardSetId_fkey" FOREIGN KEY ("flashcardSetId") REFERENCES "FlashcardSet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FlashcardToRating" ADD CONSTRAINT "_FlashcardToRating_A_fkey" FOREIGN KEY ("A") REFERENCES "Flashcard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FlashcardToRating" ADD CONSTRAINT "_FlashcardToRating_B_fkey" FOREIGN KEY ("B") REFERENCES "Rating"("id") ON DELETE CASCADE ON UPDATE CASCADE;
