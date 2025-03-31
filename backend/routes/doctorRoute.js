import express from "express";
import isAuth from "../middleware/isAuth.js";
import isAdmin from "../middleware/isAdmin.js";
import reviewRouter from "../routes/reviewRoute.js";
import { bookAppointment } from "../controllers/appointmentController.js";
import {
  addSchedule,
  fetchAvailabilityByDate,
} from "../controllers/availabilityController.js";
import {
  createDoctor,
  editDoctor,
  removeDoctor,
  getDoctorDetail,
  searchDoctors,
} from "../controllers/doctorController.js";

const router = express.Router();

// create doctor route
router.use(isAuth);
router.get("/availability", fetchAvailabilityByDate);

// get all reviewed data

router.use("/doctor/", reviewRouter);

// search
router.get("/doctor/search", searchDoctors);
// get doctor detail
router.get("/doctor/:doctorId", getDoctorDetail);

// book appointment
router.post("/doctor/:id/booking", bookAppointment);

router.post("/createDoctor", isAdmin, createDoctor);

// edit doctor route
router.patch("/updateDoctor/:doctorId", isAdmin, editDoctor);

// remove doctor route
router.delete("/removeDoctor/:doctorId", isAdmin, removeDoctor);

// add doctor schedule
router.post("/doctor/:doctorId/addSchedule", isAdmin, addSchedule);
export default router;
