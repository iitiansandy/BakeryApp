const userModel = require("../models/userModel");
const tripModel = require("../models/tripModel");
const travelModel = require("../models/travelModel");
const travelPartnerModel = require("../models/travelPartnerModel");
const likeModel = require("../models/likeModel");
const fs = require("fs");
const os = require("os");
const path = require("path");
const base64Img = require("base64-img");
const { v4: uuidv4 } = require("uuid");
const { port } = require("../middlewares/config");
const businessModel = require("../models/businessModel");

// ADD USER TRAVEL DETAILS
const addUserTravelDetails = async (req, res) => {
  try {
    const { userId, sessionToken, accountType } = req.params;

    let {
      Address,
      Budget,
      CoverImage,
      Date,
      editViewModelArrayList,
      tripName,
    } = req.body;

    // console.log(req.body.Date);

    let user = await userModel.findOne({ userId: userId });
    if (!user) {
      return res.status(404).send({ status: false, message: "Unauthorized" });
    }

    if (user.sessionToken === sessionToken) {
      if (user.accountType === "TRAVELING") {
        let { File_Extension, File_Path, File_data, File_name } =
          req.body.CoverImage;

        // console.log(user.name);

        if (
          !req.body.CoverImage.File_Extension ||
          !req.body.CoverImage.File_Path ||
          !req.body.CoverImage.File_data ||
          !req.body.CoverImage.File_name
        ) {
          return res
            .status(400)
            .json({ status: "please provide complete cover image data" });
        }

        let decodedContents = Buffer.from(File_data, "base64");

        //console.log('buffer', decodedContents);
        let networkInterfaces = os.networkInterfaces();

        // Filter and find the IPv4 address (assuming you want IPv4)
        let ipAddress = Object.values(networkInterfaces)
          .flat()
          .filter((iface) => iface.family === "IPv4" && !iface.internal)
          .map((iface) => iface.address)[0];

        let IPAddress = ipAddress;
        let ImagePath = "/tripImages/";

        // Update the existing image with new data
        let uniqueSuffix = Math.round(Math.random() * 1e9);

        let extension = File_Extension;
        let filename = uniqueSuffix + extension;

        imageName = filename;
        let imagePath = `http://${IPAddress}:${port}${ImagePath}`;
        let filePath = `./${ImagePath}${filename}`;

        // console.log(filePath)
        // console.log(imagePath);

        let newImage = {
          imageName: filename,
          imagePath: imagePath, //`http://${IPAddress}:${port}${ImagePath}`
        };

        // console.log(newImage);

        fs.writeFileSync(filePath, decodedContents);

        // console.log("New image", newImage);

        CoverImage = newImage;

        // console.log('coverImage', CoverImage);
        let editArr = [];

        if (editViewModelArrayList) {
          // console.log(editViewModelArrayList);

          for (let i = 0; i < editViewModelArrayList.length; i++) {
            if (editViewModelArrayList[i].editType === "DAY") {
              console.log("DAY Called");

              let arr1 = {
                Day: editViewModelArrayList[i].Day,
                Index: editViewModelArrayList[i].Index,
                editType: editViewModelArrayList[i].editType,
              };
              editArr.push(arr1);
            }
            if (editViewModelArrayList[i].editType === "TEXT") {
              console.log("text called");

              let arr2 = {
                Day: editViewModelArrayList[i].Day,
                Index: editViewModelArrayList[i].Index,
                editType: editViewModelArrayList[i].editType,
                TextData: editViewModelArrayList[i].TextData,
              };
              editArr.push(arr2);
              // console.log(editArr);
            }
            if (editViewModelArrayList[i].editType === "IMAGE") {
              console.log("image called");
              const { File_Extension, File_Path, File_data, File_name } =
                editViewModelArrayList[i].fileUpload;
              // console.log(editViewModelArrayList[i].fileUpload);

              if (
                !req.body.editViewModelArrayList[i].fileUpload.File_Extension ||
                !req.body.editViewModelArrayList[i].fileUpload.File_Path ||
                !req.body.editViewModelArrayList[i].fileUpload.File_data ||
                !req.body.editViewModelArrayList[i].fileUpload.File_name
              ) {
                return res.status(400).json({
                  status: "please provide all the uploadfile data properly",
                });
              }

              let decodedContents = Buffer.from(File_data, "base64");
              let IPAddress = ipAddress;
              let ImagePath = "/tripImages/";

              const uniqueSuffix = Math.round(Math.random() * 1e9);
              let extension = File_Extension;
              let filename = uniqueSuffix + extension;

              imageName = filename;
              imagePath = `http://${IPAddress}:${port}${ImagePath}`;
              let filePath = `./${ImagePath}${filename}`;

              let newImage = {
                imageName: filename,
                imagePath: `http://${IPAddress}:${port}${ImagePath}`,
              };

              fs.writeFileSync(filePath, decodedContents);

              // fileUpload = newImage;

              let arr3 = {
                Day: editViewModelArrayList[i].Day,
                Index: editViewModelArrayList[i].Index,
                editType: editViewModelArrayList[i].editType,
                fileUpload: newImage,
              };
              editArr.push(arr3);
            }

            if (editViewModelArrayList[i].editType === "LOCATION") {
              console.log("location called");
              let arr4 = {
                Day: editViewModelArrayList[i].Day,
                Index: editViewModelArrayList[i].Index,
                editType: editViewModelArrayList[i].editType,
                Location: editViewModelArrayList[i].Location,
              };
              editArr.push(arr4);
            }
          }
        }

        let tripObj = {
          userId: user.userId,
          Address,
          Budget,
          CoverImage: newImage,
          Date,
          editViewModelArrayList: editArr,
          tripName,
        };

        let tripData = await tripModel.create(tripObj);

        return res.status(200).send({
          status: true,
          message: "Trip data added successfully",
          tripData: tripData,
          isSessionExpired: false,
        });
      } else {
        return res.status(200).send({
          status: true,
          message: "Unauthorized",
          isSessionExpired: false,
        });
      }
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

// GET USER'S ALL TRIPS
const getUserAllTrips = async (req, res) => {
  try {
    let { userId, sessionToken, accountType } = req.params;

    let user = await userModel.findOne({ userId: userId, isDeleted: false });

    if (!user) {
      return res.status(400).send({ status: false, message: "user not found" });
    }

    if (
      user.sessionToken === sessionToken &&
      user.accountType === accountType
    ) {
      let { tripId, travelPartnerId } = req.body;
      // let travelData = await travelModel.findOne({ userId: userId });
      // let userTrips = await tripModel.find({ userId: userId });
      // let allTravelPartners = await travelPartnerModel.find({
      //   userId: userId,
      // });

      let allTripInterests = await likeModel.find({
        userId: userId,
        accountType: "TRAVELING",
        tripId: tripId,
      });

      // console.log("allTripInterests", allTripInterests);

      let tripInterestedUser, tripInterestedModelData;

      let joinTripData = [];

      let interestTravelData = [];

      for (let i = 0; i < allTripInterests.length; i++) {
        if (allTripInterests[i].swipAction === "JOIN") {
          tripInterestedUser = await userModel.findOne({
            userId: allTripInterests[i].userId,
          });

          tripInterestedModelData = await travelModel.findOne({
            userId: tripInterestedUser.userId,
          });

          let joinTripObj = {
            RootData: tripInterestedUser,
            ModelData: tripInterestedModelData,
          };

          joinTripData.push(joinTripObj);
        }
      }

      let allTravelPartnersInterests = await likeModel.find({
        userProfileId: userId,
        accountType: "TRAVELING",
        travelPartnerId: travelPartnerId,
      });

      let travelPartnerInterestedUser, travelPartnerInterestedModelData;

      for (let i = 0; i < allTravelPartnersInterests.length; i++) {
        if (allTripInterests[i].swipAction === "INTEREST") {
          travelPartnerInterestedUser = await userModel.findOne({
            userId: allTravelPartnersInterests[i].userId,
          });

          travelPartnerInterestedModelData = await travelModel.findOne({
            userId: travelPartnerInterestedUser.userId,
          });

          let interestTravelObj = {
            RootData: travelPartnerInterestedUser,
            ModelData: travelPartnerInterestedModelData,
          };

          interestTravelData.push(interestTravelObj);
        }
      }

      if (allTripInterests && tripInterestedUser) {
        return res.status(200).send({
          status: true,
          message: "success",
          isSessionExpired: false,
          TripData: joinTripData,
        });
      } else if (allTravelPartnersInterests && travelPartnerInterestedUser) {
        return res.status(200).send({
          status: true,
          message: "success",
          isSessionExpired: false,
          TravelPartnerData: interestTravelData,
        });
      }
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

// UPDATE USER'S TRIP DATA
const updateUserTripData = async (req, res) => {
  try {
    let { userId, sessionToken, accountType, tripId } = req.params;

    let {
      Address,
      Budget,
      CoverImage,
      Date,
      editViewModelArrayList,
      tripName,
    } = req.body;

    let user = await userModel.findOne({ userId: userId, isDeleted: false });

    if (!user) {
      return res.status(404).send({ status: false, message: "user not found" });
    }

    if (user.sessionToken === sessionToken) {
      if (user.accountType === "TRAVELING" && accountType === "TRAVELING") {
        let tripData = await tripModel.findOne({ _id: tripId, userId: userId });

        // console.log(tripData)

        if (!tripData) {
          return res
            .status(404)
            .send({ status: false, message: "Trip data not found" });
        }

        // GET CURRENT IP ADDRESS
        let networkInterfaces = os.networkInterfaces();
        // Filter and find the IPv4 address (assuming you want IPv4)
        let ipAddress = Object.values(networkInterfaces)
          .flat()
          .filter((iface) => iface.family === "IPv4" && !iface.internal)
          .map((iface) => iface.address)[0];

        if (req.body.CoverImage.updatedFileUpload) {
          let { File_Extension, File_Path, File_data, File_name } =
            req.body.CoverImage.updatedFileUpload;

          if (
            !req.body.CoverImage.updatedFileUpload.File_Extension ||
            !req.body.CoverImage.updatedFileUpload.File_Path ||
            !req.body.CoverImage.updatedFileUpload.File_data ||
            !req.body.CoverImage.updatedFileUpload.File_name
          ) {
            return res
              .status(400)
              .json({ status: "please provide complete cover image data" });
          }

          let ImagePath = "/tripImages/";
          let imageNameToDelete = tripData.CoverImage.imageName;

          // console.log('deleted image name', imageNameToDelete);

          // let existingImagePath = `${ImagePath}${imageName}`;

          // Construct the full path to the image file
          const tripImagesFolderPath = path.join(
            __dirname,
            "..",
            "..",
            "tripImages"
          ); // Adjust the path as needed based on your folder structure

          // console.log('tripimagefolderpath', tripImagesFolderPath);
          const filePathToDelete = path.join(
            tripImagesFolderPath,
            imageNameToDelete
          );

          // console.log(filePath);

          // Check if the file exists before attempting to delete it
          if (fs.existsSync(filePathToDelete)) {
            // Delete the file
            fs.unlinkSync(filePathToDelete);
            console.log(`Deleted ${imageNameToDelete}`);
          } else {
            console.log(`File ${imageNameToDelete} does not exist.`);
          }

          // Delete the old image file from the file system
          //fs.unlinkSync(filePath);

          let decodedContents = Buffer.from(File_data, "base64");

          let IPAddress = ipAddress;
          // let ImagePath = "/tripImages/";

          // Update the existing image with new data
          let uniqueSuffix = Math.round(Math.random() * 1e9);

          let extension = File_Extension;
          let filename = uniqueSuffix + extension;

          imageName = filename;
          let imagePath = `http://${IPAddress}:${port}${ImagePath}`;
          let filePath = `./${ImagePath}${filename}`;

          let newImage = {
            imageName: filename,
            imagePath: imagePath, //`http://${IPAddress}:${port}${ImagePath}`
          };

          // console.log(newImage);

          fs.writeFileSync(filePath, decodedContents);

          tripData.CoverImage = newImage;
        }

        if ("Address" in req.body) {
          tripData.Address = req.body.Address;
        }

        if ("Budget" in req.body) {
          tripData.Budget = req.body.Budget;
        }

        if ("Date" in req.body) {
          tripData.Date = req.body.Date;
        }

        if ("tripName" in req.body) {
          tripData.tripName = req.body.tripName;
        }

        if (editViewModelArrayList) {
          for (let i = 0; i < editViewModelArrayList.length; i++) {
            if (editViewModelArrayList[i].editType === "DAY") {
              console.log("DAY Called");

              tripData.editViewModelArrayList[i].Day =
                editViewModelArrayList[i].Day;
              tripData.editViewModelArrayList[i].Index =
                editViewModelArrayList[i].Index;
              tripData.editViewModelArrayList[i].editType =
                editViewModelArrayList[i].editType;
              // editArr.push(arr1);
            }
            if (editViewModelArrayList[i].editType === "TEXT") {
              console.log("text called");
              tripData.editViewModelArrayList[i].Day =
                editViewModelArrayList[i].Day;
              tripData.editViewModelArrayList[i].Index =
                editViewModelArrayList[i].Index;
              tripData.editViewModelArrayList[i].editType =
                editViewModelArrayList[i].editType;
              tripData.editViewModelArrayList[i].TextData =
                editViewModelArrayList[i].TextData;
            }
            if (editViewModelArrayList[i].editType === "IMAGE") {
              console.log("image called");

              if (editViewModelArrayList[i].fileUpload.updatedFileUpload) {
                const { File_Extension, File_Path, File_data, File_name } =
                  editViewModelArrayList[i].fileUpload.updatedFileUpload;
                // console.log(editViewModelArrayList[i].fileUpload);

                if (
                  !req.body.editViewModelArrayList[i].fileUpload
                    .File_Extension ||
                  !req.body.editViewModelArrayList[i].fileUpload.File_Path ||
                  !req.body.editViewModelArrayList[i].fileUpload.File_data ||
                  !req.body.editViewModelArrayList[i].fileUpload.File_name
                ) {
                  return res.status(400).json({
                    status: "please provide all the uploadfile data properly",
                  });
                }

                /* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
                // Code to Delete Image from local system
                let ImagePath = "/tripImages/";
                let imageNameToDelete =
                  tripData.editViewModelArrayList[i].fileUpload.imageName;

                // Construct the full path to the image file
                const tripImagesFolderPath = path.join(
                  __dirname,
                  "..",
                  "..",
                  "tripImages"
                );

                // console.log('tripimagefolderpath', tripImagesFolderPath);
                const filePathToDelete = path.join(
                  tripImagesFolderPath,
                  imageNameToDelete
                );

                // Check if the file exists before attempting to delete it
                if (fs.existsSync(filePathToDelete)) {
                  // Delete the file
                  fs.unlinkSync(filePathToDelete);
                  console.log(`Deleted ${imageNameToDelete}`);
                } else {
                  console.log(`File ${imageNameToDelete} does not exist.`);
                }

                /* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
                let decodedContents = Buffer.from(File_data, "base64");
                let IPAddress = ipAddress;
                // let ImagePath = "/tripImages/";

                const uniqueSuffix = Math.round(Math.random() * 1e9);
                let extension = File_Extension;
                let filename = uniqueSuffix + extension;

                imageName = filename;
                imagePath = `http://${IPAddress}:${port}${ImagePath}`;
                let filePath = `./${ImagePath}${filename}`;

                let newImage = {
                  imageName: filename,
                  imagePath: `http://${IPAddress}:${port}${ImagePath}`,
                };

                fs.writeFileSync(filePath, decodedContents);

                // fileUpload = newImage;

                tripData.editViewModelArrayList[i].fileUpload = newImage;
              }
            }

            if (editViewModelArrayList[i].editType === "LOCATION") {
              console.log("location called");
              tripData.editViewModelArrayList[i].Day =
                editViewModelArrayList[i].Day;
              tripData.editViewModelArrayList[i].Index =
                editViewModelArrayList[i].Index;
              tripData.editViewModelArrayList[i].editType =
                editViewModelArrayList[i].editType;
              tripData.editViewModelArrayList[i].Location =
                editViewModelArrayList[i].Location;
            }
          }
        }

        await tripData.save();

        return res.status(200).send({
          status: true,
          message: "Trip data updated successfully",
          tripData: tripData,
          isSessionExpired: false,
        });
      } else {
        return res.status(200).send({
          status: true,
          message: "Unauthorized",
          isSessionExpired: false,
        });
      }
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

// DELETE USER TRIP DATA
const deleteUserTripData = async (req, res) => {
  try {
    let { userId, sessionToken, accountType, tripId } = req.params;

    let user = await userModel.findOne({ userId: userId, isDeleted: false });

    if (!user) {
      return res.status(404).send({ status: false, message: "user not found" });
    }

    if (user.sessionToken === sessionToken) {
      if (user.accountType === "TRAVELING" && accountType === "TRAVELING") {
        let tripData = await tripModel.findOne({ _id: tripId, userId: userId });

        if (!tripData) {
          return res
            .status(400)
            .send({ status: true, message: "Trip data not found" });
        }

        /* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
        // GET CURRENT IP ADDRESS
        // let networkInterfaces = os.networkInterfaces();
        // // Filter and find the IPv4 address (assuming you want IPv4)
        // let ipAddress = Object.values(networkInterfaces)
        //   .flat()
        //   .filter((iface) => iface.family === "IPv4" && !iface.internal)
        //   .map((iface) => iface.address)[0];
        /* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */

        let coverImageName = tripData.CoverImage.imageName;
        // Construct the full path to the image file
        const tripImagesFolderPath = path.join(
          __dirname,
          "..",
          "..",
          "tripImages"
        );

        // console.log('tripimagefolderpath', tripImagesFolderPath);
        let coverImagePathToDelete = path.join(
          tripImagesFolderPath,
          coverImageName
        );

        if (fs.existsSync(coverImagePathToDelete)) {
          // Delete the file
          fs.unlinkSync(coverImagePathToDelete);
          console.log(`Deleted ${coverImageName}`);
        } else {
          console.log(`File ${coverImageName} does not exist.`);
        }

        // Delete EditViewModelArrayList images from Local system
        for (let i = 0; i < tripData.editViewModelArrayList.length; i++) {
          if (tripData.editViewModelArrayList[i].editType === "IMAGE") {
            // Code to Delete Image from local system
            // let ImagePath = "/tripImages/";
            let imageNameToDelete =
              tripData.editViewModelArrayList[i].fileUpload.imageName;

            // Construct the full path to the image file
            // let tripImagesFolderPath = path.join(
            //   __dirname,
            //   "..",
            //   "..",
            //   "tripImages"
            // );

            // console.log('tripimagefolderpath', tripImagesFolderPath);
            const filePathToDelete = path.join(
              tripImagesFolderPath,
              imageNameToDelete
            );

            // Check if the file exists before attempting to delete it
            if (fs.existsSync(filePathToDelete)) {
              // Delete the file
              fs.unlinkSync(filePathToDelete);
              console.log(`Deleted ${imageNameToDelete}`);
            } else {
              console.log(`File ${imageNameToDelete} does not exist.`);
            }
          }
        }

        /* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */

        await tripModel.deleteOne({
          _id: tripId,
          userId: userId,
        });

        return res.status(200).send({
          status: true,
          isSessionExpired: false,
          message: "trip data deleted successfully",
        });

        /* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
      } else {
        return res.status(200).send({
          status: true,
          message: "Unauthorized",
          isSessionExpired: false,
        });
      }
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

module.exports = {
  addUserTravelDetails,
  getUserAllTrips,
  updateUserTripData,
  deleteUserTripData,
};
