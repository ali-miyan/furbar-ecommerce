const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const userVerification = require('../models/userOTP');
const User = require('../models/userModel');
const userOTP = require('../models/userOTP');
const dotenv = require('dotenv')
dotenv.config()
const path = require('path')
const ejs = require('ejs')
const Product = require("../models/productModel");
const addressModel = require('../models/addressModel');
const orderModel = require('../models/orderModal');
const categoryModel = require('../models/categoryModel');
const puppeteer = require('puppeteer');
const crypto = require('crypto')
const { generateKey } = require('crypto');
const { error } = require('console');
const { truncate } = require('fs');
const wishlistModel = require('../models/wishlistModel');



//route to home page
const loadHome = async (req, res) => {
    try {
        const user_id = req.session.user_id
        const user = await User.findById(user_id)
        const product = await Product.find({ is_blocked: false }).limit(4)
        console.log(product, 'producttt');
        res.render('home', { user, product })

    } catch (error) {
        console.log(error);
        res.status(500).render('500');
    }
}
const loadBlog = async (req, res) => {
    try {
        res.render('blog')
    } catch (error) {
        console.log(error);
        res.status(500).render('500');
    }
}
const loadContact = async (req, res) => {
    try {
        res.render('contact')
    } catch (error) {
        console.log(error);
        res.status(500).render('500');
    }
}
const loadAbout = async (req, res) => {
    try {
        res.render('about')
    } catch (error) {
        console.log(error);
        res.status(500).render('500');
    }
}

//shop page
const loadShop = async (req, res) => {
    try {
        const searchQuery = req.query.search;
        const sort = req.query.sort

        const totalProductsCount = await Product.countDocuments({ is_blocked: false })
        let totalPages;

        const selectedCategory = req.query.category;
        console.log(selectedCategory);
        const category = await categoryModel.find({ _id: { $in: await Product.distinct("categoryId") } });

        let product;

        if (selectedCategory) {
            product = await Product.find({ categoryId: selectedCategory, is_blocked: false }).populate('offer');
            console.log(product.length, 'ddddddd');
            console.log(selectedCategory, 'cat');

            if (searchQuery) {
                product = await Product.find({ categoryId: selectedCategory, is_blocked: false, name: { $regex: searchQuery, $options: 'i' } })
                if (product.length == 0) {
                    totalPages = 'no products available in specified category'
                }
            }
        } else {
            product = await Product.find({ is_blocked: false }).populate('offer');
            console.log(product.length, 'ddddddd');

            if (searchQuery) {
                product = await Product.find({ is_blocked: false, name: { $regex: searchQuery, $options: 'i' } })
                if (product.length == 0) {
                    totalPages = 'no products available'
                }
                console.log(product, totalPages, 'ffffffffffffffffffffffff');
            }
        }

        //sortting////////////////

        switch (sort) {
            case 'high-to-low':
                product = product.slice().sort((a, b) => b.price - a.price);
                break;
            case 'low-to-high':
                product = product.slice().sort((a, b) => a.price - b.price);
                break;
            default:
                product = product
                break
        }

        const wishData = await wishlistModel.findOne({ user: req.session.user_id })
        const wishlistData = wishData ? wishData.product.map((val) => val.productId) : [];


        res.render('shop', { product, category, selectedCategory, totalPages, sort, wishlistData, totalProductsCount });
    } catch (error) {
        console.log(error);
        res.status(500).render('500');
    }
}

//signup page
const loadSignup = async (req, res) => {
    try {
        res.render('signup')
    } catch (error) {
        console.log(error);
        res.status(500).render('500');
    }
}
//profile page
const loadProfile = async (req, res) => {
    try {
        console.log("profile session" + req.session.user_id);
        const user = await User.findOne({ _id: req.session.user_id });
        const address = await addressModel.findOne({ user: req.session.user_id });
        const order = await orderModel.find({ user: req.session.user_id }).populate('products.productId')
        res.render('profile', { user, address, order });

    } catch (error) {
        console.log(error);
        res.status(500).render('500');
    }
};


//login page
const loadLogin = async (req, res) => {
    try {
        const loginmessage = req.query.loginmessage
        res.render('login', { loginmessage })
    } catch (error) {
        console.log(error);
        res.status(500).render('500');
    }
}


