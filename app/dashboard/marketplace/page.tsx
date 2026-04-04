import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { MarketplaceCard } from '@/components/MarketplaceCard';
import { ShoppingBag } from 'lucide-react';

export default async function MarketplacePage() {
  const session = await auth();
  
  if (!session) {
    redirect('/login');
  }

  // Get all active templates
  const templates = await prisma.automationTemplate.findMany({
    where: { active: true },
    orderBy: [
      { category: 'asc' },
      { name: 'asc' },
    ],
  });

  // Get user's automations to check which are already added
  const userAutomations = await prisma.automation.findMany({
    where: { clientId: session.user.clientId! },
    select: { templateId: true },
  });

  const userTemplateIds = new Set(
    userAutomations
      .filter(a => a.templateId)
      .map(a => a.templateId!)
  );

  const templatesData = templates.map(t => ({
    _id: t.id,
    name: t.name,
    description: t.description,
    category: t.category,
    icon: t.icon,
    isAdded: userTemplateIds.has(t.id),
  }));

  // Group by category
  const categories = {
    email: templatesData.filter(t => t.category === 'email'),
    facturation: templatesData.filter(t => t.category === 'facturation'),
    crm: templatesData.filter(t => t.category === 'crm'),
    maintenance: templatesData.filter(t => t.category === 'maintenance'),
    leads: templatesData.filter(t => t.category === 'leads'),
  };

  const categoryNames: Record<string, string> = {
    email: 'Email & Communication',
    facturation: 'Facturation',
    crm: 'CRM & Relation Client',
    maintenance: 'Maintenance',
    leads: 'Génération de Leads',
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <ShoppingBag className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Marketplace</h1>
        </div>
        <p className="text-muted-foreground">
          Découvrez et ajoutez de nouvelles automatisations à votre compte
        </p>
      </div>

      {Object.entries(categories).map(([key, items]) => {
        if (items.length === 0) return null;
        
        return (
          <div key={key} className="mb-8">
            <h2 className="text-xl font-semibold mb-4">{categoryNames[key]}</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {items.map((template) => (
                <MarketplaceCard
                  key={template._id}
                  template={template}
                />
              ))}
            </div>
          </div>
        );
      })}

      {templatesData.length === 0 && (
        <div className="text-center py-12">
          <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">Aucune automatisation disponible</h3>
          <p className="text-muted-foreground mt-2">
            Revenez plus tard pour découvrir de nouvelles automatisations
          </p>
        </div>
      )}
    </div>
  );
}