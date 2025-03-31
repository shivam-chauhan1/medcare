import {
  getTotalReviewRecords,
  getPaginatedReviews,
  getTotalUnreviewedAppointments,
  getUnreviewedAppointments,
  createReview,
} from "../model/reviewModel.js";

export const getDoctorReviews = async (req, res) => {
  try {
    const { id: doctorId } = req.params;
    const { pageNo = 1 } = req.query;

    const parsedPageNo = parseInt(pageNo, 10);
    const pageSize = 6;
    let totalRecords, data;

    if (parsedPageNo === 1) {
      totalRecords = await getTotalReviewRecords(doctorId);
      data = await getPaginatedReviews(doctorId, parsedPageNo, pageSize);
    } else {
      data = await getPaginatedReviews(doctorId, parsedPageNo, pageSize);
      totalRecords = data.length;
    }

    res.json({
      totalRecords,
      totalPages: Math.ceil(totalRecords / pageSize),
      currentPage: parsedPageNo,
      data,
    });
  } catch (error) {
    console.error("Error fetching doctor reviews:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getUnreviewedCompletedAppointments = async (req, res) => {
  try {
    const { id: doctorId } = req.params;
    const userId = req.user.user_id;
    console.log(req.params);
    const { pageNo = 1 } = req.query;

    const parsedPageNo = parseInt(pageNo);
    const pageSize = 6;

    let totalRecords, data;

    if (parsedPageNo === 1) {
      totalRecords = await getTotalUnreviewedAppointments(userId, doctorId);
      data = await getUnreviewedAppointments(
        userId,
        doctorId,
        parsedPageNo,
        pageSize
      );
    } else {
      data = await getUnreviewedAppointments(
        userId,
        doctorId,
        parsedPageNo,
        pageSize
      );
      totalRecords = data.length;
    }

    res.json({
      totalRecords,
      totalPages: Math.ceil(totalRecords / pageSize),
      currentPage: parsedPageNo,
      data,
    });
  } catch (error) {
    console.error("Error fetching unreviewed completed appointments:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const postReview = async (req, res) => {
  try {
    const { id: doctorId, appointment_id: appointmentId } = req.params;
    const userId = req.user.user_id;
    const { rating, comment } = req.body;
    console.log(req.params);
    console.log(req.body);
    // validate inputs
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5." });
    }

    if (!comment || comment.trim().length === 0) {
      return res.status(400).json({ error: "Comment cannot be empty." });
    }

    // call model function to insert review
    const review = await createReview(doctorId, appointmentId, rating, comment);

    res.status(201).json({ message: "Review added successfully", review });
  } catch (error) {
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};
