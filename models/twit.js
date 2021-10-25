const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const twitSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  snippet: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true
  },
}, { timestamps: true });

const Twit = mongoose.model('Twit', twitSchema);
module.exports = Twit;