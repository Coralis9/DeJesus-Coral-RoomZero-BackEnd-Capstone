const mongoose = require('mongoose');

const collectedItemSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  itemName: {
    type: String,
    required: true,
  },
  collectedAt: {
    type: Date,
    default: Date.now,
  },
});

const CollectedItem = mongoose.model('CollectedItem', collectedItemSchema);

module.exports = CollectedItem;
