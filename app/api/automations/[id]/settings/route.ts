import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { settings } = await request.json();

    const automation = await prisma.automation.findUnique({
      where: { id },
    });

    if (!automation) {
      return NextResponse.json(
        { error: 'Automatisation non trouvée' },
        { status: 404 }
      );
    }

    // Check authorization
    if (
      session.user.role !== 'admin' &&
      automation.clientId !== session.user.clientId
    ) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    // Update settings
    await prisma.automation.update({
      where: { id },
      data: { settings },
    });

    return NextResponse.json({
      message: 'Paramètres mis à jour avec succès',
    });
  } catch (error) {
    console.error('Update settings error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}