const accessControl = (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "http://myweb.app.com:3000");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    next();
};

module.exports = {accessControl};