import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createTrip = async (req, res) => {
  try {
    const { title, destination, description, startDate, endDate, budget } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Trip title is required' });
    }

    const trip = await prisma.trip.create({
      data: {
        title,
        destination: destination || null,
        description: description || null,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        budget: budget ? parseFloat(budget) : null,
        userId: req.user.id,
      },
    });

    res.status(201).json(trip);
  } catch (error) {
    console.error('Create trip error:', error);
    res.status(500).json({ message: 'Failed to create trip' });
  }
};

export const getTrips = async (req, res) => {
  try {
    const trips = await prisma.trip.findMany({
      where: { userId: req.user.id },
      include: {
        expenses: { select: { amount: true } },
        _count: { select: { itineraries: true, expenses: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const result = trips.map(t => ({
      ...t,
      totalSpent: t.expenses.reduce((sum, e) => sum + e.amount, 0),
      expenses: undefined,
    }));

    res.json(result);
  } catch (error) {
    console.error('Get trips error:', error);
    res.status(500).json({ message: 'Failed to fetch trips' });
  }
};

export const getTrip = async (req, res) => {
  try {
    const trip = await prisma.trip.findFirst({
      where: {
        id: parseInt(req.params.id),
        userId: req.user.id,
      },
      include: {
        itineraries: { orderBy: { day: 'asc' } },
        expenses: { orderBy: { date: 'desc' } },
      },
    });

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    const totalSpent = trip.expenses.reduce((sum, e) => sum + e.amount, 0);

    res.json({ ...trip, totalSpent });
  } catch (error) {
    console.error('Get trip error:', error);
    res.status(500).json({ message: 'Failed to fetch trip' });
  }
};

export const updateTrip = async (req, res) => {
  try {
    const tripId = parseInt(req.params.id);

    const existing = await prisma.trip.findFirst({
      where: { id: tripId, userId: req.user.id },
    });
    if (!existing) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    const { title, destination, description, startDate, endDate, budget, status } = req.body;

    const trip = await prisma.trip.update({
      where: { id: tripId },
      data: {
        ...(title !== undefined && { title }),
        ...(destination !== undefined && { destination }),
        ...(description !== undefined && { description }),
        ...(startDate !== undefined && { startDate: startDate ? new Date(startDate) : null }),
        ...(endDate !== undefined && { endDate: endDate ? new Date(endDate) : null }),
        ...(budget !== undefined && { budget: budget ? parseFloat(budget) : null }),
        ...(status !== undefined && { status }),
      },
    });

    res.json(trip);
  } catch (error) {
    console.error('Update trip error:', error);
    res.status(500).json({ message: 'Failed to update trip' });
  }
};

export const deleteTrip = async (req, res) => {
  try {
    const tripId = parseInt(req.params.id);

    const existing = await prisma.trip.findFirst({
      where: { id: tripId, userId: req.user.id },
    });
    if (!existing) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    await prisma.trip.delete({ where: { id: tripId } });

    res.json({ message: 'Trip deleted successfully' });
  } catch (error) {
    console.error('Delete trip error:', error);
    res.status(500).json({ message: 'Failed to delete trip' });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const trips = await prisma.trip.findMany({
      where: { userId: req.user.id },
      include: {
        expenses: { select: { amount: true, category: true } },
      },
    });

    const totalTrips = trips.length;
    const activeTrips = trips.filter(t => t.status === 'planning' || t.status === 'active').length;
    const completedTrips = trips.filter(t => t.status === 'completed').length;

    let totalBudget = 0;
    let totalSpent = 0;
    const categoryBreakdown = {};

    trips.forEach(trip => {
      if (trip.budget) totalBudget += trip.budget;
      trip.expenses.forEach(exp => {
        totalSpent += exp.amount;
        categoryBreakdown[exp.category] = (categoryBreakdown[exp.category] || 0) + exp.amount;
      });
    });

    res.json({
      totalTrips,
      activeTrips,
      completedTrips,
      totalBudget,
      totalSpent,
      categoryBreakdown,
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard stats' });
  }
};
