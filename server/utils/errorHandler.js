// Error handler middleware

exports.errorHandler = async (err, req, res, next) => {
  let errors = []
  let statusCode = err.statusCode || 500;

  if (err.name === 'ValidationError') {
    statusCode = 403
    errors.push(...Object.values(err.errors).map(el => el.message));
  }
  if (err.code && err.code === 11000) { // Duplicate key error
    const field = Object.keys(err.keyValue)[0];
    statusCode = 403
    errors.push([`${field.charAt(0).toUpperCase() + field.slice(1)} already exists`])
  }
  if (err && errors.length == 0) {
    errors.push(err.message)
  }
  res.status(statusCode).json({
    success: false,
    errors: errors,
  });
};