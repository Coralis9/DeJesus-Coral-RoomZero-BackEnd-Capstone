const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/Users');
const CollectedItem = require('./models/CollectedItems');
const Admin = require('./models/Admin');

dotenv.config();

const seed = async () => {
  try {
  
    await mongoose.connect(process.env.ATLAS_URI);

    
    await User.deleteMany({});
    await CollectedItem.deleteMany({});
    await Admin.deleteMany({});

    
    await Admin.create([
      { username: 'admin', password: 'YourSecurePassword123!' },
    ]);

  
    const ghostUser = await User.create([
      { username: 'ghost1', password: 'Ghost123!', highscore: 3 },
      { username: 'witchy', password: 'Witchy456!', highscore: 5 },
    ]);

    
    await CollectedItem.create([
      {
        user: ghostUser[0]._id,  
        items: ['Candle', 'Mirror', 'Key'],
        duration: 120,
      },
    ]);

    console.log('Database seeded successfully 🌱');
    process.exit();
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
};

seed();