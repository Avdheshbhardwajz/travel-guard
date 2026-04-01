import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getEmergencyContacts = async (req, res) => {
  try {
    const contacts = await prisma.emergencyContact.findMany({
      where: { userId: req.user.id },
      orderBy: { id: 'asc' },
    });
    res.json(contacts);
  } catch (error) {
    console.error('Get emergency contacts error:', error);
    res.status(500).json({ message: 'Failed to fetch emergency contacts' });
  }
};

export const addEmergencyContact = async (req, res) => {
  try {
    const { name, phone, relationship } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ message: 'Name and phone are required' });
    }

    // Limit to 5 emergency contacts per user
    const count = await prisma.emergencyContact.count({
      where: { userId: req.user.id },
    });
    if (count >= 5) {
      return res.status(400).json({ message: 'Maximum 5 emergency contacts allowed' });
    }

    const contact = await prisma.emergencyContact.create({
      data: {
        name,
        phone,
        relationship: relationship || 'other',
        userId: req.user.id,
      },
    });

    res.status(201).json(contact);
  } catch (error) {
    console.error('Add emergency contact error:', error);
    res.status(500).json({ message: 'Failed to add emergency contact' });
  }
};

export const updateEmergencyContact = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, phone, relationship } = req.body;

    // Verify contact belongs to user
    const existing = await prisma.emergencyContact.findFirst({
      where: { id, userId: req.user.id },
    });
    if (!existing) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    const contact = await prisma.emergencyContact.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(phone !== undefined && { phone }),
        ...(relationship !== undefined && { relationship }),
      },
    });

    res.json(contact);
  } catch (error) {
    console.error('Update emergency contact error:', error);
    res.status(500).json({ message: 'Failed to update emergency contact' });
  }
};

export const deleteEmergencyContact = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const existing = await prisma.emergencyContact.findFirst({
      where: { id, userId: req.user.id },
    });
    if (!existing) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    await prisma.emergencyContact.delete({ where: { id } });

    res.json({ message: 'Emergency contact deleted' });
  } catch (error) {
    console.error('Delete emergency contact error:', error);
    res.status(500).json({ message: 'Failed to delete emergency contact' });
  }
};
