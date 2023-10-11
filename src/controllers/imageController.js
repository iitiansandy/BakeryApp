// const express = require("express");
// const { url } = require("inspector");
// const multer = require("multer");
// const path = require("path");
// const app = express();

// // Set up multer storage configuration
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/");
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(
//       null,
//       file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
//     );
//   },
// });

// // Initialize multer with the storage configuration
// const upload = multer({ storage });

// // Serve uploaded files statically
// app.use("/uploads", express.static("uploads"));
// // Define a route for uploading multiple images
// const uploadMultipleImages = async (req, res) => {
//   try {
//     if (!req.files) {
//       return res.status(400).send("No files were uploaded.");
//     }

//     const PORT=4321;

//     const uploadedFiles = req.files.map((file) => (file.filename));

//     // const uploadedFiles = req.files.map((file) => ({
//     //     filename: file.filename,
//     //     url: `http://localhost:${PORT}/uploads/${file.filename}`,
//     // }));

//     return res.status(200).send({
//       status: true,
//       message: "Files uploaded successfully",
//       data: uploadedFiles,
//     });
//   } catch (error) {
//     return res.status(500).send({ status: false, message: error.message });
//   }
// };

// module.exports = { upload, uploadMultipleImages };


let tripData = {
    "Address": "Agra Village in your country ",
    "Budget": "500",
    "CoverImage": 
        {
        "File_Extension": ".jpg",
        "File_Path": "/storage/emulated/0/Android/media/com.whatsapp.w4b/WhatsApp Business/Media/WhatsApp Business Images/IMG-20230907-WA0033.jpg",
        "File_data": "encodeFileToBase64Binary",
        "File_name": "IMG-20230907-WA0033.jpg"
        },
    "Date": "20/9/2023",
    "editViewModelArrayList": [
        {
        "Day": 1,
        "Index": 1,
        "editType": "DAY"
        }, 
        {
        "Day": 0,
        "Index": 2,
        "editType": "TEXT",
        "textData": "Text editor\u0026nbsp;"
        }, 
        {
        "Day": 0,
        "Index": 3,
        "editType": "IMAGE",
        "fileUpload": {
            "File_Extension": ".jpg",
            "File_Path": "/storage/emulated/0/Android/media/com.whatsapp.w4b/WhatsApp Business/Media/WhatsApp Business Images/IMG-20230907-WA0028.jpg",
            "File_data": "encodeFileToBase64Binary",
            "File_name": "IMG-20230907-WA0028.jpg"
        }
        }, 
        {
        "Day": 2,
        "Index": 4,
        "editType": "DAY"
        }, 
        {
        "Day": 0,
        "Index": 5,
        "Location": "Agra ",
        "editType": "LOCATION"
        }, 
        {
        "Day": 0,
        "Index": 6,
        "editType": "TEXT",
        "textData": "1"
        }, 
        {
        "Day": 0,
        "Index": 7,
        "editType": "TEXT",
        "textData": "2"
        }, 
        {
        "Day": 0,
        "Index": 8,
        "editType": "TEXT",
        "textData": "3"
        }, 
        {
        "Day": 0,
        "Index": 9,
        "editType": "TEXT",
        "textData": "4"
        }, 
        {
        "Day": 0,
        "Index": 10,
        "editType": "IMAGE",
        "fileUpload": {
            "File_Extension": ".jpg",
            "File_Path": "/storage/emulated/0/Android/media/com.whatsapp.w4b/WhatsApp Business/Media/WhatsApp Business Images/IMG-20230908-WA0019.jpg",
            "File_data": "encodeFileToBase64Binary",
            "File_name": "IMG-20230908-WA0019.jpg"
        }
        }, 
        {
        "Day": 0,
        "Index": 11,
        "editType": "IMAGE",
        "fileUpload": {
            "File_Extension": ".jpg",
            "File_Path": "/storage/emulated/0/Android/media/com.whatsapp.w4b/WhatsApp Business/Media/WhatsApp Business Images/IMG-20230907-WA0033.jpg",
            "File_data": "encodeFileToBase64Binary",
            "File_name": "IMG-20230907-WA0033.jpg"
        }
        }],
    "tripName": "Agra travels"
}

