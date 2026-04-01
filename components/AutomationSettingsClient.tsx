'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, Settings as SettingsIcon } from 'lucide-react';

interface AutomationSettingsClientProps {
  automationId: string;
  automation: {
    _id: string;
    name: string;
    description: string;
    settings: any;
  };
}

export function AutomationSettingsClient({ automationId, automation }: AutomationSettingsClientProps) {
  const router = useRouter();
  const [settings, setSettings] = useState(automation.settings || {});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    
    try {
      const response = await fetch(`/api/automations/${automationId}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings }),
      });

      if (response.ok) {
        setMessage('Paramètres sauvegardés avec succès');
        router.refresh();
      } else {
        const data = await response.json();
        setMessage(data.error || 'Erreur lors de la sauvegarde');
      }
    } catch (error) {
      setMessage('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <Link href={`/dashboard/automations/${automationId}`}>
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à l'automatisation
          </Button>
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <SettingsIcon className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Paramètres</h1>
            <p className="text-muted-foreground">{automation.name}</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Configuration de l'automatisation</CardTitle>
            <CardDescription>
              Personnalisez les paramètres de votre automatisation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Email Subject */}
            <div className="space-y-2">
              <Label htmlFor="emailSubject">Sujet de l'email</Label>
              <Input
                id="emailSubject"
                value={settings.emailSubject || ''}
                onChange={(e) => setSettings({ ...settings, emailSubject: e.target.value })}
                placeholder="Relance de votre devis"
              />
            </div>

            {/* Email Body */}
            <div className="space-y-2">
              <Label htmlFor="emailBody">Corps de l'email</Label>
              <textarea
                id="emailBody"
                value={settings.emailBody || ''}
                onChange={(e) => setSettings({ ...settings, emailBody: e.target.value })}
                placeholder="Bonjour, nous revenons vers vous concernant votre devis..."
                className="flex min-h-[150px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>

            {/* Delay */}
            <div className="space-y-2">
              <Label htmlFor="delay">Délai avant relance (jours)</Label>
              <Input
                id="delay"
                type="number"
                min="1"
                value={settings.delayDays || 7}
                onChange={(e) => setSettings({ ...settings, delayDays: parseInt(e.target.value) })}
              />
            </div>

            {/* Sender Name */}
            <div className="space-y-2">
              <Label htmlFor="senderName">Nom de l'expéditeur</Label>
              <Input
                id="senderName"
                value={settings.senderName || ''}
                onChange={(e) => setSettings({ ...settings, senderName: e.target.value })}
                placeholder="Équipe Commerciale"
              />
            </div>

            {/* Max Attempts */}
            <div className="space-y-2">
              <Label htmlFor="maxAttempts">Nombre maximum de relances</Label>
              <Input
                id="maxAttempts"
                type="number"
                min="1"
                max="10"
                value={settings.maxAttempts || 3}
                onChange={(e) => setSettings({ ...settings, maxAttempts: parseInt(e.target.value) })}
              />
            </div>

            {message && (
              <div className={`rounded-md p-3 text-sm ${
                message.includes('succès') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
              }`}>
                {message}
              </div>
            )}

            <Button onClick={handleSave} disabled={saving} className="w-full">
              <Save className="mr-2 h-4 w-4" />
              {saving ? 'Sauvegarde...' : 'Sauvegarder les paramètres'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}