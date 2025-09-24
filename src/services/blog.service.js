import BlogModel from "../models/blog.model.js";

class BlogService {
  // Add Blog
  async addBlog(data) {
    try {
      const newBlog = new BlogModel(data);
      await newBlog.save();
      return { success: true, status: 201, data: newBlog };
    } catch (error) {
      console.error("addBlog error", error);
      return { success: false, status: 500, message: "Error adding blog" };
    }
  }

  // Edit Blog
  async editBlog(blogId, data) {
    try {
      const updatedBlog = await BlogModel.findOneAndUpdate(
        { blogId },
        data,
        { new: true }
      );
      if (!updatedBlog) {
        return { success: false, status: 404, message: "Blog not found" };
      }
      return { success: true, status: 200, data: updatedBlog };
    } catch (error) {
      console.error("editBlog error", error);
      return { success: false, status: 500, message: "Error updating blog" };
    }
  }

  // Delete Blog
  async deleteBlog(blogId) {
    try {
      const deletedBlog = await BlogModel.findOneAndDelete({ blogId });
      if (!deletedBlog) {
        return { success: false, status: 404, message: "Blog not found" };
      }
      return { success: true, status: 200, message: "Blog deleted successfully" };
    } catch (error) {
      console.error("deleteBlog error", error);
      return { success: false, status: 500, message: "Error deleting blog" };
    }
  }

  // Get All Blogs
  async getBlogs() {
    try {
      const blogs = await BlogModel.find().sort({ createdOn: -1 });
      return { success: true, status: 200, data: blogs };
    } catch (error) {
      console.error("getBlogs error", error);
      return { success: false, status: 500, message: "Error fetching blogs" };
    }
  }

  // Get Blog By ID
  async getBlogById(blogId) {
    try {
      const blog = await BlogModel.findOne({ blogId });
      if (!blog) {
        return { success: false, status: 404, message: "Blog not found" };
      }
      return { success: true, status: 200, data: blog };
    } catch (error) {
      console.error("getBlogById error", error);
      return { success: false, status: 500, message: "Error fetching blog" };
    }
  }
}

export default BlogService;
