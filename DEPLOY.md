# Ubuntu Hosting & Deployment Guide

This guide will walk you through hosting **The Lotus Infosys** website on your Ubuntu server (`root@admin1`).

---

## Step 1: Install Docker & Docker Compose on your Server

Connect to your Ubuntu server via SSH and run the following commands to install Docker:

```bash
# Update package database
sudo apt update

# Install prerequisites
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common gnupg lsb-release

# Add Docker's official GPG key
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Add Docker repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine & Compose
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Verify installation (should print versions)
docker --version
docker compose version
```

---

## Step 2: Transfer the Website Code to your Server

Choose one of these two options:

### Option A: Via Git (Recommended)
Push this local repository to GitHub, GitLab, or Bitbucket. On your Ubuntu server, clone it:
```bash
git clone <YOUR_REPOSITORY_URL> /var/www/thelotusinfosys
cd /var/www/thelotusinfosys
```

### Option B: Via SCP/SFTP
Copy the files directly from your local machine to your server:
```bash
scp -r /Users/pranavkhandelwal/Projects/TheLotusInfosys root@<YOUR_SERVER_IP>:/var/www/thelotusinfosys
```

---

## Step 3: Configure Environment Variables

Create a `.env` file in the root directory (`/var/www/thelotusinfosys`) on your server:

```bash
cd /var/www/thelotusinfosys
nano .env
```

Add the following environment variable (replace with your server's public IP address or your domain):

```ini
NEXT_PUBLIC_API_URL=http://<YOUR_SERVER_IP_OR_DOMAIN>
```

> [!IMPORTANT]
> Next.js bakes `NEXT_PUBLIC_` variables into the production build at compile time. If your domain or public IP changes, you will need to rebuild the containers using the command in Step 4.

---

## Step 4: Build and Launch the Application

Build the Docker containers and start them in background daemon mode:

```bash
# Run docker compose in the root directory
sudo docker compose up --build -d
```

### Troubleshooting Commands
- **Check running containers:** `sudo docker compose ps`
- **View logs:** `sudo docker compose logs -f`
- **Restart services:** `sudo docker compose restart`

At this point:
- The Next.js frontend is running inside Docker on port `3000` (mapped to local port `3000`).
- The FastAPI backend is running inside Docker on port `8000` (mapped to local port `8000`).
- The SQLite database file `lotus_infosys.db` and product uploads folder `uploads/` will be saved on your host server at `/var/www/thelotusinfosys/backend/` so your data persists even if you stop or update the containers.

---

## Step 5: Install and Configure Nginx (Reverse Proxy)

Nginx will route incoming traffic on port 80/443 to the Docker containers.

1. **Install Nginx on your Ubuntu server:**
   ```bash
   sudo apt install -y nginx
   ```

2. **Copy the Nginx configuration template:**
   Open the default site configuration file:
   ```bash
   sudo nano /etc/nginx/sites-available/default
   ```
   Delete its contents and paste the contents from [nginx.conf](file:///Users/pranavkhandelwal/Projects/TheLotusInfosys/nginx.conf):
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com www.yourdomain.com <YOUR_SERVER_IP>;

       client_max_body_size 20M;

       location /api/ {
           proxy_pass http://127.0.0.1:8000/api/;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }

       location /uploads/ {
           proxy_pass http://127.0.0.1:8000/uploads/;
           proxy_http_version 1.1;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }

       location / {
           proxy_pass http://127.0.0.1:3000/;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```
   *(Be sure to replace `yourdomain.com` with your actual domain or IP address on the `server_name` line)*

3. **Test and Reload Nginx:**
   ```bash
   sudo nginx -t
   sudo systemctl reload nginx
   ```

---

## Step 6: Enable HTTPS / SSL with Let's Encrypt (Highly Recommended)

If you have a domain pointing to your server's IP address, you can obtain a free SSL certificate:

```bash
# Install Certbot and the Nginx plugin
sudo apt install -y certbot python3-certbot-nginx

# Obtain and install the SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Follow the prompts. Certbot will automatically issue the certificate and update your Nginx configuration to support secure HTTPS traffic and redirect all HTTP traffic to HTTPS.

If you add SSL, make sure to update your `.env` file with `https://yourdomain.com` and run `sudo docker compose up --build -d` to rebuild the Next.js frontend with the secure URL.
