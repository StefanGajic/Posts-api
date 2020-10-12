const express = require('express');
const router = express.Router();
const verify = require('./verifyToken');
const Post = require('../models/Post');

router.get('/', async (req, res) => {
    try {
        const posts = await Post.find();
        res.json(posts);
    } catch (err) {
        res.json({ message: err });
    }
});

router.post('/', verify, async (req, res) => {
    const user = req.user
    const post = new Post({
        title: req.body.title,
        description: req.body.description,
        user: user
    })
    try {
        const savedPost = await post.save();
        res.json(savedPost);
    } catch (err) {
        res.json({ message: err });
    }
});

router.get('/:postId', async (req, res) => {
    try {
        const onePost = await Post.findById(req.params.postId);
        res.json(onePost)
    } catch (err) {
        res.json({ message: err });
    }
})

router.patch('/:postId', verify, checkIfPostOwner, async (req, res) => {
    try {
        const updatedPost = await Post.updateOne({ _id: req.params.postId },
             { $set: { title: req.body.title, description: req.body.description} }
             );
        res.json(updatedPost)
    } catch (err) {
        res.json({ message: err });
    }
})

router.delete('/:postId', verify, checkIfPostOwner, async (req, res) => {
    try {
        const removedPost = await Post.remove({ _id: req.params.postId });
        res.json(removedPost)
    } catch (err) {
        res.json({ message: err });
    }
})

async function checkIfPostOwner(req, res, next) {
    let post;
    post = await Post.findById(req.params.postId);
    if (post.user != req.user._id) {
        res.status(400).send('Not Authorized')
      return;
    } else {
      return next();
    }
  }

module.exports = router;
