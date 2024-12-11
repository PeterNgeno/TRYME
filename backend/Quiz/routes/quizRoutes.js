const express = require('express');
const { createQuiz, getQuizzes, submitQuiz } = require('../controllers/quizController');

const router = express.Router();

// Routes for quiz functionalities
router.post('/create', createQuiz);    // Create a new quiz question
router.get('/:section', getQuizzes);  // Fetch quizzes by section
router.post('/submit', submitQuiz);   // Submit answers for grading

module.exports = router;
