import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Automation from '@/lib/models/Automation';
import AutomationTemplate from '@/lib/models/AutomationTemplate';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { templateId } = await request.json();

    if (!templateId) {
      return NextResponse.json(
        { error: 'Template ID requis' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Get template
    const template = await AutomationTemplate.findById(templateId);
    if (!template) {
      return NextResponse.json(
        { error: 'Template non trouvé' },
        { status: 404 }
      );
    }

    // Check if already added
    const existing = await Automation.findOne({
      clientId: session.user.clientId,
      templateId: template._id,
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Automatisation déjà ajoutée' },
        { status: 400 }
      );
    }

    // Create automation from template
    const automation = await Automation.create({
      name: template.name,
      description: template.description,
      clientId: session.user.clientId,
      templateId: template._id,
      status: 'inactive',
      settings: template.defaultSettings,
    });

    return NextResponse.json({
      message: 'Automatisation ajoutée avec succès',
      automationId: automation._id,
    });
  } catch (error) {
    console.error('Add automation error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}