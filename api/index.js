module.exports = (req, res) => {
  res.json({ 
    message: 'The Grand Stay API is running on Vercel',
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url
  });
};