const express = require('express');
const { listCredentials, verifyCredential } = require('../controllers/credentialController');

const router = express.Router();
router.get('/', listCredentials);
router.get('/:id', verifyCredential);

module.exports = router;
