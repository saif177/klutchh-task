const {
    models: {
        User,
        Rating,
        Movies
    },
} = require('../../../../lib/models');
const moment = require('moment');
const {
    showDate,
    uploadImageLocal,
    uploadImage
} = require('../../../../lib/util');


const fs = require('fs');
const multiparty = require('multiparty');
const multer = require('multer');
const async = require('async');
const {
    utcDateTime,
    generateOtp,
    logError,
    randomString,
    getS3SingnedUrl,
    createS3SingnedUrl,
    generateResetToken,
    sendSms,
    utcDate,
    uploadImageBase64,
    uploadImageAPI,
} = require('../../../../lib/util');
var _ = require('lodash');
const cron = require('node-cron');
var request = require('request');

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const api_key = process.env.TMD3_API_KEY;

const {
    promisify
} = require('util');
const unlinkAsync = promisify(fs.unlink);


class UserController {
    
   
 async moviesList(req, res, next) {
        try {
            let _id = req.user._id;
            let user = await User.findOne({
                _id
            });
            if(user){
            var options = {
                method: 'GET',
                url: `https://api.themoviedb.org/3/movie/popular?api_key=${api_key}&language=en-US`
            };

            request(options, async function (error, response) {
                if (error) throw new Error(error);
                let obj = JSON.parse(response.body);
                let items = {};

                let movies = obj.results.slice(0, 10);
                items.movies = movies;
                
                res.success({
                    lenght: items.movies.length,
                    data: items,
                    message: 'Popular movies list fetched !',
                });
             });
         }else{
             res.warn({
                    message: `You don't have any access to fetch movies list !`
                });
         }
           
        } catch (err) {
            console.log(err);
            return next(err);
        }
    }

async ratedMoviesList(req, res, next) {
        try {
            let _id = req.user._id;
            let user = await User.findOne({
                _id
            });
            if(user){
            let moviesList=await Rating.aggregate([{ 
               "$group": {
                 "_id": {
                  "movieId":"$movieId",
                    }, 
                  "Avg_ratings": { "$avg": "$rating" },
                 } 
             },
              {
              $lookup:
             {
               from: "movies",
               localField: "_id.movieId",
               foreignField: "movieId",
               as: "Movies"
             }
            }
          ])
            console.log(moviesList)
             res.success({
                    data:moviesList
              },`Rated Movies List fetched`);
         }else{
             res.warn({
                    message: `You don't have any access to fetch movies list !`
            });
         }
           
        } catch (err) {
            console.log(err);
            return next(err);
        }
    }

     async rateMovie(req, res, next) {
        try {
            
            let ratings=req.body.ratings;
            let movieId=req.body.movieId;
            let _id = req.user._id;
            let user = await User.findOne({
                _id
            });
            if(user){
 var options = {
                method: 'GET',
                url: `https://api.themoviedb.org/3/movie/370172?api_key=${api_key}&language=en-US`,
            };

            request(options, async function (error, response) {
                if (error) throw new Error(error);
                let item = JSON.parse(response.body);
                 let rating =new Rating();
                 rating.userId=_id;
                 rating.movieId=movieId;
                 rating.rating=ratings;
                 await rating.save();
                 let movie=await Movies.findOne({movieId});
                 if(movie){}else{
                    let movie_=new Movies();
                 movie_.movieId=movieId;
                 movie_.backdrop_path=item.backdrop_path;
                 movie_.belongs_to_collection=item.belongs_to_collection;
                 movie_.budget=item.budget;
                 movie_.genres=item.genres;
                 movie_.spoken_languages=item.spoken_languages;
                 movie_.popularity=item.popularity;
                 movie_.revenue=item.revenue;
                 movie_.runtime=item.runtime;
                 movie_.status=item.status;
                 movie_.tagline=item.tagline;
                 movie_.title=item.title;
                 movie_.release_date=item.release_date;
                 movie_.homepage=item.homepage;
                 await movie_.save();
                 }
                 
                 
                 

               // console.log(item)
                res.success({
                   
                },'Rating added successfully');
            });
            }else{
                 res.warn({
                   
                },`You don't have permision !`);
            }
           
        } catch (err) {
            console.log(err);
            return next(err);
        }
    }


     async updatePassword(req, res) {
       const _id = req.user._id;
        const {
            currentPassword,
            newPassword
        } = req.body;
        let user=await User.findOne({_id});
        const matched = await user.comparePassword(currentPassword);
        if (!matched) {
            return res.unauthorized('', req.__('PASSWORD_MATCH_FAILURE'));
        }
        const matcheAddedPassword = await user.comparePassword(newPassword);
        if (matcheAddedPassword) {
            return res.warn({
              
                message: 'Old password and new passowrd can not be same'
            });
        }
        user.password = newPassword;
        await user.save();
        return res.success(true, 'Password updated successfully.');
    }
}

module.exports = new UserController();