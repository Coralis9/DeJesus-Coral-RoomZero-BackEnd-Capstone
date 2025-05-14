const mongoose = require('mongoose');
const Admin = mongoose.model('Admin', adminSchema);

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  role: {
    type: String,
    default: 'admin',
  }
});


module.exports = Admin;