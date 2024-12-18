import mongoose, { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    default: 'user', // الرتبة الافتراضية هي "user"
  },
});

const User = models.User || model('User', UserSchema);

export default User;
