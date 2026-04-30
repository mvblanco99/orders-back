-- CreateTable
CREATE TABLE "failures" (
    "id" SERIAL NOT NULL,
    "part_id" INTEGER NOT NULL,
    "observation" TEXT NOT NULL,
    "created_by" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "failures_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "failures_part_id_idx" ON "failures"("part_id");

-- AddForeignKey
ALTER TABLE "failures" ADD CONSTRAINT "failures_part_id_fkey" FOREIGN KEY ("part_id") REFERENCES "parts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "failures" ADD CONSTRAINT "failures_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
