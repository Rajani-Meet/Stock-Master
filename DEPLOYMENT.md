# StockMaster Deployment Guide

This guide covers deploying StockMaster to various platforms without Docker.

## Pre-Deployment Checklist

- [ ] Node.js 18+ installed
- [ ] PostgreSQL 14+ database available
- [ ] All environment variables configured
- [ ] Database migrations tested locally
- [ ] Seed data loaded (for demo purposes)
- [ ] API endpoints tested with real data
- [ ] Frontend pages tested in production mode

## Environment Variables

Create `.env.local` with:

```env
# Required
DATABASE_URL="postgresql://user:password@host:5432/dbname"
JWT_SECRET="<use-a-long-random-string>"
NODE_ENV="production"

# Optional
# NEXT_PUBLIC_API_URL="https://yourdomain.com"
```

Use a strong JWT secret in production:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Deployment Platforms

### 1. Vercel (Recommended)

Vercel is optimized for Next.js and provides serverless deployment.

#### Setup

1. **Connect repository to Vercel:**
   - Sign in at https://vercel.com
   - Click "New Project"
   - Select your GitHub repository
   - Import project

2. **Configure environment variables in Vercel Dashboard:**
   - Go to Settings → Environment Variables
   - Add all variables from `.env.local`

3. **Deploy:**
   - Push to main branch: `git push origin main`
   - Vercel automatically builds and deploys

4. **Run migrations:**

   ```bash
   # Via Vercel CLI
   vercel env pull
   npx prisma migrate deploy
   npm run seed # optional
   ```

   Or set up a deployment script in `package.json`:

   ```json
   "postinstall": "prisma generate && prisma migrate deploy"
   ```

#### Database (PostgreSQL)

For Vercel, use an external PostgreSQL provider:

- **Railway.app** (recommended for simplicity)
- **AWS RDS**
- **Supabase**
- **Heroku PostgreSQL**
- **Digital Ocean**

**Railway.app Setup:**

1. Create account at https://railway.app
2. Create new PostgreSQL plugin
3. Copy connection string to `DATABASE_URL`
4. Set in Vercel environment variables

#### Monitoring

- View logs: `vercel logs <project-name>`
- Check deployment status in Vercel dashboard

---

### 2. Heroku

#### Prerequisites

