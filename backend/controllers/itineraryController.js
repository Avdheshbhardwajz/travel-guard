import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const addItinerary = async (req, res) => {
  try {
    const tripId = parseInt(req.params.tripId);
    const { day, activity, location, notes, time } = req.body;

    if (!activity || !day) {
      return res.status(400).json({ message: 'Day and activity are required' });
    }

    // Verify trip belongs to user
    const trip = await prisma.trip.findFirst({
      where: { id: tripId, userId: req.user.id },
    });
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    const item = await prisma.itinerary.create({
      data: {
        day: parseInt(day),
        activity,
        location: location || null,
        notes: notes || null,
        time: time || null,
        tripId,
      },
    });

    res.status(201).json(item);
  } catch (error) {
    console.error('Add itinerary error:', error);
    res.status(500).json({ message: 'Failed to add itinerary item' });
  }
};

export const getItinerary = async (req, res) => {
  try {
    const tripId = parseInt(req.params.tripId);

    const items = await prisma.itinerary.findMany({
      where: { tripId },
      orderBy: { day: 'asc' },
    });

    res.json(items);
  } catch (error) {
    console.error('Get itinerary error:', error);
    res.status(500).json({ message: 'Failed to fetch itinerary' });
  }
};

export const updateItinerary = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { day, activity, location, notes, time } = req.body;

    const item = await prisma.itinerary.update({
      where: { id },
      data: {
        ...(day !== undefined && { day: parseInt(day) }),
        ...(activity !== undefined && { activity }),
        ...(location !== undefined && { location }),
        ...(notes !== undefined && { notes }),
        ...(time !== undefined && { time }),
      },
    });

    res.json(item);
  } catch (error) {
    console.error('Update itinerary error:', error);
    res.status(500).json({ message: 'Failed to update itinerary item' });
  }
};

export const deleteItinerary = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    await prisma.itinerary.delete({ where: { id } });

    res.json({ message: 'Itinerary item deleted' });
  } catch (error) {
    console.error('Delete itinerary error:', error);
    res.status(500).json({ message: 'Failed to delete itinerary item' });
  }
};
