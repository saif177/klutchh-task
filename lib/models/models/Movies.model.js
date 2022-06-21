const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt');

const MoviesSchema = new Schema(
    {
        movieId: {
            required: true,
             type: Number,
        },
        backdrop_path: {
            type: String,
        },
        belongs_to_collection:{
             id:{
              type:"Number"
              },
              name:{
                 type:"String"
              },
              poster_path:{
                 type:"String"
              },
                },
        budget: {
            type: Number,
        },
        genres : [{
            
                    id:{
                        type:"Number"
                    },
                    name:{
                        type:"String"
                    }
        }],
        spoken_languages : [{
            
                    english_name:{
                        type:"String"
                    },
                    iso_639_1:{
                        type:"String"
                    },
                     name:{
                        type:"String"
                    }
        }],
        popularity:{
            type:Number
        },
        revenue:{
            type:Number
        },
        runtime:{
            type:Number
        },
        status:{
            type:String
        },
        tagline:{
            type:String
        },
        title:{
            type:String
        },
        release_date:{
            type:String
        },
        homepage:{
            type:String
        }

    },
    {
        timestamps: {
            createdAt: 'created',
            updatedAt: 'updated'
        },
        id: false,
        toJSON: {
            getters: true
        },
        toObject: {
            getters: true
        },
    }
    
);

module.exports = mongoose.model('Movie', MoviesSchema);