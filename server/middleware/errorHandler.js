module.exports = (err, _req, res, _next) => {
  console.error(err.message);

  // Mongoose duplicate key error (code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return res.status(409).json({
      success: false,
      message: `An account with that ${field} already exists`
    });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: Object.values(err.errors).map(e => e.message).join('. ')
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }

  // CastError
  if (err.name === 'CastError') {
    return res.status(400).json({ success: false, message: 'Invalid ID provided' });
  }

  // SyntaxError (Malformed JSON in request)
  if (err.name === 'SyntaxError') {
    return res.status(400).json({ success: false, message: 'Invalid request body format' });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
};
