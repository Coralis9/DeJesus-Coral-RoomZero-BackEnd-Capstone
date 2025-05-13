const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/Users');  

const authRoutes = require('./routes/authRoutes');
const gameRoutes = require('./routes/GameRoutes');
const statsRoutes = require('./routes/StatsRoutes');

dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.get('/', (req, res) =>
  res.send('👻 Welcome It Seems You Want To Use This Game API Mhmmm...Good Luck ! It\'s Haunted 🕯️')
);

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/game', gameRoutes);
app.use('/api/stats', statsRoutes);

app.listen(PORT, () => {
  console.log(`
🌑 The fog rolls in...
🕯️ Candles flicker in the shadows...
🎶 "It's close to midnight
Something evil's lurking in the dark
Under the moonlight
You see a sight that almost stops your heart
You try to scream
But terror takes the sound before you make it
You start to freeze
As horror looks you right between the eyes
You're paralyzed" 🎶

👻 Haunted Game Server has awakened 👻
🔐 Secret Key: ${process.env.NODE_ENV !== 'production' ? `"${process.env.KEY_WORD}"` : '(hidden in the shadows)'}
🧛‍♂️ Running on PORT ${PORT}... Beware who enters.
  `);
});