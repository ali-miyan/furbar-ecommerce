

const isLogin = (req, res, next) => {
    try {
        console.log("Executing isLogin middleware");

        if (req.session.user_id) {
            // User is logged in, continue to the next middleware or route handler
            console.log("middle:" + req.session.user_id);
            next();
        } else {
            console.log('GHJN');
            const message="you have to login first!"
            res.redirect(`/login?loginmessage=${message}`);
        }
    }
    catch (error) {
        console.log(error.message);
    }
}

const isLogout = (req, res, next) => {
    try {
        if (req.session.user_id) {
            // User is logged in, redirect to the home page or another appropriate route
            console.log("middle:" + req.session.user_id);
            res.redirect('/');
        } else {
            // User is not logged in, continue to the next middleware or route handler
            next();
        }
    } catch (error) {
        console.log(error.message);
    }
}



//admin middleware

const isAdminLogin = async (req, res, next) => {
    try {
        if (req.session.admin_id) {
            next()
        } else {
            res.redirect('/admin')
        }
    } catch (error) {
        console.log(error.message);
    }
}
const isAdminLogout = async (req, res, next) => {
    try {
        if (req.session.admin_id) {
            res.redirect('/admin/dashboard')
        } else {
            next()
        }
    } catch (error) {
        console.log(error.message);
    }
}


module.exports = {
    isLogin,
    isLogout,
    isAdminLogin,
    isAdminLogout

}