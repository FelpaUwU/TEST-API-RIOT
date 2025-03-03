require('dotenv').config();
const express = require('express');
const router = express.Router();
const { getSummonerByNameAndTag } = require('../Controllers/summonerController');
const { getChampionsMastery } = require ('../Controllers/summonerController')

router.get('/:name/:tag', getSummonerByNameAndTag);

router.get('/:name/:tag/:puuid', getChampionsMastery);

module.exports = router;