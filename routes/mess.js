const express = require('express');
const router = require('express-promise-router')();
const messController = require('../controllers/mess');
router.route("").
get(messController.getmenu);
router.route("/feedback").
post(messController.createFeedback);
router.route("/getfeedbacks").
get(messController.getFeedback);
router.route("/ratings/:id1/:id").
post(messController.ratings);
module.exports = router;