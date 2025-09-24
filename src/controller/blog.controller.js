import BlogService from "../services/blog.service.js";

const blogService = new BlogService();

// Add Blog
export const addBlogController = async (req, res) => {
  try {
    const response = await blogService.addBlog(req.body);
    return res.status(response.status).json(response);
  } catch (error) {
    console.error("addBlogController error", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Edit Blog
export const editBlogController = async (req, res) => {
  try {
    const { blogId } = req.params;
    const response = await blogService.editBlog(blogId, req.body);
    return res.status(response.status).json(response);
  } catch (error) {
    console.error("editBlogController error", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete Blog
export const deleteBlogController = async (req, res) => {
  try {
    const { blogId } = req.params;
    const response = await blogService.deleteBlog(blogId);
    return res.status(response.status).json(response);
  } catch (error) {
    console.error("deleteBlogController error", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get All Blogs
export const getBlogsController = async (req, res) => {
  try {
    const response = await blogService.getBlogs();
    return res.status(response.status).json(response);
  } catch (error) {
    console.error("getBlogsController error", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get Blog by ID
export const getBlogByIdController = async (req, res) => {
  try {
    const { blogId } = req.params;
    const response = await blogService.getBlogById(blogId);
    return res.status(response.status).json(response);
  } catch (error) {
    console.error("getBlogByIdController error", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
