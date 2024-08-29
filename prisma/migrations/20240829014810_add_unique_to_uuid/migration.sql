/*
  Warnings:

  - A unique constraint covering the columns `[uuid]` on the table `Measure` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Measure_uuid_key" ON "Measure"("uuid");
