const jwt = require('jsonwebtoken');

const jwtAuthMiddleware = (req, res, next) => {
    const authorization = req.headers.authorization;
    if(!authorization) {
        return res.status(401).json({
            error: 'Unauthorized', message: "Authorization header missing."
        });
    }

    const parts = authorization.split(' ');
    if(parts.length !== 2 || parts[0] != 'Bearer') {
        return res.status(401).json({ error: 'Unauthorized', message: 'Authorization header malformed.'});
    };

    const token = parts[1];
    if(!token || token === 'undefined') {
        return res.status(401).json({error: 'Unauthorized', message: 'Token missing' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid token', message: err.message });
    }
};

const generateToken = (key) => {
    return jwt.sign(key, process.env.JWT_SECRET, { expiresIn: '30d' })
};

module.exports = { jwtAuthMiddleware, generateToken };