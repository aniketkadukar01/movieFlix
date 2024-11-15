const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const Movie = require('./../models/movieModel');

dotenv.config({ path: './config.env' });

mongoose.connect(process.env.CONNECTIONSTRING)
    .then((conn) => console.log('Connected to MongoDB'))
    .catch((err) => console.log(err));

const movies = JSON.parse(fs.readFileSync('./data/movies.json', 'utf-8'));

const deleteMovies = async () => {
    try {
        await Movie.deleteMany();
        console.log('Movies deleted successfully!');
    } catch (error) {
        console.log(error.message);
    }
    process.exit();
}

const importMovies = async () => {
    try {
        await Movie.create(movies);
        console.log('Movies Imported successfully!');
    } catch (error) {
        console.log('Error while adding movies:', error.message);

    }
    process.exit();
}

if (process.argv[2] === '--import') {
    importMovies();
}

if (process.argv[2] === '--delete') {
    deleteMovies();
}