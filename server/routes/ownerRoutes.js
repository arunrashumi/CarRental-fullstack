import express from "express";

import { protect } from "../middleware/auth.js";
import upload from "../middleware/multer.js";
import {
	addCar,
	changeRoleToOwner,
	deleteCar,
	getDashboardData,
	getOwnerCars,
	toggleCarAvailability,
	updateUserImage,
	updateCarPrice
} from "../controllers/ownerController.js";
import { getAllUserFraudScores } from "../controllers/fraudController.js";

const ownerRouter = express.Router();

ownerRouter.post("/update-car-price", protect, updateCarPrice)

ownerRouter.post("/change-role", protect, changeRoleToOwner)
ownerRouter.post("/add-car", upload.single("image"), protect, addCar)
ownerRouter.get("/cars", protect, getOwnerCars)
ownerRouter.post("/toggle-car", protect, toggleCarAvailability)
ownerRouter.post("/delete-car", protect, deleteCar)

ownerRouter.get('/dashboard', protect, getDashboardData)
ownerRouter.post('/update-image', upload.single("image"), protect, updateUserImage)
ownerRouter.get('/fraud-scores', protect, getAllUserFraudScores)

export default ownerRouter;