const router = require('express').Router();
const userRoutes = require('./userRoutes');
const blogRoutes = require('./blogRoutes');
const commentRoutes = require('./commentRoutes');

router.use('/users', userRoutes);
router.use('/Blogs', blogRoutes);
router.use('/Comments', commentRoutes);

module.exports = router;
