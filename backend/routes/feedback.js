const express = require('express');
const router = express.Router();
const { Feedback } = require('../models')

// Get All
router.get('/', async (req, res) => {
  try{
    await Feedback.findAll()
      .then((message) => { return res.status(200).json({message}) })
      .catch((err) => { return res.status(400).json(err) })
  } catch (err) {
    return res.status(500).json(err)
  }
})

// Get One
router.get('/:id', async (req, res) => {
  try {
    await Feedback.findOne({ where: { id: req.params.id } })
      .then((message) => { return res.status(200).json({message}) })
      .catch((err) => { return res.status(400).json(err) })
  } catch (err) {
    return res.status(500).json(err)
  }
})

// Create One
router.post('/', async (req, res) => {
  const { name, email, comment, rating, allowEmailBack } = req.body
  // Add input validation
  try {
    await Feedback.create({
      name: name,
      email: email,
      comment: comment,
      rating: rating,
      allowEmailBack: allowEmailBack,
    })
      .then((message) => { return res.status(201).json({message}) })
      .catch((err) => { return res.status(400).json(err) })
  } catch (err) {
    return res.status(500).json(err)
  }

})

// Update One
router.put('/:id', async (req, res) => {
  const { name, email, comment, rating, allowEmailBack } = req.body
  //Add input validation
  try {
    await Feedback.update({
      name: name,
      email: email,
      comment: comment,
      rating: rating,
      allowEmailBack: allowEmailBack,
    }, { where: { id: req.params.id } })
      .then((message) => { return res.status(200).json({message}) })
      .catch((err) => { return res.status(400).json(err) })
  } catch (err) {
    return res.status(500).json(err)
  }
})

// Delete One
router.delete('/:id', async (req, res) => {
  try {
    await Feedback.destroy({ where: { id: req.params.id } })
      .then((message) => { return res.status(200).json({message}) })
      .catch((err) => { return res.status(400).json(err) })
  } catch (err) {
    return res.status(500).json(err)
  }
})

module.exports = router;
