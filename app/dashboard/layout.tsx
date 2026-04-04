import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { SessionProvider } from 'next-auth/react';
import prisma from '@/lib/prisma';
import { Sidebar } from '@/components/Sidebar';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  const query =
    session.user.role === 'admin'
      ? {}
      : { clientId: session.user.clientId! };

  const automations = await prisma.automation.findMany({
    where: query,
    select: { id: true, name: true, status: true },
    orderBy: { name: 'asc' },
  });

  const automationsData = automations.map((a) => ({
    _id: a.id,
    name: a.name,
    status: a.status,
  }));

  return (
    <SessionProvider session={session}>
      <div className="flex h-screen">
        <Sidebar automations={automationsData} />
        <main className="flex-1 overflow-y-auto bg-background">{children}</main>
      </div>
    </SessionProvider>
  );
}