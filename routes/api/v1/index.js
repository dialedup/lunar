const router = require("express").Router();

router.use("/accounts", require("./accounts"));
router.use("/users", require("./users"));
// router.use('/activity', require('./activity'));
router.use('/upload', require('./upload'));
router.use('/media', require('./media'));
router.use('/feed', require('./feed'));

module.exports = router;