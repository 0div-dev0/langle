import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        // username: {
        //     type: String,
        //     required: [true, "Please provide a username"],
        //     unique: [true, "Username already taken. Try again."]
        // },
        email: {
            type: String,
            required: [true, "Please provide a email"],
            unique: false
        },
        password: {
            type: String,
            required: [true, "Please provide a password"],
            unique: false
    }, 
    isVerified: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    ForgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
    verifyToken: String,
    verifyTokenExpiry: Date,
    streak: {
        type: Number,
        default: 0
    }
}
)

const User = mongoose.models.users || mongoose.model("users", userSchema)
export default User