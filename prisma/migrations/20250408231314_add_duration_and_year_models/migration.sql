-- CreateTable
CREATE TABLE "PracticeTest" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "isPopular" BOOLEAN NOT NULL DEFAULT false,
    "questionCount" INTEGER NOT NULL,

    CONSTRAINT "PracticeTest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Duration" (
    "id" TEXT NOT NULL,
    "minutes" INTEGER NOT NULL,

    CONSTRAINT "Duration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Year" (
    "id" TEXT NOT NULL,
    "value" INTEGER NOT NULL,

    CONSTRAINT "Year_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_TestYears" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_TestYears_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_TestDurations" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_TestDurations_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_TestYears_B_index" ON "_TestYears"("B");

-- CreateIndex
CREATE INDEX "_TestDurations_B_index" ON "_TestDurations"("B");

-- AddForeignKey
ALTER TABLE "_TestYears" ADD CONSTRAINT "_TestYears_A_fkey" FOREIGN KEY ("A") REFERENCES "PracticeTest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TestYears" ADD CONSTRAINT "_TestYears_B_fkey" FOREIGN KEY ("B") REFERENCES "Year"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TestDurations" ADD CONSTRAINT "_TestDurations_A_fkey" FOREIGN KEY ("A") REFERENCES "Duration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TestDurations" ADD CONSTRAINT "_TestDurations_B_fkey" FOREIGN KEY ("B") REFERENCES "PracticeTest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
