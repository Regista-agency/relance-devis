'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Plus, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MarketplaceCardProps {
  template: {
    _id: string;
    name: string;
    description: string;
    category: string;
    icon: string;
    isAdded: boolean;
  };
}

export function MarketplaceCard({ template }: MarketplaceCardProps) {
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(template.isAdded);

  const handleAdd = async () => {
    if (isAdded) return;
    
    setIsAdding(true);
    try {
      const response = await fetch('/api/marketplace/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId: template._id }),
      });

      if (response.ok) {
        setIsAdded(true);
        router.refresh();
      } else {
        const data = await response.json();
        alert(data.error || 'Erreur lors de l\'ajout');
      }
    } catch (error) {
      alert('Erreur lors de l\'ajout');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Card className={cn(
      'transition-all hover:shadow-md',
      isAdded && 'border-green-200 bg-green-50/50'
    )}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <Activity className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">{template.name}</CardTitle>
              <span className="text-xs text-muted-foreground capitalize">
                {template.category}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="mb-4">
          {template.description}
        </CardDescription>
        <Button
          onClick={handleAdd}
          disabled={isAdding || isAdded}
          className="w-full"
          variant={isAdded ? 'secondary' : 'default'}
        >
          {isAdded ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Ajoutée
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              {isAdding ? 'Ajout en cours...' : 'Ajouter'}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}