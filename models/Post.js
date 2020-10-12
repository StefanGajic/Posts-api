const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    title: {
      type: String,
      unique: true,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User"
    }
  });

  module.exports = mongoose.model("Posts", PostSchema);
