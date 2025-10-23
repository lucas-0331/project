const { PrismaClient } = require('./src/generated/prisma/client');
const axios = require('axios');

const prisma = new PrismaClient();

const APP_LIST_URL = 'https://api.steampowered.com/ISteamApps/GetAppList/v2/';
const APP_DETAILS_URL = 'https://store.steampowered.com/api/appdetails';

// atualmente foi iterado de 0 a 50000, então start index a partir de 50000
const START_INDEX = 50000;
const MAX_APPS_TO_PROCESS = 10000;
const REQUEST_DELAY_MS = 1500;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchGameDetails(appid) {
    try {
        const url = `${APP_DETAILS_URL}?appids=${appid}&cc=br&l=pt`;
        const response = await axios.get(url, { timeout: 10000 });

        const data = response.data[appid];

        if (!data || !data.success || !data.data) {
            return null;
        }

        const gameData = data.data;

        if (gameData.type === 'game' && gameData.header_image) {

            return {
                appId: appid,
                name: gameData.name,
                headerImageUrl: gameData.header_image,
                capsuleImageUrl: gameData?.capsule_image,
            };
        }

        return null;

    } catch (error) {
        return null;
    }
}

async function seedGames() {
    console.log('--- 🎮 Iniciando o processo de Seed do Steam... ---');

    try {
        console.log('1. Buscando lista completa de AppIDs (ISteamApps/GetAppList)...');
        const listResponse = await axios.get(APP_LIST_URL);
        const apps = listResponse.data.applist.apps;

        console.log(`Lista obtida. Total de apps: ${apps.length}.`);

        const appsToProcess = apps.slice(START_INDEX, START_INDEX + MAX_APPS_TO_PROCESS);

        console.log(`2. Processando bloco [${START_INDEX + 1} ao ${START_INDEX + appsToProcess.length}] de ${apps.length} apps. (Delay de ${REQUEST_DELAY_MS}ms por requisição)`);

        let newGamesSaved = 0;
        let appsProcessed = 0;

        for (let i = 0; i < appsToProcess.length; i++) {
            const { appid, name } = appsToProcess[i];
            appsProcessed++;

            const existingGame = await prisma.games.findUnique({
                where: { appId: appid },
            });

            if (existingGame) {
                await delay(50);
                continue;
            }

            const gameDetails = await fetchGameDetails(appid);

            if (gameDetails) {
                try {
                    await prisma.games.create({
                        data: gameDetails,
                    });
                    newGamesSaved++;
                    console.log(`[SUCESSO: ${appsProcessed}/${MAX_APPS_TO_PROCESS}] 💾 AppID ${appid} (${gameDetails.name}) salvo!`);
                } catch (dbError) {
                    console.error(`[ERRO DB: ${appsProcessed}/${MAX_APPS_TO_PROCESS}] ❌ Falha ao salvar AppID ${appid}. ${dbError.message}`);
                }
            }
            await delay(REQUEST_DELAY_MS);
        }

        console.log(`\n--- ✅ Processo de Seed Concluído! ${newGamesSaved} novos jogos salvos. ---`);
    } catch (mainError) {
        console.error('\n--- 🚨 ERRO FATAL NO PROCESSO DE SEED ---');
        console.error(mainError.message);
    } finally {
        await prisma.$disconnect();
    }
}

seedGames();