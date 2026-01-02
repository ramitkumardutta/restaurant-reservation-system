const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true 
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    phone: {
        type: String,
        required: true 
    },
    password: {
        type: String,
        required: true 
    },
    role: {
        type: String,
        enum: ["admin", "manager", "staff", "delivery", "customer"],
        default: "customer"
    },
    status: {
        type: String,
        enum: ["available", "busy"],
        default: "available"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

userSchema.pre("save", async function () {
    // Only hash if password is new or modified
    if (!this.isModified("password")) return;

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (err) {
        throw err;
    }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};


const User = mongoose.model("User", userSchema);
module.exports = User;