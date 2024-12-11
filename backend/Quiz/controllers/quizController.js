const Quiz = require('../models/quizModel');

// Create a new quiz question
const createQuiz = async (req, res) => {
  const { question, answer, section } = req.body;

  try {
    const quiz = new Quiz({ question, answer, section });
    await quiz.save();

    res.status(201).json({ success: true, message: 'Quiz question created successfully!', quiz });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create quiz question', error });
  }
};

// Get quizzes by section
const getQuizzes = async (req, res) => {
  const { section } = req.params;

  try {
    const quizzes = await Quiz.find({ section });
    res.status(200).json({ success: true, quizzes });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch quizzes', error });
  }
};

// Submit answers for grading
const submitQuiz = async (req, res) => {
  const { section, userAnswers } = req.body;

  try {
    const quizzes = await Quiz.find({ section });
    const correctAnswers = quizzes.map((quiz) => quiz.answer.toLowerCase());
    const score = userAnswers.filter((ans, idx) => ans.toLowerCase() === correctAnswers[idx]).length;

    res.status(200).json({ success: true, score, message: `You scored ${score}/${quizzes.length}` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to submit quiz', error });
  }
};

module.exports = { createQuiz, getQuizzes, submitQuiz };
