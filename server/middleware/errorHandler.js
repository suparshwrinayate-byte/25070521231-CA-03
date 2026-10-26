module.exports = (err, _req, res, _next) => {
  console.error(err.message);
  if (err.name === 'ValidationError') {
    return res.status(400).json({ success: false, message: Object.values(err.errors).map(e => e.message).join('. ') });
  }
  if (err.name === 'CastError') return res.status(400).json({ success: false, message: 'Invalid medicine ID' });
  if (err.name === 'SyntaxError') return res.status(400).json({ success: false, message: 'Invalid request body' });
  res.status(err.status || 500).json({ success: false, message: err.message || 'Internal server error' });
};
