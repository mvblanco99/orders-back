-- CreateTable
CREATE TABLE "user_logger" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_logger_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user_logger" ADD CONSTRAINT "user_logger_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