- Install [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
- Heroku account

#### Deploy

```bash
# Login
heroku login

# Create app
heroku create stock-master

# Add PostgreSQL
heroku addons:create heroku-postgresql:standard-0 --app stock-master

# Set environment variables
heroku config:set JWT_SECRET="your-secret-key" --app stock-master
heroku config:set NODE_ENV="production" --app stock-master

# Deploy
git push heroku main

# Run migrations
heroku run npm run prisma:migrate --app stock-master

# Optional: seed data
heroku run npm run seed --app stock-master

# View logs
heroku logs --tail --app stock-master
```

#### PostgreSQL

Heroku automatically provides PostgreSQL. View connection string:

```bash
heroku config --app stock-master
# DATABASE_URL will be listed
```

#### Scaling

```bash
# Scale dynos
heroku ps:scale web=2 --app stock-master

# Monitor
heroku ps --app stock-master
```

---

### 3. Azure App Service

#### Prerequisites

- Azure account
- Azure CLI installed
- PostgreSQL server created in Azure

#### Setup

1. **Create App Service:**

   ```bash
   az group create -n stock-master -l eastus
   az appservice plan create -n stock-master-plan -g stock-master --sku B1 --is-linux
   az webapp create -n stock-master -g stock-master -p stock-master-plan --runtime "node|18"
   ```

2. **Configure application settings:**

   ```bash
   az webapp config appsettings set \
     -n stock-master \
     -g stock-master \
     --settings \
     DATABASE_URL="postgresql://..." \
     JWT_SECRET="your-secret" \
     NODE_ENV="production"
   ```

3. **Deploy via Git:**

   ```bash
   # Setup deployment user
   az webapp deployment user set --user-name <username>

   # Get Git remote
   az webapp deployment source config-local-git -n stock-master -g stock-master

   # Add Git remote and push
   git remote add azure <git-url-from-above>
   git push azure main
   ```

4. **Run migrations:**

   ```bash
   az webapp ssh -n stock-master -g stock-master
   npm run prisma:migrate
   npm run seed # optional
   exit
   ```

#### PostgreSQL

Create PostgreSQL in Azure:

```bash
az postgres server create \
  -n stock-master-db \
  -g stock-master \
  --sku-name B_Gen5_1 \
  --storage-size 51200 \
  -u dbadmin \
  -p <password>

# Get connection string and set as DATABASE_URL
```

#### Monitoring

```bash
az webapp log tail -n stock-master -g stock-master
```

---

### 4. AWS (Elastic Beanstalk)

#### Setup

```bash
# Install EB CLI
pip install awsebcli

# Initialize
eb init -p node.js-18 stock-master

# Create environment
eb create stock-master-env

# Set environment variables
eb setenv DATABASE_URL="..." JWT_SECRET="..."

# Deploy
eb deploy

# View logs
eb logs

# Run migrations
eb ssh
npm run prisma:migrate
exit
```

#### RDS (PostgreSQL)

Create RDS PostgreSQL instance and use connection string as `DATABASE_URL`.

---

### 5. Self-Hosted VPS (Ubuntu 22.04)

#### Prerequisites

- VPS with Ubuntu 22.04
- SSH access
- Public domain

#### Setup

```bash
# SSH into server
ssh ubuntu@your.domain

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Create database and user
sudo -u postgres psql
CREATE DATABASE stock_master;
CREATE USER stockuser WITH PASSWORD 'securepassword';
ALTER ROLE stockuser SET client_encoding TO 'utf8';
ALTER ROLE stockuser SET default_transaction_isolation TO 'read committed';
ALTER ROLE stockuser SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE stock_master TO stockuser;
\q

# Clone repository
git clone <repo-url> /var/www/stock-master
cd /var/www/stock-master

# Install dependencies
npm install --production

# Configure environment
cat > .env.local << EOF
DATABASE_URL="postgresql://stockuser:securepassword@localhost:5432/stock_master"
JWT_SECRET="<generated-secret>"
NODE_ENV="production"
EOF

# Build
npm run build

# Run migrations
npm run prisma:migrate

# Seed (optional)
npm run seed
```

#### Setup PM2 (Process Manager)

```bash
# Install PM2
sudo npm install -g pm2

# Start application
pm2 start npm --name stock-master -- start

# Auto-start on reboot
pm2 startup
pm2 save

# Monitor
pm2 monit
```

#### Nginx Reverse Proxy

```bash
sudo apt install -y nginx

# Create Nginx config
sudo tee /etc/nginx/sites-available/stock-master << EOF
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable site
sudo ln -s /etc/nginx/sites-available/stock-master /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### SSL Certificate (Let's Encrypt)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

#### Monitoring & Logs

```bash
# Check application status
pm2 status

# View logs
pm2 logs stock-master

# PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql.log
```

---

## Database Backup & Maintenance

### PostgreSQL Backups

```bash
# Full backup
pg_dump -U stockuser stock_master > backup.sql

# Restore from backup
psql -U stockuser stock_master < backup.sql

# Automated daily backup (cron)
0 2 * * * pg_dump -U stockuser stock_master > /backups/stock_master_$(date +\%Y\%m\%d).sql
```

### Prisma Migrations

```bash
# Create new migration after schema changes
npx prisma migrate dev --name description

# Deploy to production
npm run prisma:migrate

# Check migration status
npx prisma migrate status
```

---

## Performance Optimization

### Database Optimization

```sql
-- Create indexes for common queries
CREATE INDEX idx_stock_level_warehouse ON stock_level(warehouse_id);
CREATE INDEX idx_stock_level_product ON stock_level(product_id);
CREATE INDEX idx_stock_move_created ON stock_move(created_at);
CREATE INDEX idx_receipt_status ON receipt(status);
CREATE INDEX idx_delivery_status ON delivery_order(status);
CREATE INDEX idx_alert_resolved ON alert(is_resolved);
```

### Application Optimization

```json
{
  "scripts": {
    "build": "next build",
    "start": "NODE_OPTIONS=--max-old-space-size=512 next start"
  }
}
```

### CDN for Static Assets

Configure Vercel CDN or add to `next.config.js`:

```js
module.exports = {
  images: {
    domains: ['yourdomain.com'],
  },
}
```

---

## Monitoring & Alerting

### Application Health Check

Create `/api/health` endpoint:

```typescript
export async function GET() {
  try {
    const count = await db.product.count()
    return NextResponse.json({ status: 'ok', products: count })
  } catch (error) {
    return NextResponse.json({ status: 'error' }, { status: 500 })
  }
}
```

Monitor via uptime service:
- **UptimeRobot** (free)
- **Pingdom**
- **New Relic**

### Error Tracking

Add Sentry (optional):

```bash
npm install @sentry/nextjs
```

Configure in `next.config.js`:

```js
const withSentryConfig = require('@sentry/nextjs/withSentryConfig')

module.exports = withSentryConfig(
  {
    // ... rest of config
  },
  {
    org: 'yourorg',
    project: 'stock-master',
    authToken: process.env.SENTRY_AUTH_TOKEN,
  }
)
```

---

## Troubleshooting

### Database Connection Issues

```bash
# Test connection
psql postgresql://user:pass@host/dbname

# Check Prisma connection
npx prisma db execute --stdin < <(echo "SELECT 1")

# View Prisma debug logs
DEBUG=prisma:* npm run dev
```

### Build Failures

```bash
# Clear cache
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

### Migration Issues

```bash
# Resolve migration conflicts
npx prisma migrate resolve --rolled-back <migration-name>

# Reset database (dev only)
npx prisma migrate reset
```

---

## Rollback Procedures

### Revert Deployment

#### Vercel
- Use deployment history in dashboard to rollback to previous version

#### Heroku
```bash
heroku releases --app stock-master
heroku rollback v<version> --app stock-master
```

#### General Git Rollback
```bash
git revert <commit-hash>
git push origin main
```

### Database Rollback

```bash
# List migrations
npx prisma migrate status

# Rollback one migration (dev only)
npx prisma migrate resolve --rolled-back <migration-name>

# Restore from backup
psql -U user dbname < backup.sql
```

---

## Security Checklist

- [ ] Use HTTPS on all endpoints (SSL certificate)
- [ ] Set strong JWT_SECRET (32+ characters)
- [ ] Enable database backups (daily minimum)
- [ ] Limit database connections
- [ ] Use environment variables for sensitive data
- [ ] Enable authentication on all protected routes
- [ ] Implement rate limiting on API endpoints
- [ ] Regular security updates for dependencies
- [ ] Monitor logs for suspicious activity
- [ ] Enable database encryption at rest
- [ ] Use VPN/firewall for database access

---

## Support & Resources

- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **Prisma Deployment**: https://www.prisma.io/docs/guides/deployment
- **PostgreSQL**: https://www.postgresql.org/docs/

---

**Last Updated:** November 2024
