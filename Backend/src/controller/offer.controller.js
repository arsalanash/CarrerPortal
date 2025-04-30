import { asyncHandler } from '../utils/asynchandler.js';
import { ApiError } from '../utils/apierror.js';
import { Offer } from '../models/offer.model.js';
import { ApiResponse } from '../utils/apiResponse.js';

/**
 * Create a new offer.
 * Typically, this would be invoked by an admin after evaluating an application.
 * Expects studentId, companyId, and offeredPackage in req.body.
 */
const createOffer = asyncHandler(async (req, res) => {
    const { studentId, companyId, offeredPackage } = req.body;
    if (!studentId || !companyId || !offeredPackage) {
        throw new ApiError(400, "Student, Company, and Offered Package are required");
    }

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

/**
 * Accept an offer.
 * Expects offerId as a URL parameter.
 * Assumes additional business logic (like package increment checks or maximum placements) is handled elsewhere.
 */
const acceptOffer = asyncHandler(async (req, res) => {
    const { offerId } = req.params;
    const offer = await Offer.findById(offerId);
    if (!offer) {
        throw new ApiError(404, "Offer not found");
    }

    // Business rules can be applied here before acceptance.
    offer.accepted = true;
    await offer.save();

    return res
        .status(200)
        .json(new ApiResponse(200, offer, "Offer accepted successfully"));
});

/**
 * Get all offers for the currently logged-in student.
 * Assumes authentication middleware sets req.student.
 */
const getOffersByStudent = asyncHandler(async (req, res) => {
    const studentId = req.student._id;
    const offers = await Offer.find({ student: studentId })
        .populate('company', 'name')
        .sort({ createdAt: -1 });

    return res
        .status(200)
        .json(new ApiResponse(200, offers, "Offers fetched successfully"));
});

export {
    createOffer,
    acceptOffer,
    getOffersByStudent,
};
