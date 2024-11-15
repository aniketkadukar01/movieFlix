module.exports = (error, req, res, next) => {
    res.status(error.statusCode || 500).json({
        status: error.status || 'error',
        message: error.message
    });
}