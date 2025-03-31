import { Router } from "express";
import isAdmin from "../middleware/isAdmin.js";
import isAuth from "../middleware/isAuth.js";
import {
  getApprovals,
  patchAppointmentStatus,
} from "../controllers/approvalController.js";
const router = Router();

router.use(isAuth);
router.use(isAdmin);

router.get("/approval", getApprovals);
router.patch("/approval/:appointment_id", patchAppointmentStatus);
export default router;
