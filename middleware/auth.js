const isLogin = (req, res, next) => {
    try {
        if (req.session.user_id) {
            // User is logged in, continue to the next middleware or route handler
            next();
        } else {
            // User is not logged in, redirect to the login page or another appropriate route
            res.redirect('/');
        }
    } catch (error) {
        console.log(error.message);
    }
}

const isLogout = (req, res, next) => {
    try {
        if (req.session.user_id) {
            // User is logged in, redirect to the home page or another appropriate route
            res.redirect('/home');
        } else {
            // User is not logged in, continue to the next middleware or route handler
            next();
        }
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    isLogin,
    isLogout,
    
}