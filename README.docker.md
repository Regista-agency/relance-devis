# 🐳 Docker Setup - Regista Agency

## Quick Start

### Développement

```bash
# Démarrer l'application
docker-compose up -d

# Voir les logs
docker-compose logs -f

# Seeder la base de données
docker-compose exec nextjs yarn seed

# Arrêter l'application
docker-compose down
```

L'application sera accessible sur:
- **App:** http://localhost:3000
- **MongoDB Express:** http://localhost:8081 (Interface web MongoDB)

### Production

```bash
# Copier et configurer les variables d'environnement
cp .env.docker .env.production
# Éditer .env.production avec vos valeurs

# Build et démarrer
docker-compose -f docker-compose.prod.yml up -d --build

# Seeder la base de données
docker-compose -f docker-compose.prod.yml exec nextjs yarn seed
```

## Services

### 1. MongoDB (Port 27017)
- **Image:** mongo:7.0
- **Username:** admin
- **Password:** admin123
- **Database:** regista-agency
- **Volume:** Données persistées dans `mongodb_data`

### 2. Next.js (Port 3000)
- **Mode dev:** Hot reload activé
- **Volumes:** Code synchronisé en temps réel
- **Dépend de:** MongoDB (attend qu'il soit healthy)

### 3. Mongo Express (Port 8081) - Optionnel
- Interface web pour visualiser MongoDB
- Accès direct à la base de données
- Utile pour le debug

## Commandes Utiles

### Gestion des containers

```bash
# Démarrer
docker-compose up -d

# Arrêter
docker-compose down

# Arrêter et supprimer les volumes
docker-compose down -v

# Rebuild les images
docker-compose up -d --build

# Redémarrer un service
docker-compose restart nextjs
```

### Logs

```bash
# Tous les services
docker-compose logs -f

# Un service spécifique
docker-compose logs -f nextjs
docker-compose logs -f mongodb

# Dernières 100 lignes
docker-compose logs --tail=100 nextjs
```

### Exécuter des commandes

```bash
# Seeder la base de données
docker-compose exec nextjs yarn seed

# Installer une dépendance
docker-compose exec nextjs yarn add package-name

# Shell dans le container
docker-compose exec nextjs sh

# Accéder à MongoDB
docker-compose exec mongodb mongosh -u admin -p admin123 regista-agency
```

### Nettoyage

```bash
# Supprimer tous les containers et volumes
docker-compose down -v

# Supprimer les images
docker rmi $(docker images | grep regista)

# Nettoyage Docker complet
docker system prune -a
```

## Structure des fichiers Docker

```
.
├── docker-compose.yml          # Configuration développement
├── docker-compose.prod.yml     # Configuration production
├── Dockerfile                  # Multi-stage build
├── .dockerignore              # Fichiers à ignorer
├── .env.docker                # Variables d'env pour Docker
└── README.docker.md           # Ce fichier
```

## Variables d'environnement

### Développement (.env.docker)

```bash
MONGODB_URI=mongodb://admin:admin123@mongodb:27017/regista-agency?authSource=admin
NEXTAUTH_SECRET=regista-secret-key-change-in-production-min-32-chars
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Regista Agency
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Production (.env.production)

```bash
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=votre-mot-de-passe-securise
MONGODB_URI=mongodb://admin:password@mongodb:27017/regista-agency?authSource=admin
NEXTAUTH_SECRET=generer-avec-openssl-rand-base64-32
NEXTAUTH_URL=https://demo.regista-agency.fr
NEXT_PUBLIC_APP_NAME=Regista Agency
NEXT_PUBLIC_APP_URL=https://demo.regista-agency.fr
```

## Troubleshooting

### MongoDB ne démarre pas

```bash
# Vérifier les logs
docker-compose logs mongodb

# Supprimer le volume et redémarrer
docker-compose down -v
docker-compose up -d
```

### Next.js ne compile pas

```bash
# Rebuild sans cache
docker-compose build --no-cache nextjs
docker-compose up -d

# Supprimer node_modules et reinstaller
docker-compose exec nextjs rm -rf node_modules .next
docker-compose exec nextjs yarn install
```

### Problème de permissions

```bash
# Changer les permissions (Linux/Mac)
sudo chown -R $USER:$USER .
```

### Port déjà utilisé

```bash
# Trouver le processus utilisant le port 3000
lsof -i :3000
# Ou
netstat -ano | grep 3000

# Tuer le processus
kill -9 <PID>
```

## Performance

### Optimiser pour Mac/Windows

Les volumes Docker peuvent être lents sur Mac/Windows. Utilisez ces optimisations:

```yaml
volumes:
  - .:/app:delegated  # ou :cached
```

### Mode production

Le build de production:
- Optimise le code
- Minifie les assets
- Supprime les dev dependencies
- Utilise un user non-root

## Monitoring

### Health checks

```bash
# Vérifier la santé des services
docker-compose ps

# Inspecter un container
docker inspect regista-mongodb
```

### Statistiques

```bash
# Utilisation CPU/Mémoire
docker stats

# Espace disque
docker system df
```

## Backup & Restore

### Backup MongoDB

```bash
# Créer un backup
docker-compose exec mongodb mongodump \
  --uri="mongodb://admin:admin123@localhost:27017/regista-agency?authSource=admin" \
  --out=/tmp/backup

# Copier le backup
docker cp regista-mongodb:/tmp/backup ./backup
```

### Restore MongoDB

```bash
# Copier le backup dans le container
docker cp ./backup regista-mongodb:/tmp/backup

# Restaurer
docker-compose exec mongodb mongorestore \
  --uri="mongodb://admin:admin123@localhost:27017/regista-agency?authSource=admin" \
  /tmp/backup/regista-agency
```

## Déploiement

### Sur un serveur

1. Cloner le repository
2. Copier `.env.docker` vers `.env.production`
3. Modifier les variables d'environnement
4. Lancer avec docker-compose.prod.yml

```bash
git clone <repo>
cd app
cp .env.docker .env.production
# Éditer .env.production
docker-compose -f docker-compose.prod.yml up -d --build
```

### Avec un reverse proxy (Nginx)

Configurer Nginx pour pointer vers `http://localhost:3000`

---

**Regista Agency** - Powered by Docker 🐳