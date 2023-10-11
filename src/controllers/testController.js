const userModel = require("../models/userModel");
const datingModel = require("../models/datingModel");
const businessModel = require("../models/businessModel");
const BFFModel = require("../models/BFFModel");
const travelModel = require("../models/travelModel");
const { generateRandomAlphaNumericID } = require("../controllers/IDGenerator");
const fs = require("fs");
const { port } = require("../middlewares/config");

// LOGIN USER
const login = async (req, res) => {
  try {
    const { userId, userName, mobile, email, loginType, countryCode } =
      req.body;

    if (loginType === "LOGIN_BY_PHONE") {
      const existingUser = await userModel.findOne({ userId });

      if (
        existingUser &&
        existingUser.name &&
        existingUser.DateofBirth &&
        existingUser.gender
      ) {
        if (
          // existingUser.isNewUser === false &&
          existingUser.accountType === "DATING"
        ) {
          let datingData = await datingModel.findOne({
            userId: userId,
          });
          return res.status(200).send({
            status: true,
            message: "Login successfully",
            RootData: existingUser,
            ModelData: datingData,
          });
        } else if (
          existingUser.isNewUser === false &&
          existingUser.accountType === "BFF"
        ) {
          let BFFData = await BFFModel.findOne({
            userId: userId,
          });
          return res.status(200).send({
            status: true,
            message: "user already registered",
            RootData: existingUser,
            ModelData: BFFData,
          });
        } else if (
          existingUser.isNewUser === false &&
          existingUser.accountType === "BUSINESS"
        ) {
          let businessData = await businessModel.findOne({
            userId: userId,
          });
          return res.status(200).send({
            status: true,
            message: "user already registered",
            RootData: existingUser,
            ModelData: businessData,
          });
        } else if (
          existingUser.isNewUser === false &&
          existingUser.accountType === "TRAVELING"
        ) {
          let travelData = await travelModel.findOne({
            userId: userId,
          });
          return res.status(200).send({
            status: true,
            message: "user already registered",
            RootData: existingUser,
            ModelData: travelData,
          });
        }
      } else if (existingUser && existingUser.mobile) {
        return res.status(200).send({
          status: true,
          message: "User is already authenticated",
          isNewUser: true,
        });
      } else {
        const newUser = new userModel({
          userId,
          userName,
          mobile,
          countryCode,
          loginType,
        });

        await newUser.save();

        return res.status(200).send({
          status: true,
          message: "Authentication successful",
          isNewUser: true,
        });
      }
    } else if (loginType === "LOGIN_BY_GMAIL") {
      const existingUser = await userModel.findOne({ userId });

      if (
        existingUser &&
        existingUser.name &&
        existingUser.DateofBirth &&
        existingUser.gender
      ) {
        if (
          existingUser.isNewUser === false &&
          existingUser.accountType === "DATING"
        ) {
          let datingData = await datingModel.findOne({
            userId: userId,
          });
          return res.status(200).send({
            status: true,
            message: "Login successfully",
            RootData: existingUser,
            ModelData: datingData,
          });
        } else if (
          existingUser.isNewUser === false &&
          existingUser.accountType === "BFF"
        ) {
          let BFFData = await BFFModel.findOne({
            userId: userId,
          });
          return res.status(200).send({
            status: true,
            message: "user already registered",
            RootData: existingUser,
            ModelData: BFFData,
          });
        } else if (
          existingUser.isNewUser === false &&
          existingUser.accountType === "BUSINESS"
        ) {
          let businessData = await businessModel.findOne({
            userId: userId,
          });
          return res.status(200).send({
            status: true,
            message: "user already registered",
            RootData: existingUser,
            ModelData: businessData,
          });
        } else if (
          existingUser.isNewUser === false &&
          existingUser.accountType === "TRAVELING"
        ) {
          let travelData = await travelModel.findOne({
            userId: userId,
          });
          return res.status(200).send({
            status: true,
            message: "user already registered",
            RootData: existingUser,
            ModelData: travelData,
          });
        }
      } else if (existingUser && existingUser.email) {
        return res.status(200).send({
          status: true,
          message: "Authentication successful",
          isNewUser: true,
        });
      } else {
        const newUser = new userModel({
          userId,
          userName,
          email,
          loginType,
        });

        await newUser.save();
        return res.status(200).send({
          status: true,
          message: "Authentication successful",
          isNewUser: true,
        });
      }
    }
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

// REGISTER USER
const register = async (req, res) => {
  try {
    const { userImages, registerModel } = req.body;

    const parsedData = JSON.parse(registerModel);

    parsedData.RootData.sessionToken = generateRandomAlphaNumericID(50);
    let userNam = parsedData.RootData.name;
    let userGender = parsedData.RootData.gender;
    let userDOB = parsedData.RootData.DateofBirth;
    let userSessionToken = parsedData.RootData.sessionToken;
    let userMobile = parsedData.RootData.mobile;
    let userEmail = parsedData.RootData.email;
    let userId = parsedData.RootData.userId;

    // let existingUser = await userModel.findOne({
    //   $or: [{ email: userEmail }, { mobile: userMobile }],
    // });

    const existingUser = await userModel.findOne({ userId: userId });

    if (!existingUser) {
      return res.status(400).send({
        status: false,
        message:
          "User is not authenticated, please authenticate the user first",
      });
    } else if (existingUser && existingUser.isNewUser === true) {
      const uploadedFiles = Array.isArray(req.files.userImages)
        ? req.files.userImages
        : [req.files.userImages];

      if (uploadedFiles.length === 0) {
        return res.status(400).send({
          status: false,
          error: "No valid image files were uploaded.",
        });
      }

      const userImages = [];

      const IPAddress = "192.168.1.10";
      const imagePath = "/uploads/";
      const userId = existingUser._id;

      // Create a unique folder for each user
      const userFolder = `${__dirname}/uploads/${userId}`;

      if (!fs.existsSync(userFolder)) {
        fs.mkdirSync(userFolder);
      }

      // Handle image upload
      // Handle image upload
      for (const file of uploadedFiles) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const extension = file.name.split(".").pop();
        const filename = uniqueSuffix + "." + extension;

        const imgObj = {
          imageName: filename,
          imagePath: `http://${IPAddress}:${port}${imagePath}${userId}/${filename}`,
        };

        // http://192.168.1.10:5001/uploads/1694416422175-674897023.jpg

        const filePath = `./src/controllers${imagePath}${filename}`;

        file.mv(filePath, (err) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: "Image upload failed" });
          }
        });

        userImages.push(imgObj);
      }

      existingUser.name = parsedData.RootData.name;
      existingUser.gender = parsedData.RootData.gender;
      existingUser.DateofBirth = parsedData.RootData.DateofBirth;
      //   existingUser.userId = existingUser.userId;
      existingUser.userImages = userImages;
      existingUser.isNewUser = false;
      existingUser.SexualOrientationModelArrayList =
        parsedData.RootData.SexualOrientationModelArrayList;
      existingUser.accountType = parsedData.RootData.accountType;
      existingUser.isShow_my_Orientation =
        parsedData.RootData.isShow_my_Orientation;
      existingUser.isShow_my_gender = parsedData.RootData.isShow_my_gender;
      existingUser.sessionToken = parsedData.RootData.sessionToken;

      await existingUser.save();

      if (existingUser.accountType === "DATING") {
        let {
          userId,
          cooking,
          eatingHabits,
          excercise,
          height,
          isShow_my_interests,
          kids,
          looking_for,
          my_interests,
          partying,
          politics,
          religion,
          smoking,
          starSign,
        } = parsedData.ModelData;

        let datingObj = {
          userId: existingUser.userId,
          cooking,
          eatingHabits,
          excercise,
          height,
          isShow_my_interests,
          kids,
          looking_for,
          my_interests,
          partying,
          politics,
          religion,
          smoking,
          starSign,
        };

        let datingData = await datingModel.create(datingObj);

        return res.status(200).send({
          status: true,
          message: "registeration successful",
          RootData: existingUser,
          ModelData: datingData,
        });
      } else if (existingUser.accountType === "BFF") {
        let {
          userId,
          bizzmy_interests,
          isBizz_show_my_interests,
          looking_for_bff,
          kids_bff,
          exercise_bff,
          new_to_area_bff,
          email_address,
          politics_bff,
          religion_bff,
          relationship_bff,
          lookingForSmoking,
        } = parsedData.ModelData;

        let BFFObj = {
          userId: existingUser.userId,
          bizzmy_interests,
          isBizz_show_my_interests,
          looking_for_bff,
          kids_bff,
          exercise_bff,
          new_to_area_bff,
          email_address,
          politics_bff,
          religion_bff,
          relationship_bff,
          lookingForSmoking,
        };

        let BFFData = await BFFModel.create(BFFObj);

        return res.status(200).send({
          status: true,
          message: "registeration successful",
          RootData: existingUser,
          ModelData: BFFData,
        });
      } else if (existingUser.accountType === "BUSINESS") {
        let { userId, emailAddress, looking_for_bizz } = parsedData.ModelData;

        let businessObj = {
          userId: existingUser.userId,
          emailAddress,
          looking_for_bizz,
        };

        let businessData = await businessModel.create(businessObj);

        return res.status(200).send({
          status: true,
          message: "registeration successful",
          RootData: existingUser,
          ModelData: businessData,
        });
      } else if (existingUser.accountType === "TRAVELING") {
        let {
          userId,
          emailAddress,
          is_travel_show_my_interests,
          religion,
          smoke_travel,
          looking_for_travel,
          travel_my_interests,
        } = parsedData.ModelData;

        let travelObj = {
          userId: existingUser.userId,
          emailAddress: existingUser.email,
          is_travel_show_my_interests,
          looking_for_travel,
          religion,
          smoke_travel,
          looking_for_travel,
          travel_my_interests,
        };

        let travelData = await travelModel.create(travelObj);

        return res.status(200).send({
          status: true,
          message: "registeration successful",
          RootData: existingUser,
          ModelData: travelData,
        });
      }
    } else {
      if (
        existingUser.isNewUser === false &&
        existingUser.accountType === "DATING"
      ) {
        let datingData = await datingModel.findOne({
          userId: existingUser.userId,
        });
        return res.status(200).send({
          status: true,
          message: "user already registered",
          RootData: existingUser,
          ModelData: datingData,
        });
      } else if (
        existingUser.isNewUser === false &&
        existingUser.accountType === "BFF"
      ) {
        let BFFData = await BFFModel.findOne({
          userId: existingUser.userId,
        });
        return res.status(200).send({
          status: true,
          message: "user already registered",
          RootData: existingUser,
          ModelData: BFFData,
        });
      } else if (
        existingUser.isNewUser === false &&
        existingUser.accountType === "BUSINESS"
      ) {
        let businessData = await businessModel.findOne({
          userId: existingUser.userId,
        });
        return res.status(200).send({
          status: true,
          message: "user already registered",
          RootData: existingUser,
          ModelData: businessData,
        });
      } else if (
        existingUser.isNewUser === false &&
        existingUser.accountType === "TRAVELING"
      ) {
        let travelData = await travelModel.findOne({
          userId: existingUser.userId,
        });
        return res.status(200).send({
          status: true,
          message: "user already registered",
          RootData: existingUser,
          ModelData: travelData,
        });
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "An error occurred" });
  }
};

