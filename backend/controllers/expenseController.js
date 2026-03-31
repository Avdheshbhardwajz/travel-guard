import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const addExpense = async (req, res) => {
  try {
    const tripId = parseInt(req.params.tripId);
    const { title, amount, category, date } = req.body;

    if (!title || !amount) {
      return res.status(400).json({ message: 'Title and amount are required' });
    }

    // Verify trip belongs to user
    const trip = await prisma.trip.findFirst({
      where: { id: tripId, userId: req.user.id },
    });
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    const expense = await prisma.expense.create({
      data: {
        title,
        amount: parseFloat(amount),
        category: category || 'other',
        date: date ? new Date(date) : new Date(),
        tripId,
      },
    });

    res.status(201).json(expense);
  } catch (error) {
    console.error('Add expense error:', error);
    res.status(500).json({ message: 'Failed to add expense' });
  }
};

export const getExpenses = async (req, res) => {
  try {
    const tripId = parseInt(req.params.tripId);

    const expenses = await prisma.expense.findMany({
      where: { tripId },
      orderBy: { date: 'desc' },
    });

    const total = expenses.reduce((sum, e) => sum + e.amount, 0);

    res.json({ expenses, total });
  } catch (error) {
    console.error('Get expenses error:', error);
    res.status(500).json({ message: 'Failed to fetch expenses' });
  }
};

export const updateExpense = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { title, amount, category, date } = req.body;

    const expense = await prisma.expense.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(amount !== undefined && { amount: parseFloat(amount) }),
        ...(category !== undefined && { category }),
        ...(date !== undefined && { date: new Date(date) }),
      },
    });

    res.json(expense);
  } catch (error) {
    console.error('Update expense error:', error);
    res.status(500).json({ message: 'Failed to update expense' });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    await prisma.expense.delete({ where: { id } });

    res.json({ message: 'Expense deleted' });
  } catch (error) {
    console.error('Delete expense error:', error);
    res.status(500).json({ message: 'Failed to delete expense' });
  }
};
