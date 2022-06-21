const express = require('express');
const router = express.Router();
const AuthController = require('./AuthController');

const { validate } = require('../../util/validations');
const validations = require('./AuthValidations');
const {verifyToken} = require('../../util/auth');

const {
    models: { Users  },
} = require('../../../../lib/models');


router.post('/log-in',validate(validations.logIn),AuthController.logIn);
router.get('/log-out',verifyToken,AuthController.logOut);
router.post('/signup',AuthController.signup)




module.exports = router;
