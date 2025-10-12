const errorLogging = (err, req, res, next) => {
  console.error('Error details:', {
    path: req.path,
    method: req.method,
    body: req.body,
    error: err.message,
    stack: err.stack
  });
  next(err);
};

module.exports = errorLogging;