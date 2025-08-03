import { prisma } from '../config/db.js';
import bcrypt from 'bcryptjs';


export const createUserByAdmin = async (req, res) => {
  const { name, email, password, address, role } = req.body;

  if (!name || !email || !password || !address || !role) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: { name, email, password: hashedPassword, address, role }
    });

    return res.status(201).json({ success: true, message: 'User created', user: newUser });
  } catch (err) {
    console.error('Admin Create User Error:', err);
    return res.status(500).json({ success: false, message: 'Failed to create user' });
  }
};


export const createStoreByAdmin = async (req, res) => {
  const { name, email, address, ownerId } = req.body;

  if (!name || !email || !address || !ownerId) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  try {
    const store = await prisma.store.create({
      data: {
        name,
        email,
        address,
        ownerId: parseInt(ownerId),
      },
    });

    return res.status(201).json({ success: true, message: 'Store created', store });
  } catch (err) {
    console.error('Admin Create Store Error:', err);
    return res.status(500).json({ success: false, message: 'Failed to create store' });
  }
};


export const getDashboardMetrics = async (req, res) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalStores = await prisma.store.count();
    const totalRatings = await prisma.rating.count();

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
      },
    });

    const stores = await prisma.store.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        ratings: {
          select: {
            value: true,
          },
        },
      },
    });

    const storesWithAvgRating = stores.map((store) => {
      const values = store.ratings.map(r => r.value);
      const average =
        values.length > 0
          ? (values.reduce((acc, val) => acc + val, 0) / values.length).toFixed(1)
          : "N/A";

      return {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        rating: average,
      };
    });

    return res.status(200).json({
      success: true,
      stats: { totalUsers, totalStores, totalRatings },
      users,
      stores: storesWithAvgRating,
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard data",
    });
  }
};


export const filterUsers = async (req, res) => {
  const { name = '', email = '', address = '', role } = req.query;

  try {
    const users = await prisma.user.findMany({
      where: {
        name: { contains: name, mode: 'insensitive' },
        email: { contains: email, mode: 'insensitive' },
        address: { contains: address, mode: 'insensitive' },
        ...(role && { role }),
      },
      select: { id: true, name: true, email: true, address: true, role: true },
    });

    return res.status(200).json({ success: true, users });
  } catch (err) {
    console.error('User Filter Error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
};


export const filterStores = async (req, res) => {
  const { name = '', email = '', address = '' } = req.query;

  try {
    const stores = await prisma.store.findMany({
      where: {
        name: { contains: name, mode: 'insensitive' },
        email: { contains: email, mode: 'insensitive' },
        address: { contains: address, mode: 'insensitive' },
      },
      include: {
        ratings: true,
        owner: { select: { name: true, email: true } },
      },
    });

    const formatted = stores.map(store => {
      const total = store.ratings.reduce((acc, r) => acc + r.value, 0);
      const avgRating = store.ratings.length ? (total / store.ratings.length).toFixed(1) : 'N/A';

      return {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        averageRating: avgRating,
        owner: store.owner,
      };
    });

    return res.status(200).json({ success: true, stores: formatted });
  } catch (err) {
    console.error('Store Filter Error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch stores' });
  }
};


export const getUserDetails = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: {
        name: true,
        email: true,
        address: true,
        role: true,
        store: { include: { ratings: true } },
      },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    let averageRating = 'N/A';
    if (user.role === 'OWNER' && user.store?.ratings?.length) {
      const total = user.store.ratings.reduce((sum, r) => sum + r.value, 0);
      averageRating = (total / user.store.ratings.length).toFixed(1);
    }

    return res.status(200).json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role,
        rating: user.role === 'OWNER' ? averageRating : undefined,
      },
    });
  } catch (err) {
    console.error('User Details Error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch user details' });
  }
};
