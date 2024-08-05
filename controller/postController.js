const Blog = require("../models/blog.model");
const Comment = require("../models/comment.model");

const { blogCreationRateLimiter } = require("../utils/rateLimiter");
const { isValidSlug } = require("../utils/functions");

const Filter = require("bad-words");

const filter = new Filter();

const createBlog = async (req, res) => {
  if (filter.isProfane(req.body.body)) {
    return res.status(400).json({
      error: `Please refrain from using profanity in your`,
      body: filter.clean(req.body.body),
    });
  }

  const ip = req.socket.remoteAddress || req.ip;

  if (blogCreationRateLimiter(ip)) {
    return res.status(429).json({
      error: `You have reached the maximum number of blog creations. Please try again later.`,
    });
  }

  // Destructure the title, slug, body, and author from the request body
  const { title, slug, body, author } = req.body;

  // check if the slug is valid
  if (!isValidSlug(slug)) {
    return res.status(400).json({ error: "Invalid slug" });
  }

  //define the isActive, totalViews, viewsIp, comments, and ip
  const isActive = true;
  const totalViews = 0;
  const viewsIp = [];
  const comments = [];

  // Create a new blog
  const blog = await Blog.create({
    title,
    slug,
    body,
    author,
    isActive,
    totalViews,
    ip,
    viewsIp,
    comments,
  });

  // Return the new blog
  return res.json({ blog });
};

const createComment = async (req, res) => {
  // Destructure the slug, name, and comment from the request body
  const ip = req.socket.remoteAddress || req.ip;

  const slug = req.params.slug;
  const { name, comment } = req.body;

  // Find the blog by slug
  const blog = await Blog.findOne({ slug: slug, isActive: true });

  // If no blog is found, return a 404 error
  if (!blog) {
    return res.status(404).json({ error: `Blog not found` });
  }

  // get the IP address of the user

  // create a new comment
  const newComment = await Comment.create({ name, ip, comment });

  // add the comment to the blog
  blog.comments.push(newComment.id);

  // save the blog
  await blog.save();

  // return the blog
  return res.json({ blog });
};

const createReply = async (req, res) => {
  // Destructure the slug, commentId, and reply from the request body
  const slug = req.params.slug;
  const commentId = req.params.commentId;
  const { name, comment } = req.body;

  // Find the blog by slug
  const blog = await Blog.findOne({ slug: slug, isActive: true });

  // If no blog is found, return a 404 error
  if (!blog) {
    return res.status(404).json({ error: `Blog not found` });
  }

  // Find the comment by commentId
  const commentUpdate = await Comment.findById(commentId);

  // If no comment is found, return a 404 error
  if (!commentUpdate) {
    return res.status(404).json({ error: `Comment not found` });
  }

  // get the IP address of the user
  const ip = req.socket.remoteAddress || req.ip;

  // create a new comment
  const newComment = await Comment.create({ name, ip, comment });

  // add the comment to the replies array of the comment
  commentUpdate.replies.push(newComment.id);

  // save the comment
  await commentUpdate.save();

  // return the blog
  return res.json({ commentUpdate });
};

module.exports = { createBlog, createComment, createReply };
