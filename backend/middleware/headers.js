const accessControl = (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "https://newsatnba.herokuapp.com");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader('Cache-Control', "private, no-cache, no-store, must-revalidate");
    next();
};

module.exports = {accessControl};