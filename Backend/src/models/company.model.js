import mongoose from 'mongoose';

const { Schema } = mongoose;

const companySchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            index: true
        },
        description: {
            type: String,
            trim: true
        },
        visitDate: {
            type: Date
        },
        admin: {
            type: Schema.Types.ObjectId,
            ref: 'Admin',
            required: true
        }
    },
    { timestamps: true }
);

export const Company = mongoose.model('Company', companySchema);