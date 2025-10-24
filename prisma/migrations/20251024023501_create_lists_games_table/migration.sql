-- CreateTable
CREATE TABLE "ListsGames" (
    "id" SERIAL NOT NULL,
    "list_id" INTEGER NOT NULL,
    "game_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ListsGames_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ListsGames_list_id_game_id_key" ON "ListsGames"("list_id", "game_id");

-- AddForeignKey
ALTER TABLE "ListsGames" ADD CONSTRAINT "ListsGames_list_id_fkey" FOREIGN KEY ("list_id") REFERENCES "Lists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListsGames" ADD CONSTRAINT "ListsGames_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "Games"("id") ON DELETE CASCADE ON UPDATE CASCADE;
