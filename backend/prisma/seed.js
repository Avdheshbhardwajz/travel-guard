import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding TravelGuard database...\n');

  // Clean existing data
  await prisma.expense.deleteMany();
  await prisma.itinerary.deleteMany();
  await prisma.trip.deleteMany();
  await prisma.user.deleteMany();

  // Create demo user
  const hashedPassword = await bcrypt.hash('demo1234', 12);
  const user = await prisma.user.create({
    data: {
      name: 'Avdhesh Bhardwaj',
      email: 'demo@travelguard.com',
      password: hashedPassword,
    },
  });
  console.log(`✅ Created user: ${user.email}`);

  // Create sample trips
  const trip1 = await prisma.trip.create({
    data: {
      title: 'Goa Beach Vacation',
      destination: 'Goa, India',
      description: 'A relaxing week at the beaches of Goa with friends. Sun, sand, and seafood!',
      startDate: new Date('2026-04-15'),
      endDate: new Date('2026-04-22'),
      budget: 25000,
      status: 'planning',
      userId: user.id,
    },
  });

  const trip2 = await prisma.trip.create({
    data: {
      title: 'Manali Adventure',
      destination: 'Manali, Himachal Pradesh',
      description: 'Mountain trekking, paragliding, and exploring the old town.',
      startDate: new Date('2026-05-10'),
      endDate: new Date('2026-05-17'),
      budget: 30000,
      status: 'planning',
      userId: user.id,
    },
  });

  const trip3 = await prisma.trip.create({
    data: {
      title: 'Jaipur Heritage Tour',
      destination: 'Jaipur, Rajasthan',
      description: 'Exploring the Pink City - Amber Fort, Hawa Mahal, and local cuisine.',
      startDate: new Date('2026-03-01'),
      endDate: new Date('2026-03-05'),
      budget: 15000,
      status: 'completed',
      userId: user.id,
    },
  });

  console.log(`✅ Created ${3} trips`);

  // Add itineraries for Trip 1 (Goa)
  await prisma.itinerary.createMany({
    data: [
      { day: 1, activity: 'Arrive at Dabolim Airport, check into hotel at Calangute', location: 'Calangute, Goa', time: '10:00 AM', tripId: trip1.id },
      { day: 1, activity: 'Evening walk at Baga Beach, sunset dinner', location: 'Baga Beach', time: '5:00 PM', tripId: trip1.id },
      { day: 2, activity: 'Dudhsagar Waterfalls excursion', location: 'Dudhsagar', time: '7:00 AM', tripId: trip1.id },
      { day: 2, activity: 'Old Goa churches visit', location: 'Old Goa', time: '3:00 PM', tripId: trip1.id },
      { day: 3, activity: 'Water sports - parasailing, jet ski, banana boat', location: 'Calangute Beach', time: '9:00 AM', tripId: trip1.id },
      { day: 3, activity: 'Night market at Arpora', location: 'Arpora', time: '7:00 PM', tripId: trip1.id },
      { day: 4, activity: 'South Goa exploration - Palolem Beach', location: 'Palolem', time: '8:00 AM', tripId: trip1.id },
      { day: 5, activity: 'Spice plantation tour and cooking class', location: 'Ponda', time: '10:00 AM', tripId: trip1.id },
    ],
  });

  // Add itineraries for Trip 2 (Manali)
  await prisma.itinerary.createMany({
    data: [
      { day: 1, activity: 'Arrive in Manali, check into resort', location: 'Mall Road, Manali', time: '11:00 AM', tripId: trip2.id },
      { day: 2, activity: 'Solang Valley - paragliding and zorbing', location: 'Solang Valley', time: '8:00 AM', tripId: trip2.id },
      { day: 3, activity: 'Rohtang Pass excursion', location: 'Rohtang Pass', time: '6:00 AM', tripId: trip2.id },
      { day: 4, activity: 'Old Manali exploration and cafe hopping', location: 'Old Manali', time: '10:00 AM', tripId: trip2.id },
      { day: 5, activity: 'Trek to Jogini Waterfalls', location: 'Vashisht', time: '7:00 AM', tripId: trip2.id },
    ],
  });

  // Add itineraries for Trip 3 (Jaipur)
  await prisma.itinerary.createMany({
    data: [
      { day: 1, activity: 'Amber Fort and Jaigarh Fort tour', location: 'Amber', time: '9:00 AM', tripId: trip3.id },
      { day: 2, activity: 'Hawa Mahal, City Palace, Jantar Mantar', location: 'Old City', time: '9:00 AM', tripId: trip3.id },
      { day: 3, activity: 'Nahargarh Fort sunset, Chokhi Dhani dinner', location: 'Nahargarh', time: '3:00 PM', tripId: trip3.id },
    ],
  });

  console.log(`✅ Created itinerary items`);

  // Add expenses for Trip 1 (Goa)
  await prisma.expense.createMany({
    data: [
      { title: 'Flight tickets (round trip)', amount: 8500, category: 'transport', date: new Date('2026-04-15'), tripId: trip1.id },
      { title: 'Hotel - 7 nights', amount: 7000, category: 'accommodation', date: new Date('2026-04-15'), tripId: trip1.id },
      { title: 'Water sports package', amount: 2500, category: 'other', date: new Date('2026-04-17'), tripId: trip1.id },
      { title: 'Seafood dinner at Martin\'s Corner', amount: 1200, category: 'food', date: new Date('2026-04-16'), tripId: trip1.id },
      { title: 'Scooter rental - 5 days', amount: 1500, category: 'transport', date: new Date('2026-04-15'), tripId: trip1.id },
    ],
  });

  // Add expenses for Trip 3 (Jaipur - completed)
  await prisma.expense.createMany({
    data: [
      { title: 'Train tickets', amount: 1800, category: 'transport', date: new Date('2026-03-01'), tripId: trip3.id },
      { title: 'Hotel - 4 nights', amount: 4800, category: 'accommodation', date: new Date('2026-03-01'), tripId: trip3.id },
      { title: 'Amber Fort entry + guide', amount: 800, category: 'other', date: new Date('2026-03-02'), tripId: trip3.id },
      { title: 'Local food and restaurants', amount: 2200, category: 'food', date: new Date('2026-03-03'), tripId: trip3.id },
      { title: 'Auto rickshaw rides', amount: 600, category: 'transport', date: new Date('2026-03-02'), tripId: trip3.id },
      { title: 'Chokhi Dhani dinner', amount: 1500, category: 'food', date: new Date('2026-03-04'), tripId: trip3.id },
      { title: 'Shopping - textiles & crafts', amount: 3000, category: 'other', date: new Date('2026-03-04'), tripId: trip3.id },
    ],
  });

  console.log(`✅ Created expense entries`);
  console.log('\n🎉 Seeding completed! Use demo@travelguard.com / demo1234 to login');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
