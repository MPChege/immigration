from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from accounts.models import User, ServiceProvider
from relocations.models import Relocation
from bookings.models import Booking
from shipments.models import Shipment
from payments.models import Payment
from reviews.models import Review
from documents.models import Document
from datetime import datetime, timedelta
import random

User = get_user_model()


class Command(BaseCommand):
    help = 'Seed the database with sample data'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Starting to seed data...'))

        # Create Users
        users = []
        for i in range(1, 11):
            user = User.objects.create_user(
                username=f'user{i}',
                email=f'user{i}@example.com',
                password='password123',
                first_name=f'John{i}',
                last_name=f'Doe{i}',
                contact=f'+123456789{i}',
                address=f'{i*100} Main St, City, State',
                user_type='user'
            )
            users.append(user)
            self.stdout.write(f'Created user: {user.username}')

        # Create Service Providers
        service_providers = []
        companies = [
            'Global Movers Inc.',
            'Swift Relocation Services',
            'Elite Moving Company',
            'Worldwide Transport Solutions',
            'Premium Relocation Experts',
            'Fast Track Movers',
            'International Moving Co.',
            'Trusted Relocation Services',
        ]
        
        for i, company in enumerate(companies):
            user = User.objects.create_user(
                username=f'provider{i+1}',
                email=f'provider{i+1}@example.com',
                password='password123',
                first_name=f'Provider{i+1}',
                last_name='Manager',
                contact=f'+198765432{i}',
                address=f'{i*200} Business Ave, City, State',
                user_type='service_provider'
            )
            provider = ServiceProvider.objects.create(
                user=user,
                company_name=company,
                contact_person=f'{user.first_name} {user.last_name}',
                services_offered='Packing, Transportation, Unpacking, Storage, Insurance',
                pricing_info=f'Starting from ${500 + i*100} for local moves, ${1000 + i*200}+ for long distance',
                availability=True,
                rating=round(random.uniform(4.0, 5.0), 2),
                total_reviews=random.randint(10, 100)
            )
            service_providers.append(provider)
            self.stdout.write(f'Created service provider: {provider.company_name}')

        # Create Relocations
        origins = ['New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX', 'Phoenix, AZ']
        destinations = ['Miami, FL', 'Seattle, WA', 'Boston, MA', 'Denver, CO', 'Atlanta, GA', 'Portland, OR']
        statuses = ['planning', 'booked', 'in_progress', 'completed']
        
        relocations = []
        for i, user in enumerate(users[:8]):
            for j in range(2):
                relocation = Relocation.objects.create(
                    user=user,
                    origin=random.choice(origins),
                    destination=random.choice(destinations),
                    moving_date=datetime.now().date() + timedelta(days=random.randint(7, 60)),
                    inventory=f'Furniture, Electronics, Clothing, Books, Kitchen Items',
                    status=random.choice(statuses),
                    estimated_cost=round(random.uniform(500, 3000), 2) if random.random() > 0.3 else None
                )
                relocations.append(relocation)
                self.stdout.write(f'Created relocation: {relocation.origin} → {relocation.destination}')

        # Create Bookings
        for i, relocation in enumerate(relocations[:10]):
            if relocation.status in ['booked', 'in_progress', 'completed']:
                provider = random.choice(service_providers)
                booking = Booking.objects.create(
                    user=relocation.user,
                    service_provider=provider,
                    relocation=relocation,
                    service_type=random.choice(['Full Service', 'Transportation Only', 'Packing & Moving']),
                    booking_date=datetime.now() - timedelta(days=random.randint(1, 30)),
                    status=relocation.status,
                    total_amount=relocation.estimated_cost or round(random.uniform(500, 3000), 2),
                    notes=f'Special handling required for fragile items'
                )
                self.stdout.write(f'Created booking for: {booking.service_provider.company_name}')

                # Create Shipment for completed bookings
                if booking.status in ['in_progress', 'completed']:
                    shipment = Shipment.objects.create(
                        booking=booking,
                        tracking_number=f'TRK-{random.randint(100000, 999999)}',
                        status='in_transit' if booking.status == 'in_progress' else 'delivered',
                        current_location=random.choice(['In Transit', 'At Distribution Center', 'Out for Delivery', 'Delivered']),
                        estimated_delivery=datetime.now() + timedelta(days=random.randint(1, 7)),
                        actual_delivery=datetime.now() - timedelta(days=random.randint(0, 5)) if booking.status == 'completed' else None
                    )
                    self.stdout.write(f'Created shipment: {shipment.tracking_number}')

                # Create Payment
                if booking.status in ['booked', 'in_progress', 'completed']:
                    payment = Payment.objects.create(
                        booking=booking,
                        amount=booking.total_amount,
                        payment_method=random.choice(['credit_card', 'paypal', 'bank_transfer']),
                        status='completed',
                        transaction_id=f'TXN-{random.randint(100000, 999999)}',
                        notes='Payment processed successfully'
                    )
                    self.stdout.write(f'Created payment: ${payment.amount}')

        # Create Reviews
        for provider in service_providers[:5]:
            for i in range(random.randint(3, 8)):
                user = random.choice(users)
                review = Review.objects.create(
                    user=user,
                    service_provider=provider,
                    rating=random.randint(4, 5),
                    comment=random.choice([
                        'Excellent service! Very professional and careful with our belongings.',
                        'Great experience from start to finish. Highly recommended!',
                        'Fast and efficient. Our items arrived in perfect condition.',
                        'Outstanding customer service and attention to detail.',
                        'Very reliable and trustworthy. Will use again!',
                    ])
                )
                self.stdout.write(f'Created review for {provider.company_name}')

        # Create Documents
        doc_types = ['contract', 'invoice', 'insurance', 'passport', 'visa']
        for user in users[:5]:
            for i in range(2):
                Document.objects.create(
                    user=user,
                    document_name=f'{doc_types[i].title()} Document',
                    document_type=doc_types[i],
                    file_path=f'documents/sample_{doc_types[i]}.pdf',
                    description=f'Sample {doc_types[i]} document'
                )
                self.stdout.write(f'Created document for {user.username}')

        self.stdout.write(self.style.SUCCESS('\n✅ Successfully seeded database!'))
        self.stdout.write(self.style.SUCCESS(f'Created:'))
        self.stdout.write(self.style.SUCCESS(f'  - {len(users)} Users'))
        self.stdout.write(self.style.SUCCESS(f'  - {len(service_providers)} Service Providers'))
        self.stdout.write(self.style.SUCCESS(f'  - {len(relocations)} Relocations'))
        self.stdout.write(self.style.SUCCESS(f'  - {Booking.objects.count()} Bookings'))
        self.stdout.write(self.style.SUCCESS(f'  - {Shipment.objects.count()} Shipments'))
        self.stdout.write(self.style.SUCCESS(f'  - {Payment.objects.count()} Payments'))
        self.stdout.write(self.style.SUCCESS(f'  - {Review.objects.count()} Reviews'))
        self.stdout.write(self.style.SUCCESS(f'  - {Document.objects.count()} Documents'))
