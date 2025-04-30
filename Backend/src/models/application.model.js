import mongoose from 'mongoose';

const { Schema } = mongoose;

const applicationSchema = new Schema(
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
        status: {
            type: String,
            enum: ['Pending', 'Reviewed', 'Accepted', 'Rejected'],
            default: 'Pending',
            trim: true,
            lowercase: true
        },
        remarks: {
            type: String,
            trim: true
        },
        appliedAt: {
            type: Date,
            default: Date.now
        },
        reviewedAt: {
            type: Date
        }
    },
    { timestamps: true }
);

export const Application = mongoose.model('Application', applicationSchema);