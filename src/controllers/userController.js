const userModel = require("../models/userModel");
const datingModel = require("../models/datingModel");
const businessModel = require("../models/businessModel");
const BFFModel = require("../models/BFFModel");
const travelModel = require("../models/travelModel");
const { generateRandomAlphaNumericID } = require("../controllers/IDGenerator");
const path = require("path");
const fs = require("fs");
const os = require("os");

const { port } = require("../middlewares/config");

// LOGIN USER
const userLogin = async (req, res) => {
  try {
    const { userId, userName, mobile, email, loginType, countryCode } =
      req.body;

    if (loginType === "LOGIN_BY_PHONE") {
      const existingUser = await userModel.findOne({ userId: userId });

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
          email,
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
      const existingUser = await userModel.findOne({ userId: userId });

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
          mobile,
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
const registerUser = async (req, res) => {
  try {
    const { userImages, registerModel } = req.body;

    const parsedData = JSON.parse(registerModel);

    // console.log(parsedData.RootData.name);

    // parsedData.RootData.sessionToken = generateRandomAlphaNumericID(50);
    let userNam = parsedData.RootData.name;
    let userGender = parsedData.RootData.gender;
    let userDOB = parsedData.RootData.DateofBirth;
    let userSessionToken = parsedData.RootData.sessionToken;
    let userMobile = parsedData.RootData.mobile;
    let userEmail = parsedData.RootData.email;
    let userId = parsedData.RootData.userId;

    const existingUser = await userModel.findOne({ userId: userId });
    // console.log(path.join('/uploads'), __dirname);

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

      let networkInterfaces = os.networkInterfaces();

      // Filter and find the IPv4 address (assuming you want IPv4)
      let ipAddress = Object.values(networkInterfaces)
        .flat()
        .filter((iface) => iface.family === "IPv4" && !iface.internal)
        .map((iface) => iface.address)[0];

      let IPAddress = ipAddress;
      let imagePath = "/uploads/";

      // Handle image upload
      for (const file of uploadedFiles) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const extension = file.name.split(".").pop();
        const filename = uniqueSuffix + "." + extension;

        const imgObj = {
          imageName: filename,
          imagePath: `http://${IPAddress}:${port}${imagePath}`,
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

      // console.log('hello');
      existingUser.name = parsedData.RootData.name;
      existingUser.gender = parsedData.RootData.gender;
      existingUser.age = parsedData.RootData.age? parsedData.RootData.age: existingUser.age;
      existingUser.DateofBirth = parsedData.RootData.DateofBirth;
      existingUser.mobile = parsedData.RootData.mobile
        ? parsedData.RootData.mobile
        : existingUser.mobile;
      existingUser.email = parsedData.RootData.email
        ? parsedData.RootData.email
        : existingUser.email;
      existingUser.userImages = userImages;
      existingUser.isNewUser = false;
      existingUser.SexualOrientationModelArrayList = parsedData.RootData
        .SexualOrientationModelArrayList
        ? parsedData.RootData.SexualOrientationModelArrayList
        : null;

      existingUser.accountType = parsedData.RootData.accountType;
      existingUser.isShow_my_Orientation =
        parsedData.RootData.isShow_my_Orientation;
      existingUser.isShow_my_gender = parsedData.RootData.isShow_my_gender;
      existingUser.sessionToken = generateRandomAlphaNumericID(50);

      await existingUser.save();

      // console.log("name", existingUser.name);

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

        let BFFObj = { userId: existingUser.userId };
        await BFFModel.create(BFFObj);

        let businessObj = { userId: existingUser.userId };
        await businessModel.create(businessObj);

        let travelObj = { userId: existingUser.userId };
        await travelModel.create(travelObj);

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
          smoking,
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
          smoking,
          exercise_bff,
          new_to_area_bff,
          politics_bff,
          religion_bff,
          relationship_bff,
          lookingForSmoking,
        };

        let BFFData = await BFFModel.create(BFFObj);

        let datingObj = { userId: existingUser.userId };
        await datingModel.create(datingObj);

        let businessObj = { userId: existingUser.userId };
        await businessModel.create(businessObj);

        let travelObj = { userId: existingUser.userId };
        await travelModel.create(travelObj);

        return res.status(200).send({
          status: true,
          message: "registeration successful",
          RootData: existingUser,
          ModelData: BFFData,
        });
      } else if (existingUser.accountType === "BUSINESS") {
        let { userId, looking_for_bizz, year_of_experience_bizz } =
          parsedData.ModelData;

        let businessObj = {
          userId: existingUser.userId,
          looking_for_bizz,
          year_of_experience_bizz,
        };

        let businessData = await businessModel.create(businessObj);

        let datingObj = { userId: existingUser.userId };
        await datingModel.create(datingObj);

        let travelObj = { userId: existingUser.userId };
        await travelModel.create(travelObj);

        let BFFObj = { userId: existingUser.userId };
        await BFFModel.create(BFFObj);

        return res.status(200).send({
          status: true,
          message: "registeration successful",
          RootData: existingUser,
          ModelData: businessData,
        });
      } else if (existingUser.accountType === "TRAVELING") {
        let {
          userId,
          drinkTravel,
          travelType,
          is_travel_show_my_interests,
          religion,
          smoke_travel,
          looking_for_travel,
          travel_my_interests,
        } = parsedData.ModelData;

        let travelObj = {
          userId: existingUser.userId,
          is_travel_show_my_interests,
          looking_for_travel,
          religion,
          smoke_travel,
          travelType,
          looking_for_travel,
          travel_my_interests,
        };

        let travelData = await travelModel.create(travelObj);

        let datingObj = { userId: existingUser.userId };
        await datingModel.create(datingObj);

        let businessObj = { userId: existingUser.userId };
        await businessModel.create(businessObj);

        let BFFObj = { userId: existingUser.userId };
        await BFFModel.create(BFFObj);

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

        existingUser.sessionToken = generateRandomAlphaNumericID(50);

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

        existingUser.sessionToken = generateRandomAlphaNumericID(50);

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

        existingUser.sessionToken = generateRandomAlphaNumericID(50);

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

        existingUser.sessionToken = generateRandomAlphaNumericID(50);

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

// GET ALL CUSTOMERS
const getAllUsers = async (req, res) => {
  try {
    let users = await userModel.find({ isDeleted: false, isActiveUser: true });
    return res.status(200).send({ status: true, data: users });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

// GET CUSTOMER BY CUSTOMER ID
const getUserById = async (req, res) => {
  try {
    const IPAddress = "192.168.1.14";
    const imagePath = "/uploads/";

    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    // const extension = file.name.split(".").pop();
    const filename = uniqueSuffix; //+ "." + extension;

    const imgObj = {
      imageName: filename,
      imagePath: `http://${IPAddress}:${port}${imagePath}${filename}`,
    };

    // console.log(imgObj);
    // let userId = req.params.userId;
    // let user = await userModel.findOne({
    //   _id: userId,
    //   isDeleted: false,
    //   isActiveUser: true,
    // });
    // if (!user) {
    //   return res.status(404).send({ status: false, message: "user Not found" });
    // }

    return res.status(200).send({ status: true, data: imgObj });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

// UPDATE CUSTOMER
const updateUserById = async (req, res) => {
  try {
    let { userId, sessionToken, accountType } = req.params;

    let user = await userModel.findOne({
      userId: userId,
      isDeleted: false,
    });

    if (!user) {
      return res.status(404).send({ status: false, message: "user Not found" });
    }

    if (user.sessionToken === sessionToken) {
      let body = req.body;

      if ("name" in body) {
        user.name = body.name;
      }

      if ("email" in body && user.loginType !== "LOGIN_BY_GMAIL") {
        user.email = body.email;
      }

      if ("mobile" in body && user.loginType !== "LOGIN_BY_PHONE") {
        user.mobile = body.mobile;
      }

      if ("gender" in body) {
        user.gender = body.gender;
      }

      if ("SexualOrientationModelArrayList" in body) {
        user.SexualOrientationModelArrayList =
          body.SexualOrientationModelArrayList;
      }

      if ("DateofBirth" in body) {
        user.DateofBirth = body.DateofBirth;
      }

      if ("age" in body) {
        user.age = body.age;
      }

      if ("bio" in body) {
        user.bio = body.bio;
      }

      if ("blogWebsite" in body) {
        user.blogWebsite = body.blogWebsite;
      }

      if ("education" in body) {
        user.education = body.education;
      }

      if ("facebookUsername" in body) {
        user.facebookUsername = body.facebookUsername;
      }

      if ("instagramUsername" in body) {
        user.instagramUsername = body.instagramUsername;
      }

      if ("twitterUsername" in body) {
        user.twitterUsername = body.twitterUsername;
      }

      if ("isShow_my_Orientation" in body) {
        user.isShow_my_Orientation = body.isShow_my_Orientation;
      }

      if ("isShow_my_gender" in body) {
        user.isShow_my_gender = body.isShow_my_gender;
      }

      if ("languages" in body) {
        user.languages = body.languages;
      }

      if ("latitude" in body) {
        user.latitude = body.latitude;
      }

      if ("longitude" in body) {
        user.longitude = body.longitude;
      }

      if ("religion" in body) {
        user.religion = body.religion;
      }

      if ("whatsAppNumber" in body) {
        user.whatsAppNumber = body.whatsAppNumber;
      }

      if ("starSign" in body) {
        user.starSign = body.starSign;
      }

      await user.save();

      return res.status(200).send({
        status: true,
        message: "updated successfully",
        data: user,
        isSessionExpired: false,
      });
    } else {
      return res.status(200).send({
        status: true,
        message: "Unauthorized",
        isSessionExpired: true,
      });
    }
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

// UPDATE IMAGE
const updateUserImage = async (req, res) => {
  try {
    let userId = req.params.userId;
    let sessionToken = req.params.sessionToken;

    let { userImage, ImageModel } = req.body;
    let parsedData = JSON.parse(ImageModel);

    // console.log(parsedData);

    let index = parsedData.index; //{"isNewPick":false,"index":1,"img_id":"64ffebc1f3bfc5d77220193b","imageName":"1694493633669-432139964.jpg"}
    let img_id = parsedData.img_id;
    let isNewPick = parsedData.isNewPick;
    let imageName = parsedData.imageName;
    // console.log(index);

    // console.log(typeof index, typeof img_id);

    if (!isNewPick) {
      let user = await userModel.findOne({ userId: userId });
      // console.log(user);

      if (!user) {
        return res.status(404).send({ status: true, message: "Unauthorized" });
      }

      if (user.sessionToken === sessionToken) {
        const updatedImage = user.userImages[index];

        // console.log(updatedImage.imageName);
        let userImage = req.files.userImage;

        if (!updatedImage) {
          return res
            .status(404)
            .send({ status: true, message: "Image not found" });
        }

        let filePath = path.join(__dirname, "uploads", updatedImage.imageName);
        let networkInterfaces = os.networkInterfaces();

        // Filter and find the IPv4 address (assuming you want IPv4)
        let ipAddress = Object.values(networkInterfaces)
          .flat()
          .filter((iface) => iface.family === "IPv4" && !iface.internal)
          .map((iface) => iface.address)[0];

        // Delete the old image file from the file system
        fs.unlinkSync(filePath);
        
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const extension = userImage.name.split(".").pop();
        const filename = uniqueSuffix + "." + extension;
        filePath = path.join(__dirname, "uploads", filename);

        let IPAddress = ipAddress;
        let ImagePath = "/uploads/";

        const imgObj = {
          imageName: filename,
          imagePath: `http://${IPAddress}:${port}${ImagePath}`,
        };
        
        userImage.mv(filePath, (err) => {
          if (err) {
            console.error(err);
            return res.status(400).json({ error: "Image upload failed" });
          }
        });

        user.userImages[index] = imgObj;

        await user.save();
        return res.status(200).send({
          status: true,
          message: "Image added successfully",
          isSessionExpired: false,
          userImages: user.userImages,
        });
      } else {
        return res.status(200).send({
          status: true,
          message: "Unauthorized",
          isSessionExpired: true,
        });
      }
    } else {
      let user = await userModel.findOne({ userId: userId });

      // console.log(user.name);
      if (!user) {
        return res.status(404).send({ status: true, message: "Unauthorized" });
      }

      if (user.sessionToken === sessionToken) {
        let userImage = req.files.userImage;

        // console.log(userImage);
        if (!userImage) {
          return res.status(400).json({ status: "No image uploaded" });
        }

        let networkInterfaces = os.networkInterfaces();

        // Filter and find the IPv4 address (assuming you want IPv4)
        let ipAddress = Object.values(networkInterfaces)
          .flat()
          .filter((iface) => iface.family === "IPv4" && !iface.internal)
          .map((iface) => iface.address)[0];

        let IPAddress = ipAddress;
        let ImagePath = "/uploads/";

        // Update the existing image with new data
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const extension = userImage.name.split(".").pop();
        const filename = uniqueSuffix + "." + extension;

        imageName = filename;
        imagePath = `http://${IPAddress}:${port}${ImagePath}`;
        let filePath = `./src/controllers${ImagePath}${filename}`;

        let newImage = {
          imageName: filename,
          imagePath: `http://${IPAddress}:${port}${ImagePath}`,
        };

        userImage.mv(filePath, (err) => {
          if (err) {
            console.log(err);
            return res
              .status(500)
              .send({ status: false, message: "Image upload failed" });
          }
        });

        user.userImages.push(newImage);

        await user.save();

        return res.status(200).send({
          status: true,
          message: "image updated successfully",
          isSessionExpired: false,
          userImages: user.userImages,
        });
      } else {
        return res.status(200).send({
          status: true,
          message: "Unauthorized",
          isSessionExpired: true,
        });
      }
    }
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

// DELETE USER IMAGE BY IMAGE ID
const deleteUserImage = async (req, res) => {
  try {
    let { userId, sessionToken, pickId } = req.params;

    let user = await userModel.findOne({ userId: userId });

    // console.log('hello: ', user.userImages[0]._id.toString());
    if (user.sessionToken === sessionToken) {
      for (let i = 0; i < user.userImages.length; i++) {
        // console.log('hi', user.userImages[i]);
        if (user.userImages[i]._id.toString() === pickId) {
          let deletedImage = user.userImages[i].imageName;

          let filePath = path.join(__dirname, "uploads", deletedImage);

          fs.unlinkSync(filePath);

          // console.log('before', user.userImages[i])

          let arr = user.userImages;
          arr.splice(i, 1);
          user.userImages = arr;
          await user.save();

          // console.log('after', user.userImages[i]);

          return res.status(200).send({
            status: true,
            message: "image deleted successfully",
            isSessionExpired: false,
            userImages: user.userImages,
          });
        }
      }
    } else {
      return res.status(200).send({
        status: true,
        message: "Unauthorized",
        isSessionExpired: true,
      });
    }
  } catch (error) {
    // console.log(error.message);
    return res.status(500).send({ status: false, message: error.message });
  }
};

// DELETE USER BY USER ID
const deleteUserById = async (req, res) => {
  try {
    let { userId, sessionToken, accountType } = req.params;

    let data = req.body;
    let { reason, feedback } = data;

    // console.log(data);

    let user = await userModel.findOne({ userId: userId });
    if (!user) {
      return res.status(404).send({ status: false, message: "user not found" });
    }

    if (user.sessionToken !== sessionToken && user.accountType !== accountType) {
      return res.status(200).send({
        status: true,
        message: "Unauthorized",
        isSessionExpired: true,
      });
    }

    user.isDeleted = true;
    user.deletedAt = Date.now();
    user.reason = reason;
    user.feedback = feedback;

    await user.save();

    // console.log(user.isDeleted);

    await BFFModel.deleteOne({userId: userId});

    await businessModel.deleteOne({userId: userId});

    await datingModel.deleteOne({userId: userId});

    await travelModel.deleteOne({userId: userId});

    return res.status(200).send({
      status: true,
      message: "user deleted successfully",
      isSessionExpired: true,
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = {
  userLogin,
  registerUser,
  getAllUsers,
  getUserById,
  updateUserById,
  updateUserImage,
  deleteUserImage,
  deleteUserById,
};
