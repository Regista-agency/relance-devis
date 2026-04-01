import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { SettingsClient } from '@/components/SettingsClient';

export default async function SettingsPage() {
  const session = await auth();
  
  if (!session) {
    redirect('/login');
  }

  const userData = {
    email: session.user.email,
    role: session.user.role,
  };

  return <SettingsClient user={userData} />;
}