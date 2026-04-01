import mongoose, { Schema, Model } from 'mongoose';

interface IAutomation {
  name: string;
  description: string;
  clientId: mongoose.Types.ObjectId;
  templateId?: mongoose.Types.ObjectId;
  status: 'active' | 'inactive';
  settings: any;
  createdAt: Date;
}

const AutomationSchema = new Schema<IAutomation>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  clientId: {
    type: Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
  },
  templateId: {
    type: Schema.Types.ObjectId,
    ref: 'AutomationTemplate',
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
  settings: {
    type: Schema.Types.Mixed,
    default: {},
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Automation: Model<IAutomation> = 
  mongoose.models.Automation || 
  mongoose.model<IAutomation>('Automation', AutomationSchema);

export default Automation;