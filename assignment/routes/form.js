const express = require('express');
const router = express.Router();

const usernames=[];

router.get('/', (req, res, next) => {
    res.render('form', {pageTitle: 'Form'});
});

router.post('/', (req, res, next) => {
    usernames.push({username: req.body.name});
    res.redirect('/users');
});

exports.routes = router;
exports.usernames = usernames;