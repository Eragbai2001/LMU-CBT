-- DropForeignKey
ALTER TABLE "PracticeSession" DROP CONSTRAINT "PracticeSession_durationId_fkey";

-- AlterTable
ALTER TABLE "PracticeSession" ALTER COLUMN "durationId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "PracticeSession" ADD CONSTRAINT "PracticeSession_durationId_fkey" FOREIGN KEY ("durationId") REFERENCES "Duration"("id") ON DELETE SET NULL ON UPDATE CASCADE;
