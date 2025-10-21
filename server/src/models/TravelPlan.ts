import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ICollaborator {
  userId: Types.ObjectId;
  role: 'viewer' | 'editor' | 'admin';
  permissions: string[];
  joinedAt: Date;
}

export interface ICommuteSegment {
  mode: 'walking' | 'subway' | 'bus' | 'taxi' | 'car';
  duration: number;
  distance: number;
  steps?: any[];
}

export interface IActivity {
  _id: Types.ObjectId;
  name: string;
  location: string;
  startTime: Date;
  endTime: Date;
  type: 'food' | 'culture' | 'nature' | 'shopping' | 'entertainment' | 'other';
  notes?: string;
  order: number;
  commuteTo?: ICommuteSegment;
  trackAssignments?: {
    trackId: string;
    userIds: Types.ObjectId[];
  }[];
}

export interface IItineraryDay {
  _id: Types.ObjectId;
  date: Date;
  order: number;
  summary?: string;
  activities: IActivity[];
}

export interface ISuggestion {
  _id: Types.ObjectId;
  activityId?: Types.ObjectId;
  type:
    | 'gap_filler'
    | 'commute_warning'
    | 'optimization'
    | 'meal_suggestion'
    | 'local_insight';
  content: string;
  status: 'pending' | 'applied' | 'dismissed';
  createdAt: Date;
}

export interface ITrack {
  _id: Types.ObjectId;
  name: string;
  icon?: string;
  participantIds: Types.ObjectId[];
  color?: string;
  createdAt: Date;
}

export interface ITravelPlan extends Document {
  title: string;
  destination: string;
  startDate: Date;
  endDate: Date;
  createdBy: Types.ObjectId;
  collaborators: ICollaborator[];
  itinerary: IItineraryDay[];
  suggestions: ISuggestion[];
  tracks: ITrack[];
  brainstormNotes: string;
  brainstormTags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const CollaboratorSchema = new Schema<ICollaborator>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    role: {
      type: String,
      enum: ['viewer', 'editor', 'admin'],
      default: 'editor',
    },
    permissions: [String],
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const CommuteSegmentSchema = new Schema<ICommuteSegment>(
  {
    mode: {
      type: String,
      enum: ['walking', 'subway', 'bus', 'taxi', 'car'],
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    distance: {
      type: Number,
      required: true,
    },
    steps: [Schema.Types.Mixed],
  },
  { _id: false }
);

const ActivitySchema = new Schema<IActivity>({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  type: {
    type: String,
    enum: ['food', 'culture', 'nature', 'shopping', 'entertainment', 'other'],
    required: true,
  },
  notes: String,
  order: {
    type: Number,
    required: true,
  },
  commuteTo: CommuteSegmentSchema,
  trackAssignments: [
    {
      trackId: String,
      userIds: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    },
  ],
});

const ItineraryDaySchema = new Schema<IItineraryDay>({
  date: {
    type: Date,
    required: true,
  },
  order: {
    type: Number,
    required: true,
  },
  summary: String,
  activities: [ActivitySchema],
});

const SuggestionSchema = new Schema<ISuggestion>({
  activityId: {
    type: Schema.Types.ObjectId,
    ref: 'Activity',
  },
  type: {
    type: String,
    enum: [
      'gap_filler',
      'commute_warning',
      'optimization',
      'meal_suggestion',
      'local_insight',
    ],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'applied', 'dismissed'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const TrackSchema = new Schema<ITrack>({
  name: {
    type: String,
    required: true,
  },
  icon: String,
  participantIds: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  color: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const TravelPlanSchema = new Schema<ITravelPlan>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    destination: {
      type: String,
      required: true,
      trim: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    collaborators: [CollaboratorSchema],
    itinerary: [ItineraryDaySchema],
    suggestions: [SuggestionSchema],
    tracks: [TrackSchema],
    brainstormNotes: {
      type: String,
      default: '',
    },
    brainstormTags: [String],
  },
  {
    timestamps: true,
  }
);

TravelPlanSchema.index({ createdBy: 1, createdAt: -1 });
TravelPlanSchema.index({ 'collaborators.userId': 1 });

export default mongoose.model<ITravelPlan>('TravelPlan', TravelPlanSchema);
