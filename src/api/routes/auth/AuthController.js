const {
    models: {
        User,
        Friend,
        Concierge,
        Referral
    },
} = require('../../../../lib/models');
const mailer = require('../../../../lib/mailer');


const {
    signToken
} = require('../../util/auth');
const {
    signTempToken
} = require('../../util/auth');
const {
    getPlatform
} = require('../../util/common');
const {
    utcDateTime,
    randomName,
    getWeekNumber,
    generateOtp,
    logError,
    adminEmail,
    randomString,
    createS3SingnedUrl,
    generateResetToken,
    sendSms,
} = require('../../../../lib/util');
var _ = require('lodash');
const jwtToken = require('jsonwebtoken');
const sgMail = require('@sendgrid/mail');




let apiEnv = process.env.NODE_ENV;
console.log('this is env:', apiEnv);
var moment = require('moment');
const multer = require('multer');


class AuthController {
    async logIn(req, res, next) {
        try {
            const {
                email,
                password,
                deviceToken,
                deviceId,
                deviceType
            } = req.body;
            console.log(req.body);
           
            let user = await User.findOne({
                email,
            });

            if (!user) {
                return res.send({
                    status: 0,
                    message: 'You do not have any account linked with this email address',
                });
            }else{
                const passwordMatched = await user.comparePassword(password);
                console.log("-----------------------------------", passwordMatched)
                if (!passwordMatched) {
                    console.log("**************************55" + passwordMatched)

                    return res.warn({
                        message: 'Invalid email or password !'
                    });
                }
                user.authTokenIssuedAt = utcDateTime().valueOf();
                await user.save();
                const jwttoken = signToken(user);
                    const userJson = user.toJSON();
                    ['password', 'authTokenIssuedAt', '__v'].forEach(key => delete userJson[key]);
                    return res.success({
                            language: req.headers['accept-language'],
                            jwt: jwttoken,
                            user: userJson,
                        },
                        req.__('LOGIN_SUCCESS')
                    );
            }
        } catch (err) {
            return next(err);
        }
    }
  
    async logOut(req, res) {
        const {
            user
        } = req;
        user.authTokenIssuedAt = null;
        user.deviceToken = null;
        await user.save();
        return res.success('', req.__('LOGOUT_SUCCESS'));
    }
   
    async signup(req, res, next) {
        let {
            email,
            password,name
        } = req.body;
        try {
            console.log("--------------------------------");
            let user = await User.findOne({email});
            if (user) {
                return res.warn({
                    message: req.__('User already exist , please login !'),
                });
            }else{
                let newUser=new User();
                newUser.email=email;
                newUser.name=name;
                newUser.password=password;
                newUser.authTokenIssuedAt = utcDateTime().valueOf();
                let user_=await newUser.save();
                const jwttoken = signToken(user_);
               

                    const userJson = user_.toJSON();
                    ['password', 'authTokenIssuedAt', '__v'].forEach(key => delete userJson[key]);
                return res.success({
                    userdata: userJson,
                    jwttoken:jwttoken,
                    message: req.__('This email is not register !'),
                });
            }

        } catch (err) {
            console.log(err);
            return next(err);
        }
    }


   
}

module.exports = new AuthController();