# The Data Hub — REST API Server

## Setup
```bash
npm install
npm run dev       # with auto-restart (nodemon)
# OR
npm start         # without auto-restart
```
Server runs at: http://localhost:5000

## All Endpoints

| Method | URL | Description |
|--------|-----|-------------|
| GET | /posts | Get all posts |
| GET | /posts/:id | Get one post |
| POST | /posts | Create post |
| PUT | /posts/:id | Update post |
| DELETE | /posts/:id | Delete post |
| POST | /login | Mock JWT login |

## Postman Test Sequence

### 1. GET all posts
- Method: GET
- URL: http://localhost:5000/posts

### 2. POST create a post
- Method: POST
- URL: http://localhost:5000/posts
- Body → raw → JSON:
```json
{
  "title": "My First Post",
  "content": "This is the content of my post.",
  "author": "Alice"
}
```
- Copy the `id` from the response

### 3. GET single post
- Method: GET
- URL: http://localhost:5000/posts/PASTE_ID_HERE

### 4. PUT update post
- Method: PUT
- URL: http://localhost:5000/posts/PASTE_ID_HERE
- Body → raw → JSON:
```json
{
  "title": "Updated Title"
}
```

### 5. DELETE post
- Method: DELETE
- URL: http://localhost:5000/posts/PASTE_ID_HERE

### 6. POST login (mock JWT)
- Method: POST
- URL: http://localhost:5000/login
- Body → raw → JSON:
```json
{
  "username": "admin",
  "password": "admin123"
}
```
