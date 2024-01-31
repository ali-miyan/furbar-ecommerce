const multer = require('multer');

const localStorage = multer.diskStorage({
    destination: "public/multerimages",
    filename: (req, file, callback) => {
        const filename = file.originalname;
        callback(null, filename)
    }
})

const products = multer({ storage: localStorage });
const uploadproduct = products.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
])

module.exports = {
    uploadproduct
}