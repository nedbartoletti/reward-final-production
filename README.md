# Rewards App

A web application for managing app download rewards, where users can earn points by downloading apps and submitting screenshots as proof.

## Features

- Admin Dashboard for managing apps and rewards
- User authentication and authorization
- Points tracking system
- Screenshot upload with drag and drop
- REST API with complete documentation
- JWT Authentication

## Setup Instructions

### Backend Setup
1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run migrations:
```bash
python manage.py migrate
```

4. Create superuser:
```bash
python manage.py createsuperuser
```

5. Run the development server:
```bash
python manage.py runserver
```

### Frontend Setup
1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

## Production Deployment Guide

### 1. Environment Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Create a `.env.production` file with your production settings:
```
DJANGO_SECRET_KEY=your-secret-key-here
DJANGO_DEBUG=False
DJANGO_SECURE_SSL_REDIRECT=True
DATABASE_URL=your-database-url
ALLOWED_HOSTS=your-domain.com
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com
```

### 2. Database Setup

1. Run migrations:
```bash
python manage.py migrate
```

2. Create a superuser:
```bash
python manage.py createsuperuser
```

### 3. Static Files

1. Collect static files:
```bash
python manage.py collectstatic --noinput
```

### 4. Production Server Setup

1. Using Gunicorn:
```bash
gunicorn rewards_project.wsgi:application
```

2. Configure your web server (Nginx example):
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location = /favicon.ico { access_log off; log_not_found off; }
    
    location /static/ {
        root /path/to/your/project;
    }

    location /media/ {
        root /path/to/your/project;
    }

    location / {
        include proxy_params;
        proxy_pass http://127.0.0.1:8000;
    }
}
```

### 5. SSL/HTTPS Setup

1. Install Certbot:
```bash
sudo apt-get install certbot python3-certbot-nginx
```

2. Obtain SSL certificate:
```bash
sudo certbot --nginx -d your-domain.com
```

### 6. Security Checklist

1. Update `ALLOWED_HOSTS` in settings.py with your domain
2. Set strong `SECRET_KEY` in .env.production
3. Enable HTTPS redirect
4. Configure CORS settings
5. Set up proper database credentials
6. Enable security headers

### 7. Monitoring

1. Set up error logging
2. Configure performance monitoring
3. Set up backup system

### Common Issues

1. **502 Bad Gateway**: Check if gunicorn is running
2. **Static files not loading**: Run collectstatic and check STATIC_ROOT
3. **CORS errors**: Verify CORS_ALLOWED_ORIGINS in settings
4. **Database connection issues**: Check DATABASE_URL and credentials

### Important Notes

- Never expose .env files or secret keys
- Keep dependencies updated
- Regularly backup your database
- Monitor server resources
- Set up proper logging
- Configure rate limiting for API endpoints

## API Documentation
- API documentation is available at `/api/docs/`
- Swagger UI is available at `/api/swagger/`