//signup and storing data to database
const signupPost = async (req, res) => {
    try {
        console.log('ethiiiiiiiiiiiiiiiiiiii');
        let { name, email, mobile, password, code } = req.body;
        console.log(req.body);
        console.log(code, 'code');
        let data;
        if (code) {
            const referalCheck = await User.find({ referalCode: code })
            if (referalCheck.length === 0) {
                console.log('helooooooooo');
                return res.json({ referal: false,message:'invalid referal code' })
            } else {
                data = {
                    amount: 1000,
                    date: new Date()
                }
            }
        }
        const userExists = await User.findOne({ email });
        if (userExists) {
            console.log('exists');
            return res.json({ user: false, message: 'User with provided email already exists,try logging in' });
        } else {
            const hashedPassword = await securePassword(password);
            const newUser = new User({
                name: name,
                email: email,
                mobile: mobile,
                password: hashedPassword,
                verified: false,
                isAdmin: 0,
                referalCode: await generateCode()
            });
            const result = await newUser.save();
            console.log(data, 'dataaaaaaaaa');
            if (data && result) {
                await User.findByIdAndUpdate(result._id, { $push: { walletHistory: data } }, { new: true });
            }
            const id = result._id
            console.log(result, 'otp 2');
            res.json({ data: true, id })
            sendOTPverification(result, res);
        }
    } catch (error) {
        console.error(error);
        res.status(500).render('500');
    }
};


//rendering otp page
const verifyOTP = async (req, res) => {
    try {
        const id = req.query.id
        const message = req.query.id2
        console.log(id, 'th id');
        res.render('otp', { id, message });
    } catch (error) {
        console.log(error.message);
        res.status(500).render('500');
    }
};

//verifying otp
const verifyPost = async (req, res) => {
    try {
        const { id: userId } = req.body;
        const userOtp = req.body.otp
        const userOTPVerificationrecord = await userVerification.findOne({ user_id: userId });
        console.log(userOTPVerificationrecord, 'reccccccccc');

        if (!userOTPVerificationrecord) {   
            res.json({ otp: false, message: "Record doesn't exist" });
        }

        const { expiresAt, otp } = userOTPVerificationrecord;

        if (expiresAt < Date.now()) {
            await userVerification.deleteOne({ user_id: userId });
            res.json({ otp: 'expired', message: "Your OTP has expired" });
        } else {
            const validOTP = await bcrypt.compare(userOtp, otp);
            if (!validOTP) {
                console.log('invaallidddddddd verify');
               return res.json({ otp: 'invalid', message: "Invalid code, try again..." });
            } else {
                await User.updateOne({ _id: userId }, { $set: { verfied: true } });
                await userVerification.deleteOne({ user_id: userId });
                req.session.user_id = userId;
                return res.json({ otp: true });
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).render('500');
    }
};


//hashing password
const securePassword = async (password) => {
    try {
        const hashedPassword = bcrypt.hash(password, 10)
        return hashedPassword;
    } catch (error) {
        console.log(error);
        res.status(500).render('500');
    }
}


//resend otp
const resendOtp = async (req, res) => {
    try {
        console.log("siuuuuuuuuuuuuuu");
        const id = req.query.id;
        const userData = await User.findOne({ _id: id });
        console.log('otp 3');
        await resendOTPverification(userData, res);
    } catch (error) {
        console.log(error);
        res.status(500).render('500');
    }
}
//resend otp
const resendOTPverification = async ({ _id, email }, res, message) => {
    try {
        console.log('noooooooooo');
        const otp = `${Math.floor(1000 + Math.random() * 900)}`
        const mailOptions = {
            from: process.env.user_email,
            to: email,
            subject: "VERIFY YOUR EMAIL",
            html: `
                <html>
                    <body style="font-family: 'Arial', sans-serif; background-color: #f4f4f4; padding: 20px;">
                        <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                            <h1 style="color: #333;">Verify Your Email Address</h1>
                            <p style="color: #555; line-height: 1.5;">Enter the following OTP code to verify your email address. This code will expire in 1 hour:</p>
                            <p style="font-size: 24px; font-weight: bold; color: #007bff;">${otp}</p>
                            <p style="color: #555; line-height: 1.5;">If you did not request this verification, please ignore this email.</p>
                        </div>
                    </body>
                </html>
            `,
        };
        const hashedOTP = await bcrypt.hash(otp, 10);

        const newOTP = await new userOTP({
            user_id: _id,
            otp: hashedOTP,
            createAt: Date.now(),
            expiresAt: Date.now() + 60000,
        })
        console.log('resendddddddddd');

        await newOTP.save();
        await transporter.sendMail(mailOptions);

    } catch (error) {
        console.log(error);
        res.status(500).render('500');
    }
}


//sending otp
const sendOTPverification = async ({ _id, email }, res, message) => {
    try {
        console.log('heloooooooooo');
        const otp = `${Math.floor(1000 + Math.random() * 900)}`
        const mail = {
            from: process.env.user_email,
            to: email,
            subject: "Verify Your Email",
            html: `
                <html>
                    <body style="font-family: 'Arial', sans-serif; background-color: #f4f4f4; padding: 20px;">
                        <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                            <h1 style="color: #333;">Verify Your Email Address</h1>
                            <p style="color: #555; line-height: 1.5;">Enter the following OTP code to verify your email address. This code will expire in 1 hour:</p>
                            <p style="font-size: 24px; font-weight: bold; color: #007bff;">${otp}</p>
                            <p style="color: #555; line-height: 1.5;">If you did not request this verification, please ignore this email.</p>
                        </div>
                    </body>
                </html>`,
        };
        const hashedOTP = await bcrypt.hash(otp, 10);

        const newOTP = await new userOTP({
            user_id: _id,
            otp: hashedOTP,
            createAt: Date.now(),
            expiresAt: Date.now() + 60000,
        })

        //save otp records
        if (message) {
            return res.json({ _id, message })
        }
        console.log(message, 'message');
        await newOTP.save();
        await transporter.sendMail(mail);

    } catch (error) {
        console.log(error);
        res.status(500).render('500');
    }
}

//node mailer
let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    auth: {
        user: process.env.user_email,
        pass: process.env.user_password
    }
})


