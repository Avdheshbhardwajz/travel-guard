import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

// Generate a share token for a trip
export const generateShareLink = async (req, res) => {
  try {
    const tripId = parseInt(req.params.id);

    const trip = await prisma.trip.findFirst({
      where: { id: tripId, userId: req.user.id },
    });
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    // If already has a share token, return it
    if (trip.shareToken) {
      return res.json({ shareToken: trip.shareToken });
    }

    // Generate a unique token
    const shareToken = crypto.randomBytes(16).toString('hex');

    await prisma.trip.update({
      where: { id: tripId },
      data: { shareToken },
    });

    res.json({ shareToken });
  } catch (error) {
    console.error('Generate share link error:', error);
    res.status(500).json({ message: 'Failed to generate share link' });
  }
};

// Revoke a share link
export const revokeShareLink = async (req, res) => {
  try {
    const tripId = parseInt(req.params.id);

    const trip = await prisma.trip.findFirst({
      where: { id: tripId, userId: req.user.id },
    });
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    await prisma.trip.update({
      where: { id: tripId },
      data: { shareToken: null },
    });

    res.json({ message: 'Share link revoked' });
  } catch (error) {
    console.error('Revoke share link error:', error);
    res.status(500).json({ message: 'Failed to revoke share link' });
  }
};

// Public: Get shared trip (no auth required)
export const getSharedTrip = async (req, res) => {
  try {
    const { token } = req.params;

    const trip = await prisma.trip.findUnique({
      where: { shareToken: token },
      include: {
        itineraries: { orderBy: { day: 'asc' } },
        expenses: { orderBy: { date: 'desc' } },
        user: { select: { name: true } },
      },
    });

    if (!trip) {
      return res.status(404).json({ message: 'Shared trip not found or link has been revoked' });
    }

    const totalSpent = trip.expenses.reduce((sum, e) => sum + e.amount, 0);

    res.json({
      title: trip.title,
      destination: trip.destination,
      description: trip.description,
      startDate: trip.startDate,
      endDate: trip.endDate,
      budget: trip.budget,
      status: trip.status,
      ownerName: trip.user.name,
      itineraries: trip.itineraries,
      expenses: trip.expenses.map(e => ({
        id: e.id,
        title: e.title,
        amount: e.amount,
        category: e.category,
        currency: e.currency,
        date: e.date,
      })),
      totalSpent,
    });
  } catch (error) {
    console.error('Get shared trip error:', error);
    res.status(500).json({ message: 'Failed to fetch shared trip' });
  }
};
