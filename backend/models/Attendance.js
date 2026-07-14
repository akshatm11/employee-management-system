const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
    },
    date: {
      type: Date,
      required: true,
      // We store just the date (no time) so we can easily find "today's" record
    },
    checkIn: {
      type: Date,
    },
    checkOut: {
      type: Date,
    },
    workingHours: {
      type: Number, // calculated automatically, in hours
      default: 0,
    },
    status: {
      type: String,
      enum: ['present', 'absent', 'half-day', 'on-leave'],
      default: 'present',
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate attendance records for the same employee on the same day
attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);