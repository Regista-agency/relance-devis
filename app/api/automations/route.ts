import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const query =
      session.user.role === 'admin'
        ? {}
        : { clientId: session.user.clientId! };

    const automations = await prisma.automation.findMany({
      where: query,
      orderBy: { createdAt: 'desc' },
    });

    // Get stats for each automation (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const automationsWithStats = await Promise.all(
      automations.map(async (automation) => {
        const metrics = await prisma.metric.findMany({
          where: {
            automationId: automation.id,
            date: { gte: sevenDaysAgo },
          },
        });

        const emailsSent = metrics.reduce(
          (sum, m) => sum + m.emailsSent,
          0
        );

        return {
          ...automation,
          stats: { emailsSent },
        };
      })
    );

    return NextResponse.json(automationsWithStats);
  } catch (error) {
    console.error('Get automations error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}