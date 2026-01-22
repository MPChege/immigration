# Seed Data Information

## How to Seed the Database

Run the following command to populate the database with sample data:

```bash
cd backend
python manage.py seed_data
```

## What Gets Created

- **10 Users** - Regular users with usernames user1-user10
- **8 Service Providers** - Companies like "Global Movers Inc.", "Swift Relocation Services", etc.
- **16 Relocations** - Various relocation journeys between US cities
- **8 Bookings** - Connected bookings for relocations
- **6 Shipments** - Active and completed shipments with tracking numbers
- **8 Payments** - Payment records for bookings
- **26 Reviews** - Reviews and ratings for service providers
- **10 Documents** - Sample documents for users

## Test Credentials

### Regular Users
- Username: `user1` to `user10`
- Password: `password123`

### Service Providers
- Username: `provider1` to `provider8`
- Password: `password123`

## Sample Data Features

- Realistic city names (New York, Los Angeles, Miami, etc.)
- Various relocation statuses (planning, booked, in_progress, completed)
- Random pricing ($500-$3000)
- Tracking numbers (TRK-XXXXXX)
- Transaction IDs (TXN-XXXXXX)
- Reviews with ratings (4-5 stars)
- Future and past moving dates

## To Reset and Reseed

If you want to start fresh:

```bash
cd backend
rm db.sqlite3
python manage.py migrate
python manage.py seed_data
```
