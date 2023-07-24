const router = require('express').Router();
const { Blog, User,Comment } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
  try {
    // Get all blogs and JOIN with user data and comment data
    const blogData = await Blog.findAll({
      include: [
        {
          model: User,
          attributes: ['name'],
        },
        {
          model: Comment,
          include: [{ model: User, attributes: ['name'] }],
        },
        ],
    });

    // Serialize data so the template can read it
    const blogs = blogData.map((blog) => blog.get({ plain: true }));

    // Determine the current user (if logged in)
    const currentUser = req.session.user_id ? { id: req.session.user_id } : null;
    const logged_in=req.session.logged_in;
    // Pass serialized data and session flag into template 
    res.render('homepage', { 
      blogs, 
      logged_in,
      currentUser,
    });
    
  } catch (err) {
    res.status(500).json(err);
  }
});


router.post('/comment/:blog_id', withAuth, async (req, res) => {
  try {
    const newComment = await Comment.create({
      ...req.body,
      user_id: req.session.user_id,
      blog_id: req.params.blog_id,
    });
    const commentId = newComment.id; 
    // Scroll to the comment section on the homepage
    res.status(200).json({ commentId, message: 'Comment added successfully' });
  } catch (err) {
    res.status(400).json(err);
    console.log(err);
  }
});

router.get('/blog/:id', async (req, res) => {
  try {
    const blogData = await Blog.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['name'],
        },
        {
          model: Comment,
          include: [{ model: User, attributes: ['name'] }],
        },
      ],
    });
    const currentUser = req.session.user_id ? { id: req.session.user_id } : 0;
    const blog = blogData.get({ plain: true });
    res.render('blog', {
      ...blog,
      currentUser,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Use withAuth middleware to prevent access to route
router.get('/dashbord', withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [
        { model: Blog },
        {
          model: Comment,
          include: [{ model: User, attributes: ['name'] }],
        },
      ],
    });

    const user = userData.get({ plain: true });
   
    res.render('dashbord', {
      ...user,
      logged_in: true
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/dashbord');
    return;
  }

  res.render('login');
});

module.exports = router;
