import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';
import TravelPlan from '../models/TravelPlan';

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('Connected to MongoDB');

    await User.deleteMany({});
    await TravelPlan.deleteMany({});
    console.log('Cleared existing data');

    const user = await User.create({
      name: 'Test User',
      email: 'test@tripweave.com',
      password: 'hashedpassword123',
      avatar: 'https://i.pravatar.cc/150?img=1',
    });

    console.log('Created test user:', user.email);

    const plan = await TravelPlan.create({
      title: 'Tokyo Adventure 2025',
      destination: 'Tokyo, Japan',
      startDate: new Date('2025-04-01'),
      endDate: new Date('2025-04-10'),
      createdBy: user._id,
      collaborators: [
        {
          userId: user._id,
          role: 'admin',
          permissions: ['edit', 'delete', 'invite'],
          joinedAt: new Date(),
        },
      ],
      itinerary: [
        {
          date: new Date('2025-04-02'),
          order: 1,
          activities: [
            {
              name: 'Visit Senso-ji Temple',
              location: 'Asakusa, Tokyo',
              startTime: new Date('2025-04-02T09:00:00'),
              endTime: new Date('2025-04-02T11:00:00'),
              type: 'culture',
              order: 1,
            },
            {
              name: 'Nakamise Shopping Street',
              location: 'Asakusa, Tokyo',
              startTime: new Date('2025-04-02T11:15:00'),
              endTime: new Date('2025-04-02T12:30:00'),
              type: 'shopping',
              order: 2,
              commuteTo: {
                mode: 'walking',
                duration: 8,
                distance: 650,
              },
            },
          ],
        },
      ],
      brainstormNotes: 'Visit teamLab Borderless\nTry authentic ramen',
      brainstormTags: ['teamLab Borderless', 'Sushi making class'],
    });

    console.log('Created travel plan:', plan.title);
    console.log('Database seeding completed');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
