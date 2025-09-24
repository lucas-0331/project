const axios = require('axios');

const getAllGames = async (req, res) => {
  try {
    const response = await axios.get('https://api.steampowered.com/ISteamApps/GetAppList/v2/');

    const games = response.data.applist.apps;

    res.status(200).json({ data: games });

  } catch (error) {
    console.error('Erro ao buscar jogos da API da Steam:', error);
    res.status(500).json({ error: 'Não foi possível buscar a lista de jogos.' });
  }
};

module.exports = {
  getAllGames,
};