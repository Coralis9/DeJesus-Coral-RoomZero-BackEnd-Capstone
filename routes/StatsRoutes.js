const express = require('express');
const router = express.Router();
const User = require('../models/Users'); 
const GameHistory = require('../models/GameHistory');
const verifyToken = require('../Jwt/verifyToken');

function formatDuration(input) {
  if (typeof input === 'number') {
    const min = Math.floor(input / 60);
    const sec = input % 60;
    return `${min}m ${sec}s`;
  } else if (input && typeof input === 'object') {
    return `${input.minutes || 0}m ${input.seconds || 0}s`;
  } else {
    return 'Unknown';
  }
}

router.get('/stats', verifyToken, async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId).lean();
    if (!user) return res.status(404).json({ message: 'User not found' });

    const gameHistory = await GameHistory.find({ userId }).sort({ endedAt: -1 }).limit(5).lean();
    const totalGames = await GameHistory.countDocuments({ userId });

    res.json({
      username: user.username,
      totalGames,
      victories: user.victories,
      losses: user.losses,
      timeouts: user.timeouts,
      highscore: user.highscore,
      lowscore: user.lowscore,
      fastestEscapeTime: user.fastestTime
        ? formatDuration(user.fastestTime)
        : 'No wins recorded yet 👻',
      recentGames: gameHistory.map(game => {
        const durationSec = game.endedAt && game.startedAt
          ? Math.floor((new Date(game.endedAt) - new Date(game.startedAt)) / 1000)
          : null;

        return {
          result: game.result,
          duration: durationSec !== null
            ? formatDuration(durationSec)
            : '🤫 Shh... Something went wrong!',
        };
      }),
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not load stats.' });
  }

  router.get('/leaderboard', async (req, res) => {
    try {
      const leaderboard = await User.find()
        .sort({ highscore: -1 }) 
        .limit(10) 
        .select('username highscore victories')
        .lean();
  
      res.json({
        leaderboard,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Could not load leaderboard.' });
    }
  });

  router.get('/achievements', verifyToken, async (req, res) => {
    try {
      const userId = req.userId;
      const user = await User.findById(userId).lean();
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      
      const firstWin = await GameHistory.findOne({ userId, result: 'win' }).sort({ date: 1 }).lean();
  
      
      const fastestWin = await GameHistory.findOne({ userId, result: 'win' })
        .sort({ duration: 1 }) 
  
      res.json({
        firstWin: firstWin
          ? `🏆 First win achieved on ${firstWin.date}`
          : 'No wins yet, keep trying! 🎮',
        fastestWin: fastestWin
          ? `⏱ Fastest win: ${formatDuration(fastestWin.duration)}`
          : 'No wins recorded yet 👻',
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Could not load achievements.' });
    }
  });
});


module.exports = router;