//login the user
let loginPost = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const validUser = await User.findOne({ email: email })
        if (validUser) {
            const passwordMatch = await bcrypt.compare(password, validUser.password)
            if (passwordMatch) {
                console.log(validUser.verfied);
                if (validUser.verfied === true) {
                    console.log('brooooooooooooooo');
                    if (validUser.is_blocked == false) {
                        console.log('brooooooooo2222222222oooooo');
                        req.session.user_id = validUser._id;
                        res.json({ redirect: '/', _id: validUser._id, message: 'success' });
                    } else {
                        return res.json({ block: true, message: 'you have been bloacked by admin' })
                    }
                } else {
                    const message = `Please verify your account by entering the OTP first.`
                    console.log('otp 1');
                    await sendOTPverification(validUser, res, message);
                }
            } else {
                return res.json({ user: true, message: 'incorrect password' })
            }
        } else {
            return res.json({ user: true, message: 'you are not a user' })
        }
    } catch (error) {
        console.log(error);
        res.status(500).render('500');
    }
}

//user logout
const userLogout = async (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                console.log("Error destroying session:", err.message);
            } else {
                console.log("Session destroyed");

                res.redirect('/');
            }
        });
    } catch (error) {
        console.log(error.message);
    }
}

const detailShop = async (req, res) => {
    try {
        const id = req.query.id;
        const data = await Product.findOne({ _id: id }).populate('categoryId').populate('offer')
        const relatedProduct = await Product.find({ categoryId: data.categoryId._id, _id: { $ne: data._id } })
        console.log(relatedProduct, 'relatedproduct');
        console.log(data.categoryId._id, 'id');

        res.render('detailshop', { data, data2: relatedProduct })
    } catch (error) {
        console.log(error);
        res.status(500).render('500');
    }
}

const addressform = async (req, res) => {
    try {
        const userId = req.session.user_id;
        const data = {
            name: req.body.name,
            address: req.body.address,
            landmark: req.body.landmark,
            state: req.body.state,
            city: req.body.city,
            pincode: req.body.pincode,
            phone: req.body.phone,
            email: req.body.email
        };
        console.log(data);

        const findAddress = await addressModel.findOneAndUpdate(
            { user: userId },
            { $push: { address: data } },
            { upsert: true, new: true }
        )
        res.json({ add: true });

    } catch (error) {
        console.error(error);
        res.status(500).render('500');
    }
}

const editAddress = async (req, res) => {
    const { editAddressId, editName, editAddress, editLandmark, editState, editCity, editPincode, editPhone, editEmail } = req.body;

    try {
        console.log(editAddressId);
        const user = await addressModel.findOne({ 'address._id': editAddressId })
        console.log(user);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const addressToUpdate = user.address.id(editAddressId);

        if (!addressToUpdate) {
            return res.status(404).json({ success: false, message: 'Address not found' });
        }

        addressToUpdate.name = editName;
        addressToUpdate.address = editAddress;
        addressToUpdate.landmark = editLandmark;
        addressToUpdate.state = editState;
        addressToUpdate.city = editCity;
        addressToUpdate.pincode = editPincode;
        addressToUpdate.phone = editPhone;
        addressToUpdate.email = editEmail;

        await user.save();

        res.json({ success: true });

    } catch (error) {
        console.error(error);
        res.status(500).render('500');
    }
}

const deleteAddress = async (req, res) => {
    try {
        const user_id = req.session.user_id
        const addressId = req.body.addressId

        await addressModel.updateOne({ user: user_id }, { $pull: { address: { _id: addressId } } })

        res.json({ success: true })

    } catch (error) {
        console.log(error);
        res.status(500).render('500');
    }
}

const editUser = async (req, res) => {
    try {
        const userData = await User.findById(req.session.user_id)

        await User.findOneAndUpdate(
            { email: userData.email, },
            {
                $set: {
                    name: req.body.editname,
                    mobile: req.body.editmobile,
                },
            },
            { new: true }
        );
        res.redirect('/profile')
    } catch (error) {
        console.log(error);
        res.status(500).render('500');
    }
}

