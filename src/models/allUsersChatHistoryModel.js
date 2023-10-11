const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const allUserChatHistorySchema = new mongoose.Schema({
    senderUser: {
        type: String,
    },

    receiverUser: {
        type: String,
    },

    senderUserObjId: {
        type: ObjectId,
        ref:"User",
    },

    receiverUserObjId: {
        type: ObjectId,
        ref:"User",
    },
    
    isDeleted: {
        type: Boolean,
        default: false,
    }
}, {timestamps: true})

module.exports = mongoose.model("AllUsersChatHistory", allUserChatHistorySchema);