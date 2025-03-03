require('dotenv').config();
const express = require('express');
const router = express.Router();
const { getSummonerMatchs } = require('../Controllers/matchController');
const { getSpecifiedMatch } = require('../Controllers/matchController')

router.get('/:name/:tag/:puuid', getSummonerMatchs);
router.get('/:name/:tag/:matchId/details', getSpecifiedMatch);

module.exports = router;