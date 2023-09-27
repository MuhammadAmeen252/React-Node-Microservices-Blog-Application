const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require("cors");
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {

};

app.post('/posts/:id/comments', async (req, res) => {
    const commentId = randomBytes(4).toString('hex');
    const { content } = req.body;

    const comments = commentsByPostId[req.params.id] || [];
    comments.push({id: commentId, content: content, status: 'pending'});
    commentsByPostId[req.params.id] = comments;

    //sending new comment to query service through event bus
    await axios.post('http://event-bus-srv:4005/events', {
        type: 'CommentCreated',
        data: {
            id: commentId,
            content,
            postId: req.params.id,
            status: 'pending'
        }
    })
    res.status(201).send(comments);
});

app.get('/posts/:id/comments', (req, res) => {
    res.send(commentsByPostId[req.params.id] || []);
});

app.post('/events', async (req, res) => {
    console.log("Received Event: ", req.body.type);

    const {type, data} = req.body;
    if(type === 'CommentModerated'){
        const {postId, status, id, content} = data;
        const comments = commentsByPostId[postId];
        const comment = comments.find(comment => {
            return comment.id === id;
        })
        comment.status = status;
        //send a event to event bus to inform all services that comment is updated
        await axios.post('http://event-bus-srv:4005/events', {
            type:'CommentUpdated',
            data:{
                id,
                postId,
                status,
                content
            }
        })
    }

    res.send({});
})

app.listen(4001,() => {
    console.log('listening on port 4001');
})