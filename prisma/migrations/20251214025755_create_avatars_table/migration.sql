-- CreateTable
CREATE TABLE "Avatars" (
    "id" SERIAL NOT NULL,
    "link" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Avatars_pkey" PRIMARY KEY ("id")
);
