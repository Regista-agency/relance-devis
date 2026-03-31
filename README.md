# Template Lancement - Démos Automatisation (CVC)

Ce repository contient 2 démos orientées terrain pour des entreprises de CVC, chauffage collectif et froid industriel.

Objectif : illustrer des automatisations à ROI immédiat sur la trésorerie et la croissance, avec un angle métier concret pour la direction générale et les opérations.

## 1) Facturation post-intervention (Cashflow)

### Métier ciblé
Chauffage collectif et froid industriel, avec un volume supérieur à 20 interventions par jour.

### ROI factuel modif
150 000 EUR de trésorerie libérée (ordre de grandeur).

### Donnée de départ
Le délai moyen de facturation manuelle (DSO administratif) observé dans une PME de 4,5 M EUR de CA est de 12 jours.

### Calcul de référence
En automatisant la facturation juste après la clôture d'intervention, on peut gagner 11 jours :

((4 500 000 EUR / 365) x 11 jours) = 135 616 EUR

Soit un cash disponible plus tôt sur le compte bancaire, au lieu de rester bloqué en encours.

### Problème avatar (DG)
Le dirigeant paie des agios (8 a 10 %) parce que le compte est débiteur en attendant les règlements clients.

### Stack technique de la démo
Praxedo (Webhook clôture intervention) -> Sage Batigest (API création facture)

### Question diagnostic
"Quel est le montant exact de travaux finis mais non encore facturés qui dort dans vos systèmes ce soir ?"

## 2) Relance devis curatif (Croissance)

### Métier ciblé
SAV et dépannage en climatisation/chauffage.

### ROI factuel
+20 % de chiffre d'affaires récupéré sur le flux de devis curatifs.

### Donnée de départ
1 devis sur 5 de petite réparation (fuite, vanne, etc.) n'est jamais relancé.

### Calcul de référence
Pour 100 devis mensuels de 500 EUR :

100 x 500 EUR = 50 000 EUR émis

20 % non relancés = 10 000 EUR/mois potentiellement perdus

L'automatisation permet de récupérer ce chiffre d'affaires qui partait en oubli opérationnel.

### Problème avatar (Dir Ops)
Les techniciens détectent les pannes sur le terrain, mais le bureau ne suit pas systématiquement la relance commerciale.

### Stack technique de la démo
Extraction SQL ERP (statut En attente) -> Twilio (SMS) / Mailgun (Email)

### Question diagnostic
"Qui relance les devis de moins de 1 000 EUR chez vous ? Si la réponse est personne, vous perdez 20 % de votre CA SAV."

## Périmètre du repository

Le repository a pour vocation de créer des démos concrètes sur ces 2 cas d'usage :

1. Accélérer la transformation intervention -> facture pour libérer la trésorerie.
2. Industrialiser les relances de devis curatifs pour récupérer du CA perdu.

Chaque démo doit permettre de montrer rapidement :

- Le déclencheur métier.
- Le flux d'automatisation.
- L'impact économique chiffré.
- La question diagnostic à poser en rendez-vous.
