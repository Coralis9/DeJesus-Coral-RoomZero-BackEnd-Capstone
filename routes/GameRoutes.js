const express = require('express');
const router = express.Router();
const CollectedItem = require('../models/CollectedItems');
const User = require('../models/Users');
const verifyToken = require('../Jwt/verifyToken');
const GameHistory = require('../models/GameHistory');

const REQUIRED_ITEMS = ['key', 'flashlight', 'map', 'notebook']; 


router.post('/start-game', verifyToken, async (req, res) => {
  const userId = req.userId;

  try {
    await CollectedItem.deleteMany({ userId });

    const newGame = new GameHistory({
      userId,
      result: 'loss', 
    });
    await newGame.save();

    res.json({
      message: '🕯️ The candlelight flickers violently as you step inside. A new nightmare begins... All items have vanished into the dark.',
      gameStarted: true,
      gameId: newGame._id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to start game' });
  }
});


router.patch('/collect-item', verifyToken, async (req, res) => {
  const { itemName } = req.body;
  const userId = req.userId;

  try {
    const existingItem = await CollectedItem.findOne({ userId, itemName });
    if (existingItem) {
      return res.status(400).json({ message: 'Item already collected!' });
    }

    const newItem = new CollectedItem({ userId, itemName });
    await newItem.save();

    const collectedItems = await CollectedItem.find({ userId }).select('itemName -_id');
    const itemNames = collectedItems.map(item => item.itemName);

    const allItemsCollected = REQUIRED_ITEMS.every(item => itemNames.includes(item));
    const user = await User.findById(userId);

    if (user) {
      user.highscore = Math.max(user.highscore, itemNames.length);
      await user.save();
    }

    if (allItemsCollected) {
      const now = new Date();
      const startedGame = await GameHistory.findOne({ userId, result: 'loss' }).sort({ startedAt: -1 });

      if (startedGame) {
        const durationMs = now - startedGame.startedAt;
        const minutes = Math.floor(durationMs / 60000);
        const seconds = Math.floor((durationMs % 60000) / 1000);

        startedGame.endedAt = now;
        startedGame.result = 'win';
        startedGame.collectedItems = itemNames;
        await startedGame.save();

        if (user) {
          user.victories += 1;

          const existingFastest = user.fastestTime?.minutes * 60 + user.fastestTime?.seconds || Infinity;
          const thisTime = minutes * 60 + seconds;
          if (thisTime < existingFastest) {
            user.fastestTime = { minutes, seconds };
          }

          user.collectedItems = itemNames;
          await user.save();
        }

        return res.json({
          message: '🎉 You collected all items and escaped Room Zero!',
          gameStatus: 'You Win!',
          duration: { minutes, seconds },
          collectedItems: itemNames,
        });
      }
    }

    return res.json({
      message: 'Item collected',
      collectedItems: itemNames,
      highscore: user?.highscore || itemNames.length,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error collecting item' });
  }
});

// View collected items
router.get('/collected-items', verifyToken, async (req, res) => {
  const userId = req.userId;

  try {
    const items = await CollectedItem.find({ userId }).select('itemName collectedAt -_id');
    res.json({ collectedItems: items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not retrieve collected items' });
  }
});

//  View fastest wins
router.get('/fastest-wins', verifyToken, async (req, res) => {
  const userId = req.userId;

  try {
    const wins = await GameHistory.find({ userId, result: 'win' }).sort({ endedAt: 1 }).lean();
    const winsWithDuration = wins.map(game => {
      const duration = Math.floor((new Date(game.endedAt) - new Date(game.startedAt)) / 1000);
      return { ...game, duration };
    });

    res.json(winsWithDuration);
  } catch (err) {
    res.status(500).json({ message: 'Could not retrieve win records' });
  }
});

module.exports = router;