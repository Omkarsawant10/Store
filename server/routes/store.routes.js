import express from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { allowRoles } from "../middleware/role.middleware.js";
import { createStore, getAllStores, getStoreRatingsByOwner } from "../controllers/store.controller.js";
import {
  updatePassword,
} from '../controllers/user.controller.js';


export const storerouter=express.Router();



storerouter.get('/get', requireAuth, getAllStores);                           
storerouter.post('/create', requireAuth, allowRoles('ADMIN'), createStore); 
storerouter.get('/my-ratings', requireAuth, allowRoles('OWNER'), getStoreRatingsByOwner);
storerouter.put('/update-password', requireAuth, allowRoles('OWNER'), updatePassword);