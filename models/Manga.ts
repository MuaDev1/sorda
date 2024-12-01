import mongoose from 'mongoose';

const MangaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  categories: [String],
  imageUrl: {
    type: String,
    required: true,
  },
  publisher: {
    userId: { type: String, required: true },
    name: { type: String, required: true },
    avatar: { type: String, required: true },
  },
  likes: { type: Number, default: 0 },
  views: { type: Number, default: 0 }, 
  likedBy: [String],
  comments: [
    {
      userId: String,
      username: String,
      avatar: String,
      text: String,
    },
  ],
  chapters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chapter' }],
  });


const Manga = mongoose.models.Manga || mongoose.model('Manga', MangaSchema);

export default Manga;
