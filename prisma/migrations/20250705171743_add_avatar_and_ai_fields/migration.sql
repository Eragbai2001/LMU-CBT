-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatarSeed" TEXT,
ADD COLUMN     "avatarStyle" TEXT,
ADD COLUMN     "enableAiAssistant" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "TestResult" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "testId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "totalQuestions" INTEGER NOT NULL,
    "correctAnswers" INTEGER NOT NULL,
    "incorrectAnswers" INTEGER NOT NULL,
    "skippedQuestions" INTEGER NOT NULL,
    "timeTaken" TEXT,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "answersJson" TEXT NOT NULL,

    CONSTRAINT "TestResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TestResult_userId_idx" ON "TestResult"("userId");

-- CreateIndex
CREATE INDEX "TestResult_testId_idx" ON "TestResult"("testId");

-- CreateIndex
CREATE INDEX "TestResult_sessionId_idx" ON "TestResult"("sessionId");

-- AddForeignKey
ALTER TABLE "TestResult" ADD CONSTRAINT "TestResult_testId_fkey" FOREIGN KEY ("testId") REFERENCES "PracticeTest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
