import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const blogSchema = new mongoose.Schema({
  blogId: {
    type: String,
    default: uuidv4,
    unique: true,
    index: true,
  },
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
  },
  description: {
    type: String,
  },
  imageUrl: {
    type: String,
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
});

// Create Model
const BlogModel = mongoose.model("Blog", blogSchema);

export default BlogModel;
