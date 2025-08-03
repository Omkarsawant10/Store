import { prisma } from '../config/db.js';


export const getAllStores = async (req, res) => {
  try {
    const { search = '', sortBy = 'name', order = 'asc' } = req.query;
    const { userId, role } = req.user;

    
    const validSortFields = ['name', 'email'];
    const validOrder = ['asc', 'desc'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'name';
    const sortDirection = validOrder.includes(order.toLowerCase()) ? order.toLowerCase() : 'asc';

    
    const stores = await prisma.store.findMany({
      where: {
        OR: [
          { name: { contains: search } },
          { address: { contains: search } },
        ]
      },
      include: {
        ratings: true,
        owner: {
          select: { name: true, email: true }
        }
      },
      orderBy: {
        [sortField]: sortDirection
      }
    });

    const result = stores.map(store => {
      const ratingTotal = store.ratings.reduce((acc, cur) => acc + cur.value, 0);
      const avgRating = store.ratings.length ? (ratingTotal / store.ratings.length).toFixed(1) : 'N/A';

      let userRating = null;
      if (role === 'USER') {
        const existing = store.ratings.find(r => r.userId === userId);
        userRating = existing?.value || null;
      }

      return {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        averageRating: avgRating,
        owner: store.owner,
        userSubmittedRating: userRating, 
      };
    });

    res.status(200).json(result);
  } catch (err) {
    console.error('Get Stores Error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};


export const createStore = async (req, res) => {
  try {
    const { name, email, address, ownerId } = req.body;

    if (!name || !email || !address || !ownerId) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const store = await prisma.store.create({
      data: { name, email, address, ownerId }
    });

    res.status(201).json({
      message: 'Store created successfully',
      store
    });
  } catch (err) {
    console.error('Create Store Error:', err);
    res.status(500).json({ message: 'Error creating store' });
  }
};


export const getStoreRatingsByOwner = async (req, res) => {
  try {
    const ownerId = req.user.userId;

    const stores = await prisma.store.findMany({
      where: { ownerId },
      include: {
        ratings: {
          include: {
            user: {
              select: { name: true, email: true }
            }
          }
        }
      }
    });

    const result = stores.map(store => ({
      storeId: store.id,
      storeName: store.name,
      ratings: store.ratings.map(rating => ({
        user: rating.user,
        value: rating.value
      })),
      averageRating: store.ratings.length
        ? (store.ratings.reduce((acc, cur) => acc + cur.value, 0) / store.ratings.length).toFixed(1)
        : 'N/A'
    }));

    res.status(200).json(result);
  } catch (err) {
    console.error('Owner Ratings Error:', err);
    res.status(500).json({ message: 'Error fetching ratings' });
  }
};
