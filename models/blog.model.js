const { Schema, model, mongoose } = require("mongoose");
const commentSchema = require("./comment.model");
const viewSchema = require("./view.model");

const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    body: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    totalViews: {
      type: Number,
      default: 0,
    },
    ip: {
      type: String,
      required: true,
    },
    comments: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Comment", // Reference the Comment model name
    },
    viewsIp: [
      {
        viewId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "View", // Reference the View model name
        },
        ip: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Blog = model("blog", blogSchema);
module.exports = Blog;
