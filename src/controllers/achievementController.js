const { PrismaClient } = require('@/generated/prisma/client');
const prisma = new PrismaClient();
const cheerio = require('cheerio');
const axios = require('axios');

/**
 * @function getAchievementsList
 * @description Retrieves the list of achievements for a specific game, along with the achievements completed by the authenticated user.
 * @async
 * @param {object} req - Request object.
 * @param {object} res - Response object.
 * @response 200 {object} data - An object containing the list of achievements and the IDs of completed achievements.
 * @response 404 {object} error - Error message if the game or achievements are not found.
 * @response 500 {object} error - Error message if something goes wrong on the server.
 */
const getAchievementsList = async (req, res) => {

    const userId = req.user_id;
    const gameId = parseInt(req.params.id);

    try {

        const game = await prisma.games.findFirst({ where: { id: gameId } });

        if (!game) {
            return res.status(404).json({ error: 'Jogo não encontrado.' });
        }

        const gameAchievements = await prisma.achievements.findMany({ where: { game_id: gameId } });

        if (gameAchievements.length === 0) {

            const scrapedAchievements = await scrapeAchievements(game.appId);

            if (scrapedAchievements.length === 0) {
                return res.status(404).json({ error: 'Nenhuma conquista encontrada para este jogo.' });
            }

            await prisma.achievements.createMany({
                data: scrapedAchievements.map(ach => ({
                    game_id: gameId,
                    name: ach.name,
                    description: ach.description,
                    image: ach.image
                })),
                skipDuplicates: true
            });

            const createdAchievementsList = await prisma.achievements.findMany({
                where: { game_id: gameId }
            });

            return res.status(200).json({
                achievementsList: createdAchievementsList,
                completedAchievementsIds: []
            });
        }

        const completedAchievements = await prisma.usersAchievements.findMany({
            where: {
                user_id: userId,
                achievement_id: { in: gameAchievements.map(ach => ach.id) }
            },
            select: {
                achievement_id: true
            }
        });

        const completedAchievementsIds = completedAchievements.map(a => a.achievement_id);

        return res.status(200).json({
            achievementsList: gameAchievements,
            completedAchievementsIds: completedAchievementsIds
        });

    } catch (error) {
        console.error('Erro ao buscar as conquistas:', error);
        return res.status(500).json({ error: 'Não foi possível buscar as conquistas.' });
    }
}

/**
 * @function addAchievementsToList
 * @description Adds multiple achievements to the authenticated user's completed achievements list.
 * @async
 * @param {object} req - Request object.
 * @param {object} res - Response object.
 * @response 200 {object} message - Success message.
 * @response 400 {object} error - Error message when required fields are missing.
 * @response 500 {object} error - Error message if something goes wrong on the server.
 */
const addAchievementsToList = async (req, res) => {
    
    const userId = req.user_id;
    const gameId = parseInt(req.params.id);
    const { achievementsIds } = req.body || {};

    if (!Array.isArray(achievementsIds) || achievementsIds.length === 0) {
        return res.status(400).json({ error: 'É necessário informar um array com os IDs das conquistas!' });
    }

    try {

        const createData = achievementsIds.map(achievementId => ({
            user_id: userId,
            achievement_id: achievementId
        }));

        await prisma.usersAchievements.createMany({ data: createData, skipDuplicates: true });

        return res.status(200).json({ message: 'Conquistas concluídas salvas com sucesso!' });

    } catch (error) {
        console.error('Erro ao salvar as conquistas concluídas:', error);
        return res.status(500).json({ error: 'Não foi possível salvar as conquistas concluídas.' });
    }
}

/**
 * @function removeAchievementsFromList
 * @description Removes multiple achievements from the authenticated user's completed achievements list.
 * @async
 * @param {object} req - Request object.
 * @param {object} res - Response object.
 * @response 200 {object} message - Success message upon removing achievements.
 * @response 400 {object} error - Error message when required fields are missing.
 * @response 404 {object} error - Error message if no achievements were found to remove.
 * @response 500 {object} error - Error message if something goes wrong on the server.
 */
const removeAchievementsFromList = async (req, res) => {
    
    const userId = req.user_id;
    const gameId = parseInt(req.params.id);
    const { achievementsIds } = req.body || {};

    if (!Array.isArray(achievementsIds) || achievementsIds.length === 0) {
        return res.status(400).json({ error: 'É necessário informar um array com os IDs das conquistas!' });
    }

    try {

        const removedAchievements = await prisma.usersAchievements.deleteMany({
            where: {
                user_id: userId,
                achievement_id: { in: achievementsIds }
            }
        });

        if (removedAchievements.count === 0) {
            return res.status(404).json({ error: 'Nenhum dos jogos informados foi encontrado na lista.' });
        }

        return res.status(200).json({ message: 'Conquistas concluídas removidas com sucesso!' });

    } catch (error) {
        console.error('Erro ao remover as conquistas concluídas:', error);
        return res.status(500).json({ error: 'Não foi possível remover as conquistas concluídas.' });
    }
}

/**
 * @function scrapeAchievements
 * @description Scrapes achievements data from Steam community page for a given appId.
 * @async
 * @param {number} appId - The Steam application ID.
 * @returns {array} - An array of achievement objects containing name, description, and image URL.
 */
async function scrapeAchievements(appId) {

    try {

        const url = `https://steamcommunity.com/stats/${appId}/achievements`;

        const { data: html } = await axios.get(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
            }
        });

        const $ = cheerio.load(html);

        const achievements = [];

        $('.achieveRow').each((_, el) => {

            const row = $(el);

            const image = row.find('.achieveImgHolder img').attr('src') || '';
            const name = row.find('.achieveTxt h3').first().text().trim() || null;
            const description = row.find('.achieveTxt h5').first().text().trim() || null;

            if (name) {
                achievements.push({
                    name,
                    description,
                    image
                });
            }
        });

        return achievements;
        
    } catch (error) {
        console.error('Erro ao realizar o scraping de conquistas:', error);
        return [];
    }
}

module.exports = {
    getAchievementsList,
    addAchievementsToList,
    removeAchievementsFromList
};