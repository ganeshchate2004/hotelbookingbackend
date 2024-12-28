const express = require('express');
const Hotel = require('../models/Hotel');
const Comment = require('../models/Comment');
const auth = require('../middleware/auth');

const router = express.Router();

// Add a hotel
router.post('/add-hotel', auth, async (req, res) => {
  try {
    const { image, name, location, price, description } = req.body;
    const newHotel = new Hotel({ image, name, location, price, description });
    await newHotel.save();
    res.json({ message: 'Hotel added successfully' });
  } catch (err) {
    console.error('Error adding hotel:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Get all hotels
router.get('/hotels', async (req, res) => {
  try {
    const hotels = await Hotel.find({});
    res.json(hotels);
  } catch (err) {
    console.error('Error fetching hotels:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Search hotels
router.get('/search', async (req, res) => {
  const { location, name } = req.query;
  try {
    const filter = {};
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (name) filter.name = { $regex: name, $options: 'i' };

    const hotels = await Hotel.find(filter);
    res.json(hotels);
  } catch (err) {
    console.error('Error searching hotels:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Get comments for a hotel
router.get('/hotel/:id/comments', async (req, res) => {
  const hotelId = req.params.id;
  try {
    const comments = await Comment.find({ hotelId })
      .populate('userId', 'username')
      .exec();
    res.json(comments);
  } catch (err) {
    console.error('Error fetching comments:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Post a comment for a hotel
router.post('/hotel/:id/comments', auth, async (req, res) => {
  const hotelId = req.params.id;
  const { text, rating } = req.body;

  try {
    const newComment = new Comment({
      userId: req.user._id,
      hotelId,
      text,
      rating,
    });
    await newComment.save();
    res.json({ message: 'Comment posted successfully' });
  } catch (err) {
    console.error('Error posting comment:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
