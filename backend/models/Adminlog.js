const mongoose = require("mongoose");

const adminLogSchema = new mongoose.Schema(
    {
        action: {
            type: String,
            required: [true, "Action description is required"],
            trim: true,
            maxlength: [500, "Action description cannot exceed 500 characters"],
        },

        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User ID is required"],
            index: true,
        },

        timestamp: {
            type: Date,
            default: Date.now,
            required: true,
            index: true,
        },
    },
    {
        timestamps: false,
    }
);

adminLogSchema.index({ user_id: 1, timestamp: -1 });
adminLogSchema.index({ timestamp: -1 });

module.exports = mongoose.model("AdminLog", adminLogSchema);
