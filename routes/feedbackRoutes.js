const express = require('express');
const router = express.Router();
const { saveFeedback, getFeedback } = require('../controllers/feedbackController');

router.post('/', saveFeedback);
router.get('/:id', getFeedback);

module.exports = router;