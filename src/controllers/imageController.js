const { initializeApp } = require('firebase/app');
const { getStorage, ref, getDownloadURL, uploadBytesResumable } = require('firebase/storage');
const config = require('../middlewares/firebase');

//Initialize a firebase application
initializeApp(config.firebaseConfig);

// Initialize Cloud Storage and get a reference to the service
const storage = getStorage();

// Setting up multer as a middleware to grab photo uploads


const uploadImage = async (blobFile) => {
        const dateTime = giveCurrentDateTime();
        const storageRef = ref(storage, `files/${dateTime.toString().replace(" ","_")+"_"+blobFile.name.replace(" ","_")}`);
    
        // // Create file metadata including the content type
        const metadata = {
            contentType: blobFile.mimetype,
        };

        // // Upload the file in the bucket storage
        const snapshot = await uploadBytesResumable(storageRef, blobFile.data, metadata);
        //by using uploadBytesResumable we can control the progress of uploading like pause, resume, cancel
        
        // Grab the public url
        const downloadURL = await getDownloadURL(snapshot.ref);
        return {
            message: 'file uploaded to firebase storage',
            name: snapshot.metadata.name,
            type: blobFile.mimetype,
            imageURL: downloadURL
        };
};

const giveCurrentDateTime = () => {
    const today = new Date();
    const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    const dateTime = date + ' ' + time;
    return dateTime;
}

module.exports = { uploadImage }