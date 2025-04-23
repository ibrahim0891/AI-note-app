

import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true
    },
    createAt: {
        type: Date,
        default: Date.now
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        required: false,
    }
}, { virtuals: true });

userSchema.virtual('fullName').get(function () {
    return `${this.firstName} ${this.lastName}`;
});

userSchema.pre("save", function (next) {
    this.email = this.email.toLowerCase();
    this.password = bcrypt.hashSync(this.password, 10);
    next();
});

//exclude password from json response
userSchema.set("toJSON", {
    transform: function (doc, ret, options) {
        delete ret.password;
        return ret;
    },
});

userSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
}


export const User = mongoose.model("User", userSchema);