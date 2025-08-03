import express from 'express';
import {
  createUserByAdmin,
  createStoreByAdmin,
  getDashboardMetrics,
  filterUsers,
  filterStores,
  getUserDetails
} from '../controllers/admin.controller.js';

import { requireAuth } from '../middleware/auth.middleware.js';
import { allowRoles } from '../middleware/role.middleware.js';

export const adminrouter = express.Router();


adminrouter.use(requireAuth, allowRoles('ADMIN'));


adminrouter.get('/dashboard', getDashboardMetrics);


adminrouter.post('/create-user', createUserByAdmin);


adminrouter.post('/create-store', createStoreByAdmin);


adminrouter.get('/users', filterUsers);


adminrouter.get('/stores', filterStores);


adminrouter.get('/user/:id', getUserDetails);


