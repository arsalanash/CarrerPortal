import { asyncHandler } from '../utils/asynchandler.js';
import { ApiError } from '../utils/apierror.js';
import { Student } from '../models/student.model.js';
import { ApiResponse } from '../utils/apiResponse.js';
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = async (studentId) => {
    try {
        const student = await Student.findById(studentId);
        if (!student) {
            throw new ApiError(404, "Student not found");
        }

        const accessToken = student.generateAccessToken();
        const refreshToken = student.generateRefreshToken();

        student.refreshToken = refreshToken;
        await student.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, `Error generating tokens: ${error.message}`);
    }
};

const registerStudent = asyncHandler(async (req, res) => {
    const { fullName, email, password, gpa, department } = req.body;

    if ([fullName, email, password, gpa].some(field => !field?.toString().trim())) {
        throw new ApiError(400, "All fields are compulsory");
    }

    const existedStudent = await Student.findOne({ email });
    if (existedStudent) {
        throw new ApiError(409, "Student already exists");
    }

    const student = await Student.create({
        fullName,
        email,
        password,
        gpa,
        department
    });

    const createdStudent = await Student.findById(student._id).select("-password -refreshToken");

    if (!createdStudent) {
        throw new ApiError(500, "Student registration failed");
    }

    return res.status(201).json(new ApiResponse(201, createdStudent, "Student registered successfully"));
});

const loginStudent = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email?.trim()) {
        throw new ApiError(400, "Email is required");
    }

    const studentDetail = await Student.findOne({ email });
    if (!studentDetail) {
        throw new ApiError(404, "Student does not exist");
    }

    const isPasswordValid = await studentDetail.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid credentials");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(studentDetail._id);

    const options = {
        httpOnly: true,
        secure: true
    };

    const loggedinStudent = await Student.findById(studentDetail._id).select("-password -refreshToken");
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, { student: loggedinStudent, accessToken, refreshToken }, "Student logged in successfully"));
});

const logoutStudent = asyncHandler(async (req, res) => {
    await Student.findByIdAndUpdate(req.student._id, { $unset: { refreshToken: 1 } }, { new: true });
    const options = {
        httpOnly: true,
        secure: true
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "Student logged out"));
});

const refreshStudentAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request");
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
        const student = await Student.findById(decodedToken?._id);
        if (!student) {
            throw new ApiError(401, "Invalid refresh token");
        }

        const studentRefreshToken = student?.refreshToken;
        if (studentRefreshToken !== incomingRefreshToken) {
            throw new ApiError(401, "Refresh token is expired or used");
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(student._id);
        const options = {
            httpOnly: true,
            secure: true
        };

        return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(new ApiResponse(200, { accessToken, refreshToken }, "Access token refreshed"));
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token");
    }
});

const changeStudentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const student = await Student.findById(req.student._id);
    const isPasswordValid = await student.isPasswordCorrect(oldPassword);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid credentials");
    }
    student.password = newPassword;
    await student.save({ validateBeforeSave: false });

    return res.status(200).json(new ApiResponse(200, [], "Password changed successfully"));
});

const getCurrentStudent = asyncHandler(async (req, res) => {
    if (!req.student) {
        throw new ApiError(404, "Student does not exist");
    }
    return res.status(200).json(new ApiResponse(200, req.student, "Current student fetched successfully"));
});

const updateStudentAccountDetails = asyncHandler(async (req, res) => {
    const { fullName, email } = req.body;
    if (!fullName || !email) {
        throw new ApiError(400, "All fields are required");
    }

    const student = await Student.findByIdAndUpdate(
        req.student._id,
        { $set: { fullName, email } },
        { new: true }
    ).select("-password");

    return res.status(200).json(new ApiResponse(200, student, "Account details updated successfully"));
});

export {
    registerStudent,
    loginStudent,
    logoutStudent,
    refreshStudentAccessToken,
    changeStudentPassword,
    getCurrentStudent,
    updateStudentAccountDetails
};