// UPDATE AND STORE IMAGE
const updateImage = async (req, res) => {
  try {
    if (!req.files || !req.files.image) {
      return res.status(400).json({ error: "No image file uploaded" });
    }

    let userImage = req.files.image;

    // Get the uploaded image data as a Buffer
    const imageBuffer = req.files.image.data;

    // Encode the image data to Base64
    const encodedImage = imageBuffer.toString("base64");

    // Define the target folder where you want to save the decoded image
    const targetFolder = "./tripImages";

    // Ensure the target folder exists (create it if it doesn't)
    if (!fs.existsSync(targetFolder)) {
      fs.mkdirSync(targetFolder, { recursive: true });
    }

    const extension = userImage.name.split(".").pop();

    // Generate a unique filename for the image (e.g., using uuid)
    const uniqueFileName = `${uuidv4()}.${extension}`;

    // Specify the path for the saved image
    const targetPath = `${targetFolder}/${uniqueFileName}`; // Change the file extension as needed

    // console.log(targetPath);

    // Write the decoded image data to the target file
    fs.writeFile(targetPath, encodedImage, "base64", (err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to save the image" });
      }

      return res
        .status(200)
        .json({ message: "Image encoded and saved successfully" });
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};



let Obj = {
  Address: "Agra Village in your country ",
  Budget: "250",
  CoverImage: {
    File_Extension: ".jpg",
    File_Path:
      "/storage/emulated/0/Android/media/com.whatsapp.w4b/WhatsApp Business/Media/WhatsApp Business Images/IMG-20230907-WA0046.jpg",
    File_data: "/9j/",
    File_name: "IMG-20230907-WA0046.jpg",
  },
  Date: "22/11/2023",
  editViewModelArrayList: [
    {
      Day: 0,
      Index: 1,
      editType: "TEXT",
      textData:
        "The G20 Summit didn't go according to plans for Canadian Prime Minister Justin Trudeau and his delegation as their return was delayed by almost 2 days after a technical snag onboard Canada's aircraft. As per sources, India offered services of aircraft 'Air India One' to the Justin Trudeau-led delegation, but the Canadian side chose to wait for the backup aircraft.",
    },
    { Day: 1, Index: 2, editType: "DAY" },
    { Day: 0, Index: 6, editType: "IMAGE", fileUpload: [Object] },
    { Day: 0, Index: 7, editType: "IMAGE", fileUpload: [Object] },
    { Day: 2, Index: 8, editType: "DAY" },
    {
      Day: 0,
      Index: 9,
      editType: "TEXT",
      textData:
        "The G20 Summit didn't go according to plans for Canadian Prime Minister Justin Trudeau and his delegation as their return was delayed by almost 2 days after a technical snag onboard Canada's aircraft. As per sources, India offered services of aircraft 'Air India One' to the Justin Trudeau-led delegation, but the Canadian side chose to wait for the backup aircraft.",
    },
  ],
  tripName: "Agra travels",
};



module.exports = { login, register };
