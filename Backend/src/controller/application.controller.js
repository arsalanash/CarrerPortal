import { asyncHandler } from '../utils/asynchandler.js';
import { ApiError } from '../utils/apierror.js';
import { Application } from '../models/application.model.js';
import { ApiResponse } from '../utils/apiResponse.js';

/**
 * Create a new application.
 * Expects student and company IDs in req.body.
 */
const createApplication = asyncHandler(async (req, res) => {
    const { studentId, companyId, remarks } = req.body;
    if (!studentId || !companyId) {
        throw new ApiError(400, "Student and Company are required");
    }

    // Optional: Check if an application already exists for this student & company
    const existing = await Application.findOne({ student: studentId, company: companyId });
    if (existing) {
        throw new ApiError(409, "Application already exists");
    }

    const application = await Application.create({
        student: studentId,
        company: companyId,
        remarks
    });

    return res
        .status(201)
        .json(new ApiResponse(201, application, "Application created successfully"));
});

/**
 * Update the status of an application.
 * Expects applicationId as a URL parameter and new status in req.body.
 */
const updateApplicationStatus = asyncHandler(async (req, res) => {
    const { applicationId } = req.params;
    const { status } = req.body;
    if (!status) {
        throw new ApiError(400, "Status is required");
    }

    const application = await Application.findByIdAndUpdate(
        applicationId,
        { status, reviewedAt: new Date() },
        { new: true }
    );

    if (!application) {
        throw new ApiError(404, "Application not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, application, "Application status updated successfully"));
});

/**
 * Get all applications for the currently logged-in student.
 * Assumes authentication middleware sets req.student.
 */
const getApplicationsByStudent = asyncHandler(async (req, res) => {
    const studentId = req.student._id;
    const applications = await Application.find({ student: studentId })
        .populate('company', 'name visitDate')
        .sort({ createdAt: -1 });

    return res
        .status(200)
        .json(new ApiResponse(200, applications, "Applications fetched successfully"));
});

/**
 * Get all applications for a given company.
 * Expects companyId as a URL parameter.
 */
const getApplicationsByCompany = asyncHandler(async (req, res) => {
    const { companyId } = req.params;
    const applications = await Application.find({ company: companyId })
        .populate('student', 'fullName email')
        .sort({ createdAt: -1 });

    return res
        .status(200)
        .json(new ApiResponse(200, applications, "Applications fetched successfully"));
});

export {
    createApplication,
    updateApplicationStatus,
    getApplicationsByStudent,
    getApplicationsByCompany,
};
