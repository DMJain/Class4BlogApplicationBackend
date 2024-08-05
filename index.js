// import the express and mongoose modules
const express = require("express");
const mongoose = require("mongoose");

const RateLimit = require("express-rate-limit"); //Used for only comment creation. for Blog creation create a new rate limiter

const {
    getAllBlogs,
    getBlog,
    getAllComments,
    getComment,
    getblogViews,
    getBlogViewUserIP,
} = require("./controller/getController");
const {
    createBlog,
    createComment,
    createReply,
} = require("./controller/postController");
const { updateBlog } = require("./controller/putController");
const { deleteBlog, deleteComment } = require("./controller/deleteController");

// Create an express application
const app = express();

// Connect to the database
mongoose
    .connect(
        "mongodb+srv://darshanj098:ab1TIu6fNI3R7Ses@cluster0.enofdyv.mongodb.net/bloggingApplication?retryWrites=true&w=majority&appName=Cluster0"
    )
    .then(() => {
        console.log("Connected to database");
    })
    .catch((err) => {
        console.error("Error connecting to database", err);
    });

// Middleware
app.use(express.json());

//Rate Limiter for the blog creation

// Rate Limiter for the comment creation
const commentCreationRateLimiter = RateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5, // limit each IP to 5 requests per windowMs
    standardHeaders: true, //to add information about the rate limit to the response headers
    message:
        "You have reached the maximum number of comments. Please try again later.",
});

// Routes

app.get("/", (req, res) => {
    const ip = req.socket.remoteAddress || req.ip;
    return res.json({ message: `Welcome to the blogging application! ${ip}` });
});

app.get("/blogs", getAllBlogs); // GET /blogs - Get all blogs
app.get("/blogs/:slug", getBlog); // GET /blogs/:slug - Get a blog by slug
app.get("/blogs/:slug/comments", getAllComments); // GET /blogs/:slug/comments - Get all comments for a blog
app.get("/blogs/:slug/comments/:commentID", getComment); // GET /blogs/:slug/comments/:commentID - Get a comment by commentID
app.get("/blogs/:slug/views", getblogViews); // GET /blogs/:slug/views - Get all views for a blog
app.get("/blogs/:slug/views/:viewID", getBlogViewUserIP); // GET /blogs/:slug/views/:viewID - Get a view by viewID

app.post("/blogs", createBlog); // POST /blogs - Create a new blog
app.post("/blogs/:slug/comments", commentCreationRateLimiter, createComment); // POST /blogs/:slug/comments - Add a comment to a blog
app.post("/blogs/:slug/comments/:commentId/replies",commentCreationRateLimiter,createReply); // POST /blogs/:slug/comments/:commentId/replies - Add a reply to a comment

app.put("/blogs/:slug", updateBlog); // PUT /blogs/:slug - Update a blog

app.delete("/blogs/:slug", deleteBlog); // DELETE /blogs/:slug - Delete a blog
app.delete("/blogs/:slug/comments/:commentID", deleteComment); // DELETE /blogs/:slug/comments/:commentID - Delete a comment by commentID

// Start the server
app.listen(8000, () => {
    console.log("Server is running on port 8000");
});
