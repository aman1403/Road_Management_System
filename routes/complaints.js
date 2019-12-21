const express = require('express');
const router = require('express-promise-router')();
const complaintsController = require('../controllers/complaints');
router.route("/").
get(complaintsController.getcomplaints);
router.route("/level1").
get(complaintsController.secyComplaints);
router.route("/level2/:id").
get(complaintsController.wardenComplaints);
router.route("/my").
get(complaintsController.mycomplaints);
router.route("/tosecy/approve/:id").
post(complaintsController.validcomplaints);
router.route("/tosecy/reject/:id").
post(complaintsController.notvalidcomplaints);
router.route("/create").
post(complaintsController.postcomplaints);
router.route("/warden/approve/:id").
post(complaintsController.wardenVerification);
router.route("/warden/reject/:id").
post(complaintsController.wardenDisapproval);
router.route("/ips/reject/:id").
post(complaintsController.ipsDisapproval);
router.route("/ips/approve/:id").
post(complaintsController.ipsVerification);
router.route("/final/close/:id").
post(complaintsController.close);
router.route("/final/ongoing/:id").
post(complaintsController.onGoing);
router.route("/final/resolved/:id").
post(complaintsController.resolved);
router.route("/comments/:id").
post(complaintsController.comments);
module.exports = router;