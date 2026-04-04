import { auth } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { AutomationSettingsClient } from '@/components/AutomationSettingsClient';

export default async function AutomationSettingsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  
  if (!session) {
    redirect('/login');
  }

  const automation = await prisma.automation.findUnique({
    where: { id },
  });

  if (!automation) {
    notFound();
  }

  // Check authorization
  if (
    session.user.role !== 'admin' &&
    automation.clientId !== session.user.clientId
  ) {
    notFound();
  }

  const automationData = {
    _id: automation.id,
    name: automation.name,
    description: automation.description,
    settings: automation.settings || {},
  };

  return <AutomationSettingsClient automationId={id} automation={automationData} />;
}