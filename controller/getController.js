const Blog = require("../models/blog.model");
const Comment = require("../models/comment.model");
const View = require("../models/view.model");

const { populateComments } = require("../utils/functions");

//Get All blogs
const getAllBlogs = async (req, res) => {
  // Destructure the includesIsActive query parameter from the request
  const { includesInActive = false } = req.query;
  // If includesIsActive is true, return all blogs
  const blogs = includesInActive
    ? await Blog.find()
    : await Blog.find({ isActive: true });

  if (!blogs) {
    return res.status(404).json({ error: `No blogs found` });
  }

  return res.json({ blogs });
};

//Get a blog by slug
const getBlog = async (req, res) => {
  // Destructure the slug and includesIsActive query parameters from the request
  const slug = req.params.slug;
  const { includesInActive = false } = req.query;

  // If includesIsActive is true, return the blog by slug
  const blog = includesInActive
    ? await Blog.findOne({ slug: slug })
    : await Blog.findOne({ slug: slug, isActive: true });

  if (!blog) {
    return res.status(404).json({ error: `Blog not found` });
  }

  // get the IP address of the user
  const ip = req.socket.remoteAddress || req.ip;

  // check if the user has viewed the blog before
  const userView = blog.viewsIp.filter((view) => view.viewId !== ip);

  // if the user has not viewed the blog before, create a new view
  if (userView.length === 0) {
    const view = await View.create({ ip: ip, views: 1 });
    // add the view to the blog
    blog.viewsIp.push({ viewId: view.id, ip: ip });
  } else {
    const view = await View.findById(userView[0].viewId);
    // check if the user has viewed the blog less than 10 times
    if (view.views < 10) {
      view.views++;
      await view.save();
    } else {
      return res.status(403).json({
        message: `You have reached the maximum number of views for this blog`,
      });
    }
  }

  blog.totalViews++;

  await blog.save();

  return res.json({ blog });
};

const getAllComments = async (req, res) => {
  // Destructure the slug from the request parameters
  const slug = req.params.slug;

  // Find the blog by slug
  const blog = await Blog.findOne({ slug: slug, isActive: true });

  // Populate comments with replies
  const comments = await populateComments(blog.comments);

  return res.json({ title: blog.title, slug: blog.slug, comments: comments });
};

const getComment = async (req, res) => {
  // Destructure the slug and commentID from the request parameters
  const slug = req.params.slug;
  const commentID = req.params.commentID;

  const comment = await Comment.findById(commentID);

  if (!comment) {
    return res.status(404).json({ error: `Comment not found` });
  }

  // Populate comments with replies
  const returnComment = await populateComments([commentID]);

  return res.json({ comment: returnComment });
};

const getblogViews = async (req, res) => {
  // Destructure the slug from the request parameters
  const slug = req.params.slug;

  // Find the blog by slug
  const blog = await Blog.findOne({ slug: slug, isActive: true }).populate(
    "viewsIp"
  );

  if (!blog) {
    return res.status(404).json({ error: `Blog not found` });
  }

  return res.json({
    title: blog.title,
    slug: blog.slug,
    totalViews: blog.totalViews,
    viewsIP: blog.viewsIp,
  });
};

const getBlogViewUserIP = async (req, res) => {
  // Destructure the slug and viewID from the request parameters
  const slug = req.params.slug;
  const viewID = req.params.viewID;

  const blog = await Blog.findOne({ slug: slug, isActive: true });

  if (!blog) {
    return res.status(404).json({ error: `Blog not found` });
  }

  const view = await View.findById(viewID);

  if (!view) {
    return res.status(404).json({ error: `View not found` });
  }

  return res.end(
    `IP Address: "${view.ip}" has viewed blog "${blog.title}" ${view.views} time`
  );
};

module.exports = {
  getAllBlogs,
  getBlog,
  getAllComments,
  getComment,
  getblogViews,
  getBlogViewUserIP,
};
