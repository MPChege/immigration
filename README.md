# Online Relocation Management System

A comprehensive web-based platform for managing relocations, connecting users with service providers, and streamlining the entire relocation process.

## Features

### User Module
- User registration and authentication
- Relocation planning and management
- Service provider search and booking
- Real-time shipment tracking
- Document management
- Payment processing
- Reviews and ratings

### Service Provider Module
- Service provider registration
- Profile management
- Booking management
- Shipment status updates
- Invoice generation
- Payment tracking

### Admin Module
- User and service provider management
- System monitoring
- Reporting and analytics
- Dispute resolution
- System configuration

## Technology Stack

### Backend
- **Framework**: Django 4.2.7
- **API**: Django REST Framework
- **Authentication**: JWT (JSON Web Tokens)
- **Database**: SQLite (default, can be configured for PostgreSQL/MySQL)

### Frontend
- **Framework**: React 18.2.0
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Styling**: CSS3

## Project Structure

```
Immigration/
├── backend/
│   ├── accounts/          # User authentication and profiles
│   ├── relocations/       # Relocation management
│   ├── bookings/          # Booking management
│   ├── payments/          # Payment processing
│   ├── shipments/         # Shipment tracking
│   ├── documents/         # Document management
│   ├── reviews/           # Reviews and ratings
│   └── relocation_system/ # Django project settings
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React context (Auth)
│   │   ├── pages/         # Page components
│   │   └── App.js         # Main app component
│   └── public/            # Static files
└── README.md
```

## Installation and Setup

### Prerequisites
- Python 3.8 or higher
- Node.js 14 or higher
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run migrations:
```bash
python manage.py makemigrations
python manage.py migrate
```

5. Create a superuser (admin account):
```bash
python manage.py createsuperuser
```

**Default Admin Credentials:**
| Field    | Value             |
|----------|-------------------|
| Username | `admin`           |
| Password | `admin123`        |
| Email    | `admin@example.com` |

> **Note:** Change these credentials in production.

6. Run the development server:
```bash
python manage.py runserver
```

The backend API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
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

The frontend will be available at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register/user/` - Register a new user
- `POST /api/auth/register/service-provider/` - Register a service provider
- `POST /api/auth/login/` - User login
- `GET /api/auth/me/` - Get current user
- `GET /api/auth/service-providers/` - List service providers

### Relocations
- `GET /api/relocations/` - List relocations
- `POST /api/relocations/` - Create relocation
- `GET /api/relocations/{id}/` - Get relocation details
- `POST /api/relocations/{id}/calculate_quotation/` - Calculate quotation

### Bookings
- `GET /api/bookings/` - List bookings
- `POST /api/bookings/` - Create booking
- `POST /api/bookings/{id}/confirm/` - Confirm booking
- `POST /api/bookings/{id}/cancel/` - Cancel booking

### Shipments
- `GET /api/shipments/` - List shipments
- `POST /api/shipments/` - Create shipment
- `GET /api/shipments/track/?tracking_number={number}` - Track shipment
- `POST /api/shipments/{id}/update_status/` - Update shipment status

### Payments
- `GET /api/payments/` - List payments
- `POST /api/payments/` - Create payment

### Documents
- `GET /api/documents/` - List documents
- `POST /api/documents/` - Upload document

### Reviews
- `GET /api/reviews/` - List reviews
- `POST /api/reviews/` - Create review

## Database Configuration

By default, the system uses SQLite. To use PostgreSQL or MySQL:

1. Update `backend/relocation_system/settings.py`:
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'relocation_db',
        'USER': 'your_user',
        'PASSWORD': 'your_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

2. Install the appropriate database adapter:
```bash
# For PostgreSQL
pip install psycopg2-binary

# For MySQL
pip install mysqlclient
```

## Usage

1. **Start the backend server** (from `backend/` directory):
   ```bash
   python manage.py runserver
   ```

2. **Start the frontend server** (from `frontend/` directory):
   ```bash
   npm start
   ```

3. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - Admin Panel: http://localhost:8000/admin

4. **Create accounts**:
   - Register as a regular user
   - Register as a service provider
   - Use the admin panel to create admin accounts

## Testing

### Backend Tests
```bash
cd backend
python manage.py test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Security Considerations

- Passwords are hashed using Django's default password hashing
- JWT tokens are used for authentication
- CORS is configured for frontend-backend communication
- Input validation is implemented on both frontend and backend
- File uploads are restricted to document types

## Production Deployment

Before deploying to production:

1. Set `DEBUG = False` in `settings.py`
2. Update `SECRET_KEY` with a secure random key
3. Configure proper database (PostgreSQL recommended)
4. Set up proper CORS origins
5. Configure static file serving
6. Set up HTTPS
7. Configure environment variables for sensitive data

## Contributing

This is an academic project. For improvements or bug fixes, please follow standard development practices.

## License

This project is developed as part of a Bachelor's degree program.

## Support

For issues or questions, please refer to the project documentation or contact the development team.
