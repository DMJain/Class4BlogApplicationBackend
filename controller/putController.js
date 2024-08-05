const Blog = require("../models/blog.model");

const updateBlog = async (req, res) => {
  // Destructure the slug, title, body, author, and isActive from the request body
  const slug = req.params.slug;
  const { title, body, author, isActive } = req.body;

  // Create an object with the updated fields
  const updatedFields = {};
  // If the title, body, author, or isActive is provided, add it to the updatedFields object
  if (title) {
    updatedFields.title = title;
  }
  if (body) {
    updatedFields.body = body;
  }
  if (author) {
    updatedFields.author = author;
  }
  if (isActive !== undefined) {
    updatedFields.isActive = isActive;
  }

  // Find the blog by slug and update it
  const updatedBlog = await Blog.findOneAndUpdate(
    { slug: slug },
    { $set: updatedFields },
    { new: true }
  );

  // If no blog is found, return a 404 error
  if (!updatedBlog) {
    return res.status(404).json({ error: `Blog not found` });
  }

  // Return the updated blog
  return res.json({ blog: updatedBlog });
};

module.exports = { updateBlog };
