import { asyncHandler } from '../utils/asynchandler.js';
import { ApiError } from '../utils/apierror.js';
import { EligibilityCriteria } from '../models/eligibilitycriteria.model.js';
import { Student } from '../models/student.model.js';
import { Offer } from '../models/offer.model.js';
import { ApiResponse } from '../utils/apiResponse.js';

/**
 * Check if a student meets the eligibility criteria for a company and, if eligible,
 * create an offer.
 * 
 * Expected req.body:
 *   - studentId: the student's ObjectId
 *   - companyId: the company's ObjectId
 *   - offeredPackage: the package being offered
 */
const checkEligibilityAndCreateOffer = asyncHandler(async (req, res) => {
    const { studentId, companyId, offeredPackage } = req.body;
    
    if (!studentId || !companyId || !offeredPackage) {
        throw new ApiError(400, "Student ID, Company ID, and Offered Package are required");
    }
    
    // Retrieve eligibility criteria for the company
    const criteria = await EligibilityCriteria.findOne({ company: companyId });
    if (!criteria) {
        throw new ApiError(404, "Eligibility criteria not found for the company");
    }
    
    // Retrieve the student details
    const student = await Student.findById(studentId);
    if (!student) {
        throw new ApiError(404, "Student not found");
    }
    
    // Validate GPA against criteria
    if (student.gpa < criteria.minGpa) {
        throw new ApiError(400, "Student's GPA does not meet the minimum requirement");
    }
    
    // Validate department if restrictions are specified
    if (criteria.departmentRestrictions && criteria.departmentRestrictions.length > 0) {
        if (!criteria.departmentRestrictions.includes(student.department)) {
            throw new ApiError(400, "Student's department is not eligible for this company");
        }
    }
    
    // Check if the student is already placed
    if (student.placementCount > 0) {
        // Enforce that the new offered package must be at least 33% higher than currentPackage
        if (offeredPackage < student.currentPackage * 1.33) {
            throw new ApiError(400, "Offered package must be at least 33% higher than the current package");
        }
    }
    
    // Ensure the student has not exceeded the maximum placements (e.g., 3 placements)
    if (student.placementCount >= 3) {
        throw new ApiError(400, "Student has reached the maximum number of placements");
    }
    
    // If eligibility is confirmed, create the offer
    const offer = await Offer.create({
        student: studentId,
        company: companyId,
        offeredPackage,
        offerDate: new Date()
    });
    
    return res
        .status(201)
        .json(new ApiResponse(201, offer, "Offer created successfully"));
});

export { checkEligibilityAndCreateOffer };
