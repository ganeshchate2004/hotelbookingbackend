const express = require('express');
const Booking = require('../models/Booking');
const Hotel = require('../models/Hotel');
const auth = require('../middleware/auth');

const router = express.Router();

// Book a hotel
router.post('/book-hotel/:id', auth, async (req, res) => {
  const hotelId = req.params.id;
  const { startDate, endDate, mobileNumber, numberOfPersons, scannedImage } = req.body;

  try {
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    const totalPrice = hotel.price * numberOfPersons;

    const newBooking = new Booking({
      hotelId,
      userId: req.user._id,
      startDate,
      endDate,
      mobileNumber,
      numberOfPersons,
      scannedImage,
      totalPrice,
    });

    await newBooking.save();
    res.json({ message: 'Booking successful', booking: newBooking });
  } catch (err) {
    console.error('Error during booking:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Get all bookings
router.get('/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find().populate('hotelId').populate('userId');
    const response = bookings.map((booking) => ({
      ...booking.toObject(),
      hotel: booking.hotelId,
      user: {
        username: booking.userId?.username || 'Unknown User',
      },
    }));
    res.json(response);
  } catch (err) {
    console.error('Error fetching bookings:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
