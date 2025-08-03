import { prisma } from '../config/db.js';
import bcrypt from 'bcryptjs';

export const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.userId;

    const user = await prisma.user.findUnique({ where: { id: userId } });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Old password is incorrect' });
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])/;
    if (!passwordRegex.test(newPassword) || newPassword.length < 8 || newPassword.length > 16) {
      return res.status(400).json({
        message: 'Password must be 8-16 characters and include one uppercase and one special character.'
      });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashed }
    });

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Password Update Error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const submitRating = async (req, res) => {
  try {
    const { storeId, value } = req.body;
    const userId = req.user.userId;

    if (!storeId || !value || value < 1 || value > 5) {
      return res.status(400).json({ message: 'Invalid store or rating value' });
    }

    const existing = await prisma.rating.findFirst({
      where: { userId, storeId }
    });

    if (existing) {
      return res.status(409).json({ message: 'You have already rated this store' });
    }

    await prisma.rating.create({
      data: { userId, storeId, value }
    });

    res.status(201).json({ message: 'Rating submitted successfully' });
  } catch (err) {
    console.error('Submit Rating Error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateRating = async (req, res) => {
  try {
    const { storeId, value } = req.body;
    const userId = req.user.userId;

    if (!storeId || !value || value < 1 || value > 5) {
      return res.status(400).json({ message: 'Invalid store or rating value' });
    }

    const rating = await prisma.rating.findFirst({
      where: { userId, storeId }
    });

    if (!rating) {
      return res.status(404).json({ message: 'No rating found to update' });
    }

    await prisma.rating.update({
      where: { id: rating.id },
      data: { value }
    });

    res.status(200).json({ message: 'Rating updated successfully' });
  } catch (err) {
    console.error('Update Rating Error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
