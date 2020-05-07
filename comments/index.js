const express = require('express');
const { randomBytes } = require('crypto');
const bodyParser = require('body-parser')
const cors = require('cors');
const axios = require('axios');

const app = express();
const commentsById = {};

app.use(bodyParser.json());
app.use(cors());

app.get('/posts/:id/comments', (req, res) => {
    res.send(commentsById[req.params.id] || []);
})

app.post('/posts/:id/comments', async (req, res) => {
    const commentId = randomBytes(4).toString('hex');
    const { content } = req.body;

    const comments = commentsById[req.params.id] || [];
    comments.push({ id: commentId, content });

    commentsById[req.params.id] = comments;

    await axios.post('http://localhost:4005/events', {
        type: 'CommentCreated',
        data: {
            id: commentId,
            content,
            postId: req.params.id
        }
    })

    res.status(201).send(comments);
})

app.post('/events',(req,res) => {
    res.send({});
})

app.listen(4001, () => {
    console.log('Listening on 4001')
})