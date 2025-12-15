const {PrismaClient} = require('@/generated/prisma/client');
const prisma = new PrismaClient();
const axios = require('axios');
const detailsRoute = 'https://store.steampowered.com/api/appdetails?appids=';

const PAGINATION_LIMIT = 30;

const getGames = async (req, res) => {
    const {cursor, sortBy = 'id', setOrder = 'asc', search} = req.query;

    const queryOptions = {
        take: PAGINATION_LIMIT,
        orderBy: {
            [sortBy]: setOrder
        },
        where: {}
    }

    if (search) {
        queryOptions.where.name = {
            contains: search,
            mode: 'insensitive'
        }
    }

    if (!search && cursor) {
        queryOptions.skip = 1;
        queryOptions.cursor = {
            id: parseInt(cursor)
        }
    }

    if (typeof queryOptions.orderBy[sortBy] !== 'string') {
        queryOptions.orderBy[sortBy] = 'asc';
    }

    try {
        const games = await prisma.games.findMany(queryOptions);

        const nextCursor = games.length > 0 ? games[games.length - 1].id : null;

        return res.status(200).json({data: games, cursor: nextCursor});
    } catch (error) {
        console.error('Erro ao retornar todos os jogos do banco de dados: ', error);
        return res.status(500).json({error: 'Não foi possível retornar a lista de jogos.'});
    }
}

const getDetails = async (req, res) => {
    const { appId } = req.params;

    const url = `${detailsRoute}${appId}&l=brazilian&cc=br`

    const { data } = await axios.get(url);

    const sourceData = data[appId].data;

    const gameDTO = {
        app_id: sourceData.steam_appid,
        name: sourceData.name,
        detailed_description: sourceData.detailed_description,
        about_the_game: sourceData.about_the_game,
        supported_languages: sourceData.supported_languages,
        header_image: sourceData.header_image,
        pc_requirements: sourceData.pc_requirements,
        developers: sourceData.developers,
        publishers: sourceData.publishers,
        price: sourceData.price_overview.final_formatted,
        platforms: sourceData.platforms,
        categories: sourceData.categories.map(({description}) => description),
        genres: sourceData.genres.map(({description}) => description),
        screenshots: sourceData?.screenshots.map(({path_full}) => path_full),
        movies: sourceData?.movies.map(({hls_h264}) => hls_h264),
        release_date: sourceData.release_date,
        background: sourceData.background
    }

    return res.status(200).json(gameDTO);
}

module.exports = {
    getGames,
    getDetails
};