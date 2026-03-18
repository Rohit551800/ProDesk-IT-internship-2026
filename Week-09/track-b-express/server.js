// ============================================================
//  THE DATA HUB — REST API Server
//  Track B: Node.js + Express
//  Levels 1 + 2 + 3 — All requirements covered
// ============================================================

const express = require('express')
const cors    = require('cors')
const { v4: uuidv4 } = require('uuid')

const app  = express()
const PORT = 5000

// ── MIDDLEWARE ───────────────────────────────────────────────────
app.use(cors())
app.use(express.json())   // parses JSON request bodies

// ── LEVEL 3: Custom Logger Middleware ────────────────────────────
// Runs on EVERY incoming request before it hits any route
app.use((req, res, next) => {
  const now  = new Date()
  const time = now.toLocaleTimeString('en-US', {
    hour:   '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
  console.log(`[${req.method}] ${req.url} — ${time}`)
  next()   // pass control to the next middleware / route handler
})

// ── LEVEL 2: Mock Database (in-memory array) ─────────────────────
// In a real app this would be MongoDB / PostgreSQL
let blogPosts = [
  {
    id:        uuidv4(),
    title:     'Getting Started with Next.js 15',
    content:   'Next.js 15 introduced several improvements including better caching and React 19 support.',
    author:    'Alice',
    createdAt: new Date().toISOString(),
  },
  {
    id:        uuidv4(),
    title:     'Understanding REST APIs',
    content:   'REST stands for Representational State Transfer. It defines a set of constraints for web services.',
    author:    'Bob',
    createdAt: new Date().toISOString(),
  },
]

// ── LEVEL 3: Fake Auth — POST /login ────────────────────────────
// Returns a mock JWT-like token (not a real JWT, for demo only)
app.post('/login', (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: 'username and password are required',
    })
  }

  // Simple fake validation (in real app: check DB + bcrypt)
  const validUsers = {
    admin: 'admin123',
    alice: 'pass1234',
    bob:   'mypassword',
  }

  if (validUsers[username.toLowerCase()] !== password) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials',
    })
  }

  // Generate a mock token (not a real JWT — just a signed-looking string)
  const header  = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64')
  const payload = Buffer.from(JSON.stringify({ sub: username, role: 'user', iat: Date.now() })).toString('base64')
  const sig     = Buffer.from(`mock_signature_${username}_${Date.now()}`).toString('base64')
  const mockToken = `${header}.${payload}.${sig}`

  console.log(`  → Login successful for user: ${username}`)

  res.json({
    success: true,
    message: `Welcome, ${username}!`,
    token:   mockToken,
    user:    { username, role: 'user' },
  })
})

// ── LEVEL 1 + 2: Blog CRUD Routes ───────────────────────────────

// GET /posts — return all posts
app.get('/posts', (req, res) => {
  res.json({
    success: true,
    count:   blogPosts.length,
    data:    blogPosts,
  })
})

// GET /posts/:id — return single post by ID
app.get('/posts/:id', (req, res) => {
  const post = blogPosts.find(p => p.id === req.params.id)

  if (!post) {
    return res.status(404).json({
      success: false,
      message: `Post with id "${req.params.id}" not found`,
    })
  }

  res.json({ success: true, data: post })
})

// POST /posts — create a new post
app.post('/posts', (req, res) => {
  const { title, content, author } = req.body

  // Basic validation
  if (!title || !content) {
    return res.status(400).json({
      success: false,
      message: 'title and content are required fields',
    })
  }

  const newPost = {
    id:        uuidv4(),
    title:     title.trim(),
    content:   content.trim(),
    author:    author?.trim() || 'Anonymous',
    createdAt: new Date().toISOString(),
  }

  blogPosts.push(newPost)

  console.log(`  → Created post: "${newPost.title}" (id: ${newPost.id})`)

  res.status(201).json({
    success: true,
    message: 'Post created successfully',
    data:    newPost,
  })
})

// PUT /posts/:id — update a post by ID
app.put('/posts/:id', (req, res) => {
  const idx = blogPosts.findIndex(p => p.id === req.params.id)

  if (idx === -1) {
    return res.status(404).json({
      success: false,
      message: `Post with id "${req.params.id}" not found`,
    })
  }

  const { title, content, author } = req.body

  // Merge existing data with new data (partial update support)
  blogPosts[idx] = {
    ...blogPosts[idx],
    ...(title   && { title:   title.trim() }),
    ...(content && { content: content.trim() }),
    ...(author  && { author:  author.trim() }),
    updatedAt: new Date().toISOString(),
  }

  console.log(`  → Updated post id: ${req.params.id}`)

  res.json({
    success: true,
    message: 'Post updated successfully',
    data:    blogPosts[idx],
  })
})

// DELETE /posts/:id — delete a post by ID
app.delete('/posts/:id', (req, res) => {
  const idx = blogPosts.findIndex(p => p.id === req.params.id)

  if (idx === -1) {
    return res.status(404).json({
      success: false,
      message: `Post with id "${req.params.id}" not found`,
    })
  }

  const deleted = blogPosts.splice(idx, 1)[0]

  console.log(`  → Deleted post: "${deleted.title}"`)

  res.json({
    success: true,
    message: 'Post deleted successfully',
    data:    deleted,
  })
})

// ── ROOT ROUTE — API Documentation ──────────────────────────────
app.get('/', (req, res) => {
  res.json({
    name:    'The Data Hub — REST API',
    version: '1.0.0',
    endpoints: {
      auth: {
        'POST /login':         'Login with username & password → returns mock token',
      },
      posts: {
        'GET /posts':          'Get all blog posts',
        'GET /posts/:id':      'Get single post by ID',
        'POST /posts':         'Create new post { title, content, author }',
        'PUT /posts/:id':      'Update post by ID',
        'DELETE /posts/:id':   'Delete post by ID',
      },
    },
    testCredentials: {
      username: 'admin',
      password: 'admin123',
    },
  })
})

// ── 404 Catch-all ────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.url} not found`,
  })
})

// ── START SERVER ─────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('\n╔════════════════════════════════════════╗')
  console.log(`║  The Data Hub is running on :${PORT}     ║`)
  console.log('╚════════════════════════════════════════╝')
  console.log('\nAvailable routes:')
  console.log('  GET    http://localhost:5000/posts')
  console.log('  GET    http://localhost:5000/posts/:id')
  console.log('  POST   http://localhost:5000/posts')
  console.log('  PUT    http://localhost:5000/posts/:id')
  console.log('  DELETE http://localhost:5000/posts/:id')
  console.log('  POST   http://localhost:5000/login')
  console.log('\n[Logger Middleware active — all requests logged below]\n')
})
