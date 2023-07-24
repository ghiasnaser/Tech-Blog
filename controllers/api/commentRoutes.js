const router = require('express').Router();
const { Comment } = require('../../models');
const withAuth = require('../../utils/auth');

router.post('/:blog_id', withAuth, async (req, res) => {
    try {
      const newComment = await Comment.create({
        ...req.body,
        user_id: req.session.user_id,
        blog_id: req.params.blog_id,
      });
      res.status(200).json(newComment);
    } catch (err) {
      res.status(400).json(err);
      console.log(err);
    }
  });
  
  router.delete('/:blog_id/:comment_id', withAuth, async (req, res) => {
    try {
      const commentData = await Comment.destroy({
        where: {
          id: req.params.comment_id,
          //user_id: req.session.user_id,
          blog_id: req.params.blog_id,
        },
      });
      if (!commentData) {
        res.status(404).json({ message: 'No Comment found with this id!' });
        return;
      }
  
      res.status(200).json(commentData);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  router.put('/:blog_id/:comment_id', withAuth, async (req, res) => {
    try {
      const updatedComment = await Comment.update(
        { ...req.body },
        {
          where: {
            id: req.params.comment_id,
            user_id: req.session.user_id,
            blog_id: req.params.blog_id,
          },
        }
      );
  
      if (!updatedComment[0]) {
        res.status(404).json({ message: 'No Comment found with this id!' });
        return;
      }
  
      res.status(200).json(updatedComment);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  module.exports = router;
  