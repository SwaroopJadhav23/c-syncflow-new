const express = require('express');
const router = express.Router();

// Matches your lowercase 'imapcontroller.js' inside 'controllers' folder
const imapController = require('../controllers/imapcontroller');

// Matches your lowercase 'auth.js' inside 'middleware' folder
const auth = require('../middleware/auth'); 

/**
 * @route   POST api/sync/imap-sync
 * @desc    Sync meetings from user email via IMAP
 * @access  Private (Requires x-auth-token)
 */
router.post('/imap-sync', auth, imapController.syncViaImap);

/**
 * @route   GET api/sync/list
 * @desc    Get all synced meetings for the logged-in user
 * @access  Private (Requires x-auth-token)
 */
router.get('/list', auth, imapController.getSyncedList);

module.exports = router;