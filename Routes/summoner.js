require('dotenv').config();
const express = require('express');
const router = express.Router();

router.get('/:name/:tag', getSummonerByNameAndTag);

module.exports = router;