require('dotenv').config()

const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')

app.use(express.json())

const posts = [
  {
    username: 'Kyle',
    title: 'Post 1'
  },
  {
    username: 'Jim',
    title: 'Post 2'
  }
]

app.get('/posts', authenticateToken, (req, res) => {
  res.json(posts.filter(p => p.username === req.user.name))
})

app.post('/login', (req, res) => {
  // Authenticate User
  const user = { name: req.body.username }
  const token = jwt.sign(
    user,
    process.env.TOKEN_SECRET,
    { expiresIn: '10m' }
  )
  res.json({ token: token })
})

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(" ")[1]
  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}

app.listen(process.env.PORT || 3000)