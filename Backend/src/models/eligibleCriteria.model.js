import mongoose from 'mongoose';

const { Schema } = mongoose;

const eligibilityCriteriaSchema = new Schema(
    {
        company: {
            type: Schema.Types.ObjectId,
            ref: 'Company',
            required: true,
            unique: true // Ensures one-to-one relationship; remove if one-to-many is needed
        },
        minGpa: {
            type: Number,
            required: true
        },
        maxBacklogs: {
            type: Number,
            default: 0
        },
        departmentRestrictions: [
            {
                type: String,
                trim: true,
                lowercase: true
            }
        ],
        additionalRequirements: {
            type: String,
            trim: true
        }
    },
    { timestamps: true }
);

export const EligibilityCriteria = mongoose.model('EligibilityCriteria', eligibilityCriteriaSchema);