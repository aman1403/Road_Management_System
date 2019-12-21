const express = require('express');
const router = require('express-promise-router')();
const resourcesController = require('../controllers/resources');
const multer= require('multer');
router.route("").
get(resourcesController.getcourses);
router.route("/postcourses").
post(resourcesController.postCourse);
router.route("/getdocuments/:id").
get(resourcesController.getdocuments);
module.exports = router;