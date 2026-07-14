const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
    },
    leaveType: {
      type: String,
      enum: ['Sick Leave', 'Casual Leave', 'Paid Leave', 'Unpaid Leave'],
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    numberOfDays: {
      type: Number,
      default: 0,
    },
    reason: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // the Admin/HR who approved/rejected it
    },
  },
  {
    timestamps: true,
  }
);

// Automatically calculate number of days whenever a leave is created/saved
leaveSchema.pre('save', function () {
  if (this.startDate && this.endDate) {
    const diffMs = this.endDate - this.startDate;
    this.numberOfDays = Math.round(diffMs / (1000 * 60 * 60 * 24)) + 1; // inclusive of both start and end day
  }
});

module.exports = mongoose.model('Leave', leaveSchema);