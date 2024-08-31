-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Measure" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uuid" TEXT NOT NULL,
    "image" TEXT,
    "customer_code" TEXT NOT NULL,
    "measure_datetime" TEXT NOT NULL,
    "measure_type" TEXT NOT NULL,
    "measure_value" TEXT,
    "is_confirmed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_Measure" ("created_at", "customer_code", "id", "image", "is_confirmed", "measure_datetime", "measure_type", "measure_value", "updated_at", "uuid") SELECT "created_at", "customer_code", "id", "image", "is_confirmed", "measure_datetime", "measure_type", "measure_value", "updated_at", "uuid" FROM "Measure";
DROP TABLE "Measure";
ALTER TABLE "new_Measure" RENAME TO "Measure";
CREATE UNIQUE INDEX "Measure_uuid_key" ON "Measure"("uuid");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
