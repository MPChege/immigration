# Quick Start Guide

## Prerequisites
- Python 3.8+
- Node.js 14+
- pip and npm installed

## Quick Setup (5 minutes)

### 1. Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create admin user
python manage.py createsuperuser
# Follow prompts to create admin account

# Start server
python manage.py runserver
```

Backend will run on http://localhost:8000

### 2. Frontend Setup

Open a new terminal:

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

Frontend will run on http://localhost:3000

## First Steps

1. **Access the application**: http://localhost:3000
2. **Register as a user**: Click "Register" and create an account
3. **Register as service provider**: Click "Register as Service Provider"
4. **Admin access**: Go to http://localhost:8000/admin and login with superuser credentials

## Testing the System

### As a User:
1. Login with your user account
2. Create a relocation (origin, destination, moving date, inventory)
3. Browse service providers
4. Create a booking
5. Track shipments
6. Upload documents

### As a Service Provider:
1. Login with service provider account
2. View bookings assigned to you
3. Confirm bookings
4. Update shipment status
5. Track payments

### As an Admin:
1. Login to admin panel at http://localhost:8000/admin
2. Manage users and service providers
3. View all bookings, relocations, and payments
4. Monitor system activity

## Common Issues

### Backend won't start
- Check if port 8000 is already in use
- Verify all dependencies are installed: `pip install -r requirements.txt`
- Check Python version: `python --version` (should be 3.8+)

### Frontend won't start
- Check if port 3000 is already in use
- Verify Node.js version: `node --version` (should be 14+)
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`

### CORS errors
- Ensure backend is running on port 8000
- Check CORS settings in `backend/relocation_system/settings.py`

### Database errors
- Run migrations: `python manage.py migrate`
- If using SQLite, check file permissions

## Next Steps

- Read the full README.md for detailed documentation
- Explore the API endpoints at http://localhost:8000/api/
- Customize the system according to your needs
- Deploy to production following the deployment guide in README.md
