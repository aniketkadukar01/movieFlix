const Movie = require('./../models/movieModel');
const ApiFeatures = require('./../utils/ApiFeatures');
const CustomError = require('./../utils/customError');


exports.validateBody = (req, res, next) => {
    if (!req.body.name || !req.body.Duration) {
        return res.status(400).json({
            status: 'bad request',
            message: 'name and duration are required'
        });
    }
    next();
}

exports.getHighestRated = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratings';
    next();
}

exports.getAllMovies = async (req, res) => {

    //const movies = await Movie.find();

    let features = new ApiFeatures(Movie.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    const movies = await features.query;

    res.status(200).json({
        status: 'success',
        lenght: movies.length,
        data: {
            movies
        }
    });
}

exports.createNewMovie = async (req, res, next) => {

    const movie = await Movie.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            movie
        }
    });
}

exports.getById = async (req, res, next) => {

    const movie = await Movie.findById(req.params.id);

    if (!movie) {
        const error = new CustomError('Movie with the Id is not found', 404);
        return next(error);
    }

    res.status(200).json({
        status: 'success',
        data: {
            movie
        }
    });
}

exports.updateMovie = async (req, res, next) => {

    const updateMovie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    if (!updateMovie) {
        const error = new CustomError('Movie with the Id is not found', 404);
        return next(error);
    }

    res.status(200).json({
        status: 'success',
        data: {
            movie: updateMovie
        }
    });

}

exports.deleteMovie = async (req, res, next) => {

    const deletedMovie = await Movie.findByIdAndDelete(req.params.id);

    if (!deletedMovie) {
        const error = new CustomError('Movie with the Id is not found', 404);
        return next(error);
    }

    res.status(204).json({
        status: 'success',
        data: null
    });

}

exports.movieStats = async (req, res, next) => {

    const stats = await Movie.aggregate([
        { $match: { ratings: { $gte: 4.5 } } },
        {
            $group: {
                _id: "$releaseYear",
                avgRating: { $avg: "$ratings" },
                avgPrice: { $avg: "$price" },
                minPrice: { $min: "$price" },
                maxPrice: { $max: "$price" },
                priceTotal: { $sum: "$price" },
                movieCount: { $sum: 1 }
            }
        },
        { $sort: { minPrice: 1 } },
        //{ $match: { maxPrice: { $gte: 60 } } }
    ]);

    res.status(200).json({
        status: 'success',
        length: stats.length,
        data: {
            movie: stats
        }
    });

}

exports.movieByGenres = async (req, res, next) => {

    const genre = req.params.genre;
    const movies = await Movie.aggregate([
        { $unwind: "$genres" },
        {
            $group: {
                _id: "$genres",
                movieCount: { $sum: 1 },
                movies: { $push: "$name" }
            }
        },
        { $addFields: { genre: "$_id" } },
        { $project: { _id: 0 } },
        { $sort: { movieCount: -1 } },
        { $match: { genre: genre } }
    ]);

    res.status(200).json({
        status: 'success',
        length: movies.length,
        data: {
            movies
        }
    });

}