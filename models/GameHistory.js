const mongoose = require('mongoose');

const gameHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  startedAt: {
    type: Date,
    default: Date.now,
  },
  endedAt: {
    type: Date,
  },
  result: {
    type: String,
    enum: ['win', 'loss', 'timeout'],
    required: true,
  },
  collectedItems: [String],
});


gameHistorySchema.virtual('duration').get(function () {
  if (this.startedAt && this.endedAt) {
    return Math.floor((this.endedAt - this.startedAt) / 1000); 
  }
  return null;
});


gameHistorySchema.virtual('durationFormatted').get(function () {
  const seconds = this.duration;
  if (seconds !== null) {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}m ${sec}s`;
  }
  return '🫥 Unknown';
});

gameHistorySchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('GameHistory', gameHistorySchema);
