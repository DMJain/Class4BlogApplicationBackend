const Comment = require("../models/comment.model");

const populateComments = async (comments) => {
  const populatedComments = [];

  // Loop through each comment and populate the replies
  for (let i = 0; i < comments.length; i++) {
    // Create an object to store the comment data
    const comment = {};
    // Find the comment by ID
    const commentData = await Comment.findById(comments[i]);
    // Populate the comment data
    comment.id = commentData.id;
    comment.name = commentData.name;
    comment.comment = commentData.comment;
    comment.ip = commentData.ip;
    // If the comment has replies, populate the replies
    comment.replies = await populateComments(commentData.replies);
    // Add the comment to the populatedComments array
    populatedComments.push(comment);
  }
  return populatedComments;
};

const deleteReplies = async (replies) => {
  for (let i = 0; i < replies.length; i++) {
    const reply = await Comment.findById(replies[i]);
    if (reply.replies.length > 0) {
      await deleteReplies(reply.replies);
    }
    await Comment.findByIdAndDelete(replies[i]);
  }
};

//Function to regex the slug
function isValidSlug(slug) {
  const slugRegex = /^[a-z0-9]+(_[a-z0-9]+)*$/;
  return slugRegex.test(slug);
}

module.exports = { populateComments, deleteReplies, isValidSlug };
