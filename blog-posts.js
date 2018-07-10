const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPosts} = require('./models');

//blog post examples
BlogPosts.create('Monday', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit,' +
'sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' + 
'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', '-ME');
BlogPosts.create('Tuesday', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit,' +
'sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' + 
'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', '-ME');
BlogPosts.create('Wednesday', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit,' +
'sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' + 
'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', '-ME');

//for GET endpoint
router.get('/', (req, res) => {
    res.json(BlogPosts.get());
});

//to post new blog post (POST endpoint)
router.post('/', jsonParser, (req, res) => {
    const requiredFields = ['title', 'content', 'author'];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing required \`${field}\` in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    }
    const item = BlogPosts.create(req.body.title, req.body.content, req.body.author);
    res.status(201).json(item);
});

//to delete a blog post
router.delete('/:id', (req, res) => {
    BlogPosts.delete(req.params.id);
    console.log(`Deleted blog post \`${req.params.ID}\``);
    res.status(204).end();
});

//update blog post
router.put('/:id', jsonParser, (req, res) => {
    const requiredFields = ['title', 'content', 'author'];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    }
    if (req.params.id !== req.body.id) {
        const message = (`Request path id (${req.params.id}) and request body id (${req.body.id}) must match`);
        console.error(message);
        return res.status(400).send(message);
    }
    console.log(`Updating blog post \`${req.params.id}\``);
    BlogPosts.update({
        id: req.params.id,
        title: req.body.title,
        content: req.body.content,
        author: req.body.author
    });
    res.status(204).end();
});

module.exports = router;