const generatePdf = async (req, res) => {
    try {
        console.log('heloooooooooo');
        const orderId = req.query.id
        console.log(orderId);
        const orderData = await orderModel.findById({ _id: orderId }).populate('products.productId')
        console.log(__dirname)
        const ejsPagePath = path.join(__dirname, '../views/user/pdf.ejs');
        const ejsPage = await ejs.renderFile(ejsPagePath, { orderData });
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(ejsPage);
        const pdfBuffer = await page.pdf();
        await browser.close();

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=invoice.pdf');
        res.send(pdfBuffer);

    } catch (error) {
        console.log(error);
        res.status(500).render('500');
    }
}

function generateCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';

    for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters.charAt(randomIndex);
    }

    return code;
}

const forgetPassword = async (req, res) => {
    try {
        res.render('forgetpassword')
    } catch (error) {
        console.log(error);
        res.status(500).render('500');
    }
}

const forgetPasswordPost = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email })
        if (!user) {
            console.log('ttttttt');
            return res.json({ user: true, message: `can't find your email` })
        } else if (!user.verfied) {
            return res.json({ user: true, message: `sorry,you are a blocked user` })
        } else {
            res.json({ success: true })
            await sendResetLink(user, res);
        }
    } catch (error) {
        console.log(error);
        res.status(500).render('500');
    }
}

const sendResetLink = async (user, res) => {
    try {
        const token = crypto.randomBytes(32).toString('hex')
        user.tokenExpire = Date.now() + 10 * 60 * 1000
        user.resetToken = token;
        await user.save();

        const reset = `http://localhost:3000/resetpassword?id=${token}`;
        const resetMail = {
            from: process.env.user_email,
            to: user.email,
            subject: 'Password Reset',
            html: `
                <div style="font-family: 'Arial', sans-serif; background-color: #f4f4f4; padding: 20px; text-align: center;">
                    <h2 style="color: #333;">Password Reset</h2>
                    <p style="color: #555;">Dear User,</p>
                    <p style="color: #555;">You have requested to reset your password. Click the button below to reset:</p>
                    <p>
                        <a href="${reset}" style="display: inline-block; padding: 10px 20px; background-color: #4caf50; color: #fff; text-decoration: none; border-radius: 5px;">Reset Password</a>
                    </p>
                    <p style="color: #555;">If you didn't request this, please ignore this email.</p>
                    <p style="color: #555;">Best regards,<br/>furbar</p>
                </div>
            `,
        };


        await transporter.sendMail(resetMail);

    } catch (error) {
        console.log(error);
        res.status(500).render('500');
    }
}

const resetPassword = async (req, res) => {
    try {
        const token = req.query.id;
        console.log('queryyyyyyyy');
        res.render('resetpassword', { token })
    } catch (error) {
        console.log(error);
    }
}

const resetPasswordPost = async (req, res) => {
    try {
        const { token, password } = req.body;
        console.log(req.body);
        const user = await User.findOne({
            resetToken: token,
            tokenExpire: { $gt: Date.now() }
        });
        console.log(user, 'ddddddddddddddddddd');

        if (!user) {
            return res.json({ ok: true, message: `Invalid or expired token` });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        user.password = hashedPassword;
        user.resetToken = undefined;
        user.tokenCreate = undefined;
        user.tokenExpire = undefined;

        await user.save();

        return res.json({ success: true });

    } catch (error) {
        console.log(error);
        res.status(500).render('500');
    }
}

const changePassword = async (req, res) => {
    try {
        const { current, newPass } = req.body;
        console.log(req.body, 'ddddddddddd');
        const id = req.session.user_id
        const user = await User.findById(id)
        console.log(user, 'ffffffffffffffff');
        if (!user) {
            return res.json({ success: false, message: 'User not found.' });
        }

        const isPasswordMatch = await bcrypt.compare(current, user.password);

        if (!isPasswordMatch) {
            return res.json({ success: false, message: 'current password is not matching' });
        }

        const hashedPassword = await bcrypt.hash(newPass, 10);
        user.password = hashedPassword;
        await user.save();

        return res.json({ success: true, message: 'Password changed successfully.' });
    } catch (error) {
        console.log(error);
        res.status(500).render('500');
    }
}

module.exports = {
    verifyOTP,
    verifyPost,
    loadHome,
    signupPost,
    loginPost,
    userLogout,
    loadSignup,
    loadProfile,
    loadLogin,
    loadShop,
    detailShop,
    addressform,
    editAddress,
    deleteAddress,
    editUser,
    generatePdf,
    resendOtp,
    forgetPassword,
    forgetPasswordPost,
    resetPassword,
    resetPasswordPost,
    changePassword,
    loadContact,
    loadAbout,
    loadBlog
}