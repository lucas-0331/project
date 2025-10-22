-- CreateTable
CREATE TABLE "Games" (
    "id" SERIAL NOT NULL,
    "appId" INTEGER NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "headerImageUrl" VARCHAR(255),
    "capsuleImageUrl" VARCHAR(255),
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Games_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Games_appId_key" ON "Games"("appId");
