const mongoose = require('mongoose');
const fs = require('fs');
const validator = require('validator');

const movieSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Movie Title is required!'],
        unique: [true, 'Movie title is already present!'],
        maxlength: [100, 'Movie name must not have more than 100 words'],
        minlength: [3, 'Movie name must have atleast 3 character'],
        trim: true,
        //validate: [validator.isAlpha, 'Name should only contain alphabets']
    },
    description: {
        type: String,
        required: [true, 'Movie Description is required!'],
        trim: true
    },
    duration: {
        type: Number,
        required: [true, 'Movie duration is required!']
    },
    ratings: {
        type: Number,
        default: 1.0,
        validate: {
            validator: function(value){
                return value >= 1 && value <= 10;
            },
            message: 'Ratings ({VALUE}) should be above 1 and below 10'
        }
    },
    totalRating: {
        type: Number
    },
    releaseYear: {
        type: Number,
        required: [true, 'Release Year is required!']
    },
    releaseDate: {
        type: Date,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    genres: {
        type: [String],
        required: [true, 'Generes is required field!']
    },
    directors: {
        type: [String],
        required: [true, 'Directors is required field!']
    },
    coverImage: {
        type: String,
        required: [true, 'Cover Image is required field!']
    },
    actors: {
        type: [String],
        required: [true, 'Actors is required field!']
    },
    price: {
        type: Number,
        required: [true, 'Price is required field!']
    },
    createdBy: String
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

movieSchema.virtual("durationHrs")
    .get(function () {
        return this.duration / 60;
    });

movieSchema.pre('save', function (next) {
    this.createdBy = 'Aniket';
    next();
});

movieSchema.post('save', function (doc, next) {
    const content = `A new movie document with name ${doc.name} has been created by ${doc.createdBy}\n`;
    fs.writeFileSync('./Log/log.txt', content, { flag: 'a' }, (err) => {
        console.log(err.message);
    });
    next();
});

movieSchema.pre(/^find/, function (next) {
    this.find({ releaseDate: { $lte: Date.now() } });
    this.startTime = Date.now();
    next();
});

movieSchema.post(/^find/, function (docs, next) {
    this.find({ releaseDate: { $lte: Date.now() } });
    this.endTime = Date.now();

    const content = `Query took ${this.endTime - this.startTime} milliseconds to fetch the document\n`;
    fs.writeFileSync('./Log/log.txt', content, { flag: 'a' }, (err) => {
        console.log(err.message);
    });
    next();
});

movieSchema.pre('aggregate', function (next) {
    console.log(this.pipeline().unshift({ $match: { releaseDate: { $lte: new Date() } } }));
    next();
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;