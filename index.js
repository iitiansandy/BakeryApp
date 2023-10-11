const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const app = express();
const path = require("path");
const socket_io = require("socket.io");

const { mongoDbUrl, port } = require("./src/middlewares/config");
const cors = require("cors");

const route = require("./src/routes/routes");
const datingRoutes = require("./src/routes/datingRoutes");
const BFFRoutes = require("./src/routes/BFFRoutes");
const businessRoutes = require("./src/routes/businessRoutes");
const travelRoutes = require("./src/routes/travelRoutes");
const travelPartnerRoutes = require("./src/routes/travelPartnerRoutes");
const chatRoutes = require("./src/routes/chatRoutes");
const messageRoutes = require("./src/routes/messageRoutes");
const { saveMessage } = require("./src/controllers/messageController");
// const { getMessagesByUserId } = require('./src/controllers/messageController');
const userModel = require("./src/models/userModel");
const { getChatListOfUser } = require("./src/controllers/likeController");
const { getAllUserChatHistory } = require("./src/controllers/allUsersChatHistoryController");
const messageModel = require("./src/models/messageModel");
const allUsersChatHistoryModel = require("./src/models/allUsersChatHistoryModel");

app.use(express.json({ limit: "500mb" }));
app.use(express.urlencoded({ extended: true }, { limit: "500mb" }));
app.use(bodyParser.json({ limit: "500mb" }));
app.use(fileUpload());
app.use(cors());

//
app.use("/uploads", express.static(__dirname + "/src/controllers/uploads"));

app.use("/uploads", express.static(__dirname + "/uploads"));

app.use("/tripImages", express.static(__dirname + "/tripImages"));

// console.log(__dirname);

mongoose
    .connect(mongoDbUrl, { useNewUrlParser: true })
    .then(() => console.log("Database Connected"))
    .catch((err) => console.log(err));

app.use("/", route);
app.use("/", datingRoutes);
app.use("/", BFFRoutes);
app.use("/", businessRoutes);
app.use("/", travelRoutes);
app.use("/", travelPartnerRoutes);
app.use("/", chatRoutes);
app.use("/", messageRoutes);

app.get("/", (req, res) => {
    res.send("<h1>Citas APIs is Ready</h1>");
});

const server = app.listen(5001, () => console.log("Server is running on port", 5001));

var io = socket_io(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

let connectedUser = {};
let connectedUserSocketID = {};
io.on("connection", (socket) => {
    console.log("socket is ready for connection");
    socket.on("newJoinUser", async (payload) => {
        console.log("New User Join =========>>>>>>>>>>>>>");
        let { userId, sessionToken, accountType } = payload;
        let user = await userModel.findOne({ userId: userId });

        if (!user) {
            io.emit("userList", {
                status: false,
                message: "Unauthorize user",
                isSessionExpired: true,
            });
        }

        if (user.sessionToken === sessionToken && user.accountType === accountType) {
            if (!connectedUser.hasOwnProperty(userId)) {
                connectedUser[userId] = {
                    userId: userId,
                    sessionToken: sessionToken,
                    accountType: accountType,
                    socketId: socket.id,
                };
            }
            if (!connectedUserSocketID.hasOwnProperty(socket.id)) {
                connectedUserSocketID[socket.id] = userId;
            }

            console.log("connectedUsers Object =============>>>>>> ", connectedUser);

            let userChatList = await allUsersChatHistoryModel
                .find({
                    $or: [{ senderUser: userId }, { receiverUser: userId }],
                })
                .populate(["senderUserObjId", "receiverUserObjId"]);
            let messages = await messageModel.find({ $or: [{ senderUser: userId }, { receiverUser: userId }] }).sort({ createdAt: -1 });
            let myAllUserLastMessage = {};
            for (let messageSingleCard of messages) {
                if (messageSingleCard.recipient !== userId) {
                    if (!myAllUserLastMessage.hasOwnProperty(messageSingleCard.recipient)) {
                        myAllUserLastMessage[messageSingleCard.recipient] = messageSingleCard;
                    }
                } else {
                    if (!myAllUserLastMessage.hasOwnProperty(messageSingleCard.sender)) {
                        myAllUserLastMessage[messageSingleCard.sender] = messageSingleCard;
                    }
                }
            }
            let myAllUsersId = {};
            let myAllUserArr = userChatList.flatMap((el) => {
                let userObj = {};
                let findedObj = null;
                let findedUser = null;
                if (el.senderUser !== userId && connectedUser.hasOwnProperty(el.senderUser)) {
                    findedObj = el;
                    findedUser = el.senderUser;
                } else if (el.receiverUser !== userId && connectedUser.hasOwnProperty(el.receiverUser)) {
                    findedObj = el;
                    findedUser = el.receiverUser;
                }
                if (findedObj) {
                    //online user id
                    if (el.senderUser === findedUser) {
                        userObj["RootData"] = el.senderUserObjId;
                        userObj["isOnline"] = true;
                    } else {
                        userObj["RootData"] = el.receiverUserObjId;
                        userObj["isOnline"] = true;
                    }
                } else {
                    // not online user id
                    if (el.senderUser !== userId) {
                        userObj["RootData"] = el.senderUserObjId;
                        userObj["isOnline"] = false;
                    } else if (el.receiverUser !== userId) {
                        userObj["RootData"] = el.receiverUserObjId;
                        userObj["isOnline"] = false;
                    }
                }
                if (userObj.hasOwnProperty("RootData")) {
                    if (!myAllUsersId.hasOwnProperty(userObj.RootData.userId)) {
                        myAllUsersId[userObj.RootData.userId] = userObj.RootData.userId;
                    }
                    if(myAllUserLastMessage.hasOwnProperty(userObj.RootData.userId)){
                        userObj['message'] = myAllUserLastMessage[userObj.RootData.userId];
                    }
                    return userObj;
                } else {
                    return [];
                }
            });

            if (connectedUserSocketID.hasOwnProperty(socket.id)) {
                io.to(socket.id).emit("userList", {
                    status: true,
                    message: "success",
                    isSessionExpired: false,
                    data: myAllUserArr,
                });

                console.log("myAllUserArr", myAllUserArr);
                for (let singleSocket of Object.keys(connectedUserSocketID)) {
                    if (singleSocket !== socket.id) {
                        if (myAllUsersId.hasOwnProperty(connectedUserSocketID[singleSocket])) {
                            io.to(singleSocket).emit("userNotified", {
                                userId: connectedUserSocketID[socket.id],
                                isOnline: true,
                            });
                        }
                    }
                }
            }
        } else {
            io.emit("userList", {
                status: false,
                message: "Unauthorized",
                isSessionExpired: true,
            });
        }
    });

    socket.on("disconnect", async () => {
        console.log("Disconnected");
        console.log("connectedUserSocketID", connectedUserSocketID);
        let userId = connectedUserSocketID[socket.id];
        let userChatList = await allUsersChatHistoryModel
            .find({
                $or: [{ senderUser: userId }, { receiverUser: userId }],
            })
            .populate(["senderUserObjId", "receiverUserObjId"]);
        let myAllUsersId = {};
        let myAllUserArr = userChatList.flatMap((el) => {
            let userObj = {};
            let findedObj = null;
            let findedUser = null;
            if (el.senderUser !== userId && connectedUser.hasOwnProperty(el.senderUser)) {
                findedObj = el;
                findedUser = el.senderUser;
            } else if (el.receiverUser !== userId && connectedUser.hasOwnProperty(el.receiverUser)) {
                findedObj = el;
                findedUser = el.receiverUser;
            }
            if (findedObj) {
                //online user id
                if (el.senderUser === findedUser) {
                    userObj["RootData"] = el.senderUserObjId;
                    userObj["isOnline"] = true;
                } else {
                    userObj["RootData"] = el.receiverUserObjId;
                    userObj["isOnline"] = true;
                }
            } else {
                // not online user id
                if (el.senderUser !== userId) {
                    userObj["RootData"] = el.senderUserObjId;
                    userObj["isOnline"] = false;
                } else if (el.receiverUser !== userId) {
                    userObj["RootData"] = el.receiverUserObjId;
                    userObj["isOnline"] = false;
                }
            }
            if (userObj.hasOwnProperty("RootData")) {
                if (!myAllUsersId.hasOwnProperty(userObj.RootData.userId)) {
                    myAllUsersId[userObj.RootData.userId] = userObj.RootData.userId;
                }
                return userObj;
            } else {
                return [];
            }
        });
        if (connectedUserSocketID.hasOwnProperty(socket.id)) {
            let userId = connectedUserSocketID[socket.id];
            for (let singleSocket of Object.keys(connectedUserSocketID)) {
                if (singleSocket !== socket.id) {
                    if (myAllUsersId.hasOwnProperty(connectedUserSocketID[singleSocket])) {
                        io.to(singleSocket).emit("userNotified", {
                            userId: userId,
                            isOnline: false,
                        });
                    }
                }
            }
            delete connectedUser[userId];
            delete connectedUserSocketID[socket.id];
        }
        console.log("connectedUserSocketID", connectedUserSocketID);
    });

    socket.on("sendMessage", (payload) => {
        let { sender, recipient, text } = payload;
        saveMessage(sender, recipient, text);
        getAllUserChatHistory(sender, recipient);
        if(connectedUser.hasOwnProperty(recipient)){
            io.to(connectedUser[recipient].socketId).emit("receiveMessage",payload);
        }
        io.to(socket.id).emit('messageResponse',payload);
    });
});

app.get("/api/v1/getAllOnlineUsers", (req, res) => {
    return res.status(200).send({ status: true, message: "success", data: connectedUser });
});
