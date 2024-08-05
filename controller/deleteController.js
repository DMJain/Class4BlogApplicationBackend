const Blog = require("../models/blog.model");
const Comment = require("../models/comment.model");

const { deleteReplies } = require("../utils/functions");

const deleteBlog = async (req, res) => {
  // Destructure the slug from the request parameters
  const slug = req.params.slug;

  // Find the blog by slug and set isActive to false
  const blog = await Blog.findOneAndUpdate(
    { slug: slug },
    { $set: { isActive: false } },
    { new: true }
  );

  // If no blog is found, return a 404 error
  if (!blog) {
    return res.status(404).json({ error: `Blog with id ${id} not found` });
  }

  // Return the deleted blog
  return res.json({ blog });
};

const deleteComment = async (req, res) => {
  // Destructure the slug and commentID from the request parameters
  const slug = req.params.slug;
  const commentID = req.params.commentID;

  // Find the blog by slug
  const blog = await Blog.findOne({ slug: slug, isActive: true });

  // If no blog is found, return a 404 error
  if (!blog) {
    return res.status(404).json({ error: `Blog not found` });
  }

  // Find the comment by commentID
  const comment = await Comment.findById(commentID);

  // If no comment is found, return a 404 error
  if (!comment) {
    return res.status(404).json({ error: `Comment not found` });
  }

  //Delete the replies of the comment
  await deleteReplies(comment.replies);

  // Delete the comment by commentID
  await Comment.findByIdAndDelete(commentID);

  // Remove the comment from the blog
  blog.comments = blog.comments.filter((comment) => comment != commentID);
  blog.save();

  // Return the blog
  return res.json({ blog });
};

module.exports = { deleteBlog, deleteComment };
