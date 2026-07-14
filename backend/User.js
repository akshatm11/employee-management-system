const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Defines the structure of a "User" document in MongoDB
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true, // removes extra spaces
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true, // no two users can have the same email
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false, // never return password by default when querying users
    },
    role: {
      type: String,
      enum: ['admin', 'hr', 'employee'], // only these 3 values are allowed
      default: 'employee',
    },
    isActive: {
      type: Boolean,
      default: true, // used later to "deactivate" a user instead of deleting
    },
  },
  {
    timestamps: true, // automatically adds createdAt and updatedAt fields
  }
);

// --- Mongoose Middleware ---
// This runs automatically BEFORE a user document is saved to the database
userSchema.pre('save', async function (next) {
  // Only hash the password if it was newly set or changed
  if (!this.isModified('password')) {
    return next();
  }

  // Generate a "salt" (random data added before hashing, for extra security)
  const salt = await bcrypt.genSalt(10);
  // Replace the plain password with its hashed version
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// --- Instance Method ---
// Lets us easily compare a plain-text password (from login form) with the hashed one in DB
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);