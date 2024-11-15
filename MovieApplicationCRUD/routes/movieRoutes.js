const express = require('express');
const movieController = require('../controllers/movieController');
const asyncErrorHandler = require('./../utils/asyncErrorHandler');

const router = express.Router();

//router.param('id' , movieController.checkId);

router.route("/moviestats")
    .get(asyncErrorHandler(movieController.movieStats));

router.route("/moviegenre/:genre")
    .get(asyncErrorHandler(movieController.movieByGenres));

router.route('/highest-rated')
    .get(asyncErrorHandler(movieController.getHighestRated), asyncErrorHandler(movieController.getAllMovies));

router.route('/')
    .get(asyncErrorHandler(movieController.getAllMovies))
    .post(asyncErrorHandler(movieController.createNewMovie));

router.route('/:id')
    .get(asyncErrorHandler(movieController.getById))
    .patch(asyncErrorHandler(movieController.updateMovie))
    .delete(asyncErrorHandler(movieController.deleteMovie));

module.exports = router;