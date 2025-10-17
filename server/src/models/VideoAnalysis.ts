import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IExtractedLocation {
    name: string;
    timestamp: number;
    duration?: number;
    coordinates?: {
        lat: number;
        lon: number;
    };
}

export interface IVideoAnalysis extends Document {
    planId: Types.ObjectId;
    videoUrl: string;
    extractedLocations: IExtractedLocation[];
    transcript?: string;
    status: 'processing' | 'completed' | 'failed';
    error?: string;
    processedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const VideoAnalysisSchema = new Schema<IVideoAnalysis>(
    {
        planId: {
            type: Schema.Types.ObjectId,
            ref: 'TravelPlan',
            required: true,
        },
        videoUrl: {
            type: String,
            required: true,
        },
        extractedLocations: [
            {
                name: String,
                timestamp: Number,
                duration: Number,
                coordinates: {
                    lat: Number,
                    lon: Number,
                },
            },
        ],
        transcript: String,
        status: {
            type: String,
            enum: ['processing', 'completed', 'failed'],
            default: 'processing',
        },
        error: String,
        processedAt: Date,
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<IVideoAnalysis>('VideoAnalysis', VideoAnalysisSchema);