// models/Admin.ts
import mongoose, { Schema, model, models } from 'mongoose';

const AdminSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
});

const Admin = models.Admin || model('Admin', AdminSchema);

export default Admin;
