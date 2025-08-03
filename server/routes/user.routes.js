import express from 'express';
import {
  updatePassword,
  submitRating,
  updateRating
} from '../controllers/user.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { allowRoles } from '../middleware/role.middleware.js';



export const userrouter = express.Router();


userrouter.put('/update-password', requireAuth, allowRoles('USER'), updatePassword);

userrouter.post('/rate', requireAuth, allowRoles('USER'), submitRating);
userrouter.put('/rate', requireAuth, allowRoles('USER'), updateRating);

