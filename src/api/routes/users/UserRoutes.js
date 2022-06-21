const express = require('express');
const router = express.Router();
const UserController = require('./UserController');
const { validate } = require('../../util/validations');
const validations = require('./UserValidations');
const { verifyToken } = require('../../util/auth');




router.get('/movieslist', verifyToken,UserController.moviesList);
router.get('/ratedMovieslist', verifyToken,UserController.ratedMoviesList);
router.post('/changepassword', verifyToken, UserController.updatePassword);
router.post('/ratemovie',verifyToken,UserController.rateMovie);


module.exports = router;
