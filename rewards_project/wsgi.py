"""
WSGI config for rewards_project project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/wsgi/
"""

import os
from django.core.wsgi import get_wsgi_application
from pathlib import Path
from dotenv import load_dotenv

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Load the appropriate .env file
env_file = os.path.join(BASE_DIR, '.env.production')
if os.path.exists(env_file):
    load_dotenv(env_file)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'rewards_project.settings')

application = get_wsgi_application()
app = application  # for Vercel/Azure/other platforms that require 'app'
