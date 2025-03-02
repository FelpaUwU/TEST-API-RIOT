require('dotenv').config();
const express = require('express');
const router = express.Router();
const { getSummonerByNameAndTag } = require('../Controllers/summonerController');

router.get('/:name/:tag', getSummonerByNameAndTag);

module.exports = router;