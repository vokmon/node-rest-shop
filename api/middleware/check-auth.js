const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // Bearer <token>
    const token = req.headers.authorization.split(' ')[1];
    console.log(token);
    const decoded = jwt.verify(token, process.env.JWT_KEY);

    // Let's pass back the decoded token to the request object
    req.userData = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Auth failed',
    });
  }
  
}