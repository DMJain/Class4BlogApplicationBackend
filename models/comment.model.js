const { Schema, model, mongoose } = require("mongoose");

const commentSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  ip: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  replies: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Comment", // Reference the Comment model name
  },
});

const Comment = model("Comment", commentSchema);
module.exports = Comment;
