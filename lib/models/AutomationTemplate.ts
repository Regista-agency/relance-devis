import mongoose, { Schema, Model } from 'mongoose';

interface IAutomationTemplate {
  name: string;
  description: string;
  category: string;
  icon: string;
  defaultSettings: any;
  settingsSchema: any;
  active: boolean;
  createdAt: Date;
}

const AutomationTemplateSchema = new Schema<IAutomationTemplate>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['email', 'facturation', 'crm', 'maintenance', 'leads'],
  },
  icon: {
    type: String,
    default: 'activity',
  },
  defaultSettings: {
    type: Schema.Types.Mixed,
    default: {},
  },
  settingsSchema: {
    type: Schema.Types.Mixed,
    default: {},
  },
  active: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const AutomationTemplate: Model<IAutomationTemplate> = 
  mongoose.models.AutomationTemplate || 
  mongoose.model<IAutomationTemplate>('AutomationTemplate', AutomationTemplateSchema);

export default AutomationTemplate;