import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const { Schema } = mongoose;

const studentSchema = new Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            index: true,
            validate: {
                validator: function (v) {
                    return /^(ece|cse)\d{5}@iiitkalyani\.ac\.in$/.test(v);
                },
                message: props => `${props.value} is not a valid email format!`
            }
        },
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        gpa: {
            type: Number,
            required: true
        },
        department: {
            type: String,
            trim: true,
            lowercase: true
        },
        placementCount: {
            type: Number,
            default: 0
        },
        currentPackage: {
            type: Number,
            default: 0
        }
    },
    { timestamps: true }
);

// Pre-save hook to hash password if modified
studentSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare entered password with hashed password
studentSchema.methods.isPasswordCorrect = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Method to generate access token for the student
studentSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            fullName: this.fullName,
            role: "student"
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY.trim()
        }
    );
};

// Method to generate refresh token for the student
studentSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            role: "student"
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY.trim()
        }
    );
};

export default mongoose.model('Student', studentSchema);