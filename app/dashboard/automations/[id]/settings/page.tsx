import { auth } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import dbConnect from '@/lib/db';
import Automation from '@/lib/models/Automation';
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

  await dbConnect();

  const automation = await Automation.findById(id).lean();

  if (!automation) {
    notFound();
  }

  // Check authorization
  if (
    session.user.role !== 'admin' &&
    automation.clientId.toString() !== session.user.clientId
  ) {
    notFound();
  }

  const automationData = {
    _id: automation._id.toString(),
    name: automation.name,
    description: automation.description,
    settings: automation.settings || {},
  };

  return <AutomationSettingsClient automationId={id} automation={automationData} />;
}