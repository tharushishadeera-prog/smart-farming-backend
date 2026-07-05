import express from 'express';
import { getAllUsers, addUser, deleteUser, updateUser,getUserProfile } from '../controllers/userController'; // import එක update කරන්න
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', getAllUsers);
router.post('/add', addUser);
router.delete('/delete/:id', deleteUser); // Delete Route
router.put('/update/:id', updateUser);   // Update Route
router.get("/profile", protect, getUserProfile);

export default router;