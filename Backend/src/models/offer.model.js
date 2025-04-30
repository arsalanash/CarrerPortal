import mongoose from 'mongoose';

const { Schema } = mongoose;

const offerSchema = new Schema(
    {
        student: {
            type: Schema.Types.ObjectId,
            ref: 'Student',
            required: true
        },
        company: {
            type: Schema.Types.ObjectId,
            ref: 'Company',
            required: true
        },
        offeredPackage: {
            type: Number,
            required: true
        },
        offerDate: {
            type: Date
        },
        accepted: {
            type: Boolean,
            default: false
        },
        reviewedAt: {
            type: Date
        }
    },
    { timestamps: true }
);

export const Offer = mongoose.model('Offer', offerSchema);