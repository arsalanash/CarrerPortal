import { asyncHandler } from '../utils/asynchandler.js';
import { ApiError } from '../utils/apierror.js';
import { Admin } from '../models/admin.model.js';
import { ApiResponse } from '../utils/apiResponse.js';
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = async (adminId) => {
    try {
        const admin = await Admin.findById(adminId);
        if (!admin) {
            throw new ApiError(404, "Admin not found");
        }

        const accessToken = admin.generateAccessToken();
        const refreshToken = admin.generateRefreshToken();

        admin.refreshToken = refreshToken;
        await admin.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, `Error generating tokens: ${error.message}`);
    }
};

const registerAdmin = asyncHandler(async (req, res) => {
    const { name, email, password, contactNumber } = req.body;

    if ([name, email, password].some(field => !field?.trim())) {
        throw new ApiError(400, "All fields are compulsory");
    }

    const existedAdmin = await Admin.findOne({ email });
    if (existedAdmin) {
        throw new ApiError(409, "Admin already exists");
    }

    const admin = await Admin.create({
        name,
        email,
        password,
        contactNumber
    });

    const createdAdmin = await Admin.findById(admin._id).select("-password -refreshToken");

    if (!createdAdmin) {
        throw new ApiError(500, "Admin registration failed");
    }

    return res.status(201).json(new ApiResponse(201, createdAdmin, "Admin registered successfully"));
});

const loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email?.trim()) {
        throw new ApiError(400, "Email is required");
    }

    const adminDetail = await Admin.findOne({ email });
    if (!adminDetail) {
        throw new ApiError(404, "Admin does not exist");
    }

    const isPasswordValid = await adminDetail.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid credentials");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(adminDetail._id);

    const options = {
        httpOnly: true,
        secure: true
    };

    const loggedinAdmin = await Admin.findById(adminDetail._id).select("-password -refreshToken");
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, { admin: loggedinAdmin, accessToken, refreshToken }, "Admin logged in successfully"));
});

const logoutAdmin = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        throw new ApiError(400, "Refresh token is required");
    }

    try {
        // Verify and decode the refresh token
        const decodedToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        // Extract the admin ID (_id) from the decoded token
        const adminId = decodedToken._id;

        if (!adminId) {
            throw new ApiError(401, "Invalid refresh token");
        }

        // Unset the refreshToken in the database
        await Admin.findByIdAndUpdate(adminId, { $unset: { refreshToken: 1 } }, { new: true });

        const options = {
            httpOnly: true,
            secure: true,
        };

        // Clear cookies and send a success response
        return res
            .status(200)
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .json(new ApiResponse(200, {}, "Admin logged out"));
    } catch (error) {
        throw new ApiError(401, error.message || "Invalid refresh token");
    }
});

const refreshAdminAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request");
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
        const admin = await Admin.findById(decodedToken?._id);
        if (!admin) {
            throw new ApiError(401, "Invalid refresh token");
        }

        const adminRefreshToken = admin?.refreshToken;
        if (adminRefreshToken !== incomingRefreshToken) {
            throw new ApiError(401, "Refresh token is expired or used");
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(admin._id);
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

const changeAdminPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const admin = await Admin.findById(req.admin._id);
    const isPasswordValid = await admin.isPasswordCorrect(oldPassword);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid credentials");
    }
    admin.password = newPassword;
    await admin.save({ validateBeforeSave: false });

    return res.status(200).json(new ApiResponse(200, [], "Password changed successfully"));
});

const getCurrentAdmin = asyncHandler(async (req, res) => {
    if (!req.admin) {
        throw new ApiError(404, "Admin does not exist");
    }
    return res.status(200).json(new ApiResponse(200, req.admin, "Current admin fetched successfully"));
});

const updateAdminAccountDetails = asyncHandler(async (req, res) => {
    const { name, email, contactNumber } = req.body;
    if (!name || !email) {
        throw new ApiError(400, "Name and email are required");
    }

    const admin = await Admin.findByIdAndUpdate(
        req.admin._id,
        { $set: { name, email, contactNumber } },
        { new: true }
    ).select("-password");

    return res.status(200).json(new ApiResponse(200, admin, "Account details updated successfully"));
});

export {
    registerAdmin,
    loginAdmin,
    logoutAdmin,
    refreshAdminAccessToken,
    changeAdminPassword,
    getCurrentAdmin,
    updateAdminAccountDetails,
};
