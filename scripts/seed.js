const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/regista-agency';

// Define schemas inline for the seed script
const ClientSchema = new mongoose.Schema({
  name: String,
  createdAt: { type: Date, default: Date.now },
});

const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  role: String,
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
  createdAt: { type: Date, default: Date.now },
});

const AutomationSchema = new mongoose.Schema({
  name: String,
  description: String,
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
  templateId: { type: mongoose.Schema.Types.ObjectId, ref: 'AutomationTemplate' },
  status: String,
  settings: { type: mongoose.Schema.Types.Mixed, default: {} },
  createdAt: { type: Date, default: Date.now },
});

const AutomationTemplateSchema = new mongoose.Schema({
  name: String,
  description: String,
  category: String,
  icon: String,
  defaultSettings: { type: mongoose.Schema.Types.Mixed, default: {} },
  settingsSchema: { type: mongoose.Schema.Types.Mixed, default: {} },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

const MetricSchema = new mongoose.Schema({
  automationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Automation' },
  date: Date,
  emailsSent: Number,
  conversions: Number,
  revenue: Number,
});

const Client = mongoose.models.Client || mongoose.model('Client', ClientSchema);
const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Automation = mongoose.models.Automation || mongoose.model('Automation', AutomationSchema);
const AutomationTemplate = mongoose.models.AutomationTemplate || mongoose.model('AutomationTemplate', AutomationTemplateSchema);
const Metric = mongoose.models.Metric || mongoose.model('Metric', MetricSchema);

async function seed() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await User.deleteMany({});
    await Client.deleteMany({});
    await Automation.deleteMany({});
    await AutomationTemplate.deleteMany({});
    await Metric.deleteMany({});

    // Create automation templates for marketplace
    console.log('📦 Creating automation templates...');
    const templates = await AutomationTemplate.insertMany([
      {
        name: 'Relance Devis Curatif',
        description: 'Relance automatique des devis de petite réparation non suivis. Récupérez 20% de CA SAV.',
        category: 'email',
        icon: 'mail',
        defaultSettings: {
          emailSubject: 'Relance de votre devis',
          emailBody: 'Bonjour,\n\nNous revenons vers vous concernant votre devis. N\'hésitez pas à nous contacter pour toute question.\n\nCordialement,',
          delayDays: 7,
          senderName: 'Équipe Commerciale',
          maxAttempts: 3,
        },
        active: true,
      },
      {
        name: 'Facturation Post-Intervention',
        description: 'Génération automatique de facture après clôture d\'intervention. Libérez 150k€ de trésorerie.',
        category: 'facturation',
        icon: 'file-text',
        defaultSettings: {
          autoGenerate: true,
          delayHours: 2,
          sendEmail: true,
          emailSubject: 'Votre facture est disponible',
        },
        active: true,
      },
      {
        name: 'Rappel Maintenance Annuelle',
        description: 'Envoi automatique de rappel de maintenance préventive 30 jours avant échéance.',
        category: 'maintenance',
        icon: 'wrench',
        defaultSettings: {
          emailSubject: 'Rappel de maintenance',
          emailBody: 'Bonjour,\n\nVotre contrat de maintenance arrive à échéance. Nous vous proposons de planifier votre intervention.\n\nCordialement,',
          delayDays: 30,
          senderName: 'Service Maintenance',
        },
        active: true,
      },
      {
        name: 'Lead Chauffage Collectif',
        description: 'Qualification automatique des leads provenant du site web. Taux de conversion +35%.',
        category: 'leads',
        icon: 'users',
        defaultSettings: {
          autoAssign: true,
          scoringEnabled: true,
          minScore: 50,
          notifyEmail: true,
        },
        active: true,
      },
      {
        name: 'Suivi Satisfaction Client',
        description: 'Envoi automatique de questionnaire de satisfaction 7 jours après intervention.',
        category: 'crm',
        icon: 'star',
        defaultSettings: {
          emailSubject: 'Votre avis nous intéresse',
          emailBody: 'Bonjour,\n\nNous espérons que notre intervention vous a donné satisfaction. Pouvez-vous prendre 2 minutes pour nous donner votre avis?\n\nMerci,',
          delayDays: 7,
        },
        active: true,
      },
    ]);

    // Create clients
    console.log('👥 Creating clients...');
    const client1 = await Client.create({
      name: 'CVC Solutions Pro',
    });

    const client2 = await Client.create({
      name: 'Thermique Industrie',
    });

    // Create users
    console.log('🔐 Creating users...');
    const hashedPassword = await bcrypt.hash('password123', 10);

    await User.create({
      email: 'client1@example.com',
      password: hashedPassword,
      role: 'client',
      clientId: client1._id,
    });

    await User.create({
      email: 'client2@example.com',
      password: hashedPassword,
      role: 'client',
      clientId: client2._id,
    });

    await User.create({
      email: 'admin@regista-agency.fr',
      password: hashedPassword,
      role: 'admin',
    });

    // Create automations for client 1
    console.log('⚙️  Creating automations...');
    const automation1 = await Automation.create({
      name: 'Relance Devis Curatif',
      description:
        'Relance automatique des devis de petite réparation (fuite, vanne, etc.) non suivis. Permet de récupérer 20% de CA SAV.',
      clientId: client1._id,
      templateId: templates[0]._id,
      status: 'active',
      settings: templates[0].defaultSettings,
    });

    const automation2 = await Automation.create({
      name: 'Facturation Post-Intervention',
      description:
        'Génération automatique de facture après clôture d\'intervention. Libère 150k€ de trésorerie en accélérant le DSO.',
      clientId: client1._id,
      templateId: templates[1]._id,
      status: 'active',
      settings: templates[1].defaultSettings,
    });

    const automation3 = await Automation.create({
      name: 'Rappel Maintenance Annuelle',
      description:
        'Envoi automatique de rappel de maintenance préventive 30 jours avant échéance. Réduit les pannes et fidélise.',
      clientId: client1._id,
      templateId: templates[2]._id,
      status: 'inactive',
      settings: templates[2].defaultSettings,
    });

    // Create automations for client 2
    const automation4 = await Automation.create({
      name: 'Lead Chauffage Collectif',
      description:
        'Qualification automatique des leads provenant du site web pour chauffage collectif. Taux de conversion +35%.',
      clientId: client2._id,
      templateId: templates[3]._id,
      status: 'active',
      settings: templates[3].defaultSettings,
    });

    const automation5 = await Automation.create({
      name: 'Suivi Satisfaction Client',
      description:
        'Envoi automatique de questionnaire de satisfaction 7 jours après intervention. Améliore NPS et collecte témoignages.',
      clientId: client2._id,
      templateId: templates[4]._id,
      status: 'active',
      settings: templates[4].defaultSettings,
    });

    // Generate metrics for last 30 days
    console.log('📊 Generating metrics...');
    const automations = [automation1, automation2, automation3, automation4, automation5];
    const today = new Date();

    for (const automation of automations) {
      for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);

        // Generate realistic data based on automation type
        let emailsSent, conversions, revenue;

        if (automation.status === 'active') {
          // Random but realistic numbers
          emailsSent = Math.floor(Math.random() * 50) + 20; // 20-70 emails
          conversions = Math.floor(emailsSent * (Math.random() * 0.15 + 0.05)); // 5-20% conversion
          revenue = conversions * (Math.random() * 800 + 200); // 200-1000€ per conversion
        } else {
          // Inactive automation
          emailsSent = 0;
          conversions = 0;
          revenue = 0;
        }

        await Metric.create({
          automationId: automation._id,
          date,
          emailsSent,
          conversions,
          revenue: Math.round(revenue),
        });
      }
    }

    console.log('✨ Seed completed successfully!');
    console.log('\n📝 Test credentials:');
    console.log('Client 1: client1@example.com / password123');
    console.log('Client 2: client2@example.com / password123');
    console.log('Admin: admin@regista-agency.fr / password123');
    console.log('\n🎯 Automations created:', automations.length);
    console.log('📦 Templates created:', templates.length);
    console.log('📊 Metrics generated: 30 days x', automations.length, '=', automations.length * 30, 'entries');

    await mongoose.connection.close();
    console.log('\n👋 Database connection closed');
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
}

seed();
