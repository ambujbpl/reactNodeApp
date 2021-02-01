const mongoose = require('mongoose');
const { Schema } = mongoose;

const recipientListSchema = new Schema({
  recipientName: String,
  emailList: String,
  _user: { type: Schema.Types.ObjectId, ref: 'User' },
  createdDate: Date,
  lastUpdate: Date
});

mongoose.model('recipientList', recipientListSchema);