import mongoose, { Schema, Document } from 'mongoose';

export interface IFocusSession extends Document {
  userId: string;
  durationMinutes: number;
  completedAt: Date;
}

const FocusSessionSchema = new Schema<IFocusSession>({
  userId: {
    type: String,
    required: true,
    index: true
  },
  durationMinutes: {
    type: Number,
    required: true
  },
  completedAt: {
    type: Date,
    default: Date.now
  }
});

FocusSessionSchema.index({ userId: 1, completedAt: -1 });

export const FocusSession = mongoose.model<IFocusSession>('FocusSession', FocusSessionSchema);