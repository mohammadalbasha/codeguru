import multer from "multer";
//locally

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./data/invoices");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});

//cloudly
// const cloudinary = require('cloudinary').v2;
// const { CloudinaryStorage } = require('multer-storage-cloudinary');
// require('dotenv').config();
// loudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET
//   });

// const fileStorage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: 'images',
//     //format: async (req, file) => 'png', // supports promises as well
//     public_id: (req, file) => Date.now() +  file.originalname,
//   },
// });

// filtering
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "application/pdf"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

export default multer({ storage: fileStorage, fileFilter });
