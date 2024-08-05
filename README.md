# Class4BlogApplicationBackend

## Description
This is practice assingment for MondoDB and Express.

## Installation
1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/yourproject.git
    ```
2. Navigate to the project directory:
    ```sh
    cd yourproject
    ```
3. Install the required npm packages:
    ```sh
    npm install
    ```

## Required npm Packages
- express
- mongoose
- bad-words
- express-rate-limit
- @types/express (dev dependency)
- nodemon (dev dependency)

## Routes Available are:

### GET Routes
- `/blogs` - get all Blogs
    - Query
        - `includesInActive` (optional) - if true then the response will contain deleted blogs 
- `/blogs/:slug` - Get a blog by slug
    - Query
        - `includesInActive` (optional) - if true then the response will contain deleted blogs 
- `/blogs/:slug/comments` - Get all comments for a blog
- `/blogs/:slug/comments/:commentID` - Get a comment by commentID
- `/blogs/:slug/views` - Get all views for a blog
- `/blogs/:slug/views/:viewID` - Get a view by viewID

### Post Routes
- `/blogs` - Create a new blog
- `/blogs/:slug/comments` - Add a comment to a blog
- `/blogs/:slug/comments/:commentId/replies` - Add a reply to a comment

### Put Routes
- `/blogs/:slug` - Update a blog

### Delete Routes
- `/blogs/:slug` - Delete a blog
- `/blogs/:slug/comments/:commentID` - Delete a comment by commentID and all the replies associated with a comment

## Running the Project
1. Start the development server:
    ```sh
    npm run dev
    ```
2. You can make requests at `http://localhost:8000`.
