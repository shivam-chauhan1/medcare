import DoctorModel from "../model/doctorModel.js";
import { doctorSchema } from "../utils/validator.js";

// create doctor controller function
export const createDoctor = async (req, res) => {
  try {
    // validate input first
    const { error } = doctorSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const validationErrors = error.details.map((detail) => detail.message);
      return res.status(400).json({
        message: "Validation error",
        details: validationErrors,
      });
    }

    // destructuring
    const {
      name,
      email,
      experience_year,
      degree,
      biography,
      photo_url,
      location,
      average_rating,
      specialty,
      disease,
      gender,
    } = req.body;

    // prepare the doctor data
    const doctorData = {
      name,
      email,
      experience_year: experience_year || 0,
      degree,
      biography: biography || null,
      photo_url: photo_url || null,
      location: location || null,
      average_rating: average_rating || 0,
      specialty,
      disease,
      gender,
    };
    console.log(doctorData);
    // create doctor
    const newDoctor = await DoctorModel.createDoctor(doctorData);

    // respond with created doctor details
    res.status(201).json({
      message: "Doctor created successfully",
      doctor: {
        doctor_id: newDoctor.doctor_id,
        name: doctorData.name,
        email: doctorData.email,
        created_at: newDoctor.created_at,
      },
    });
  } catch (error) {
    console.error("Create doctor error:", error);

    // handle specific error cases
    if (error.message === "Email already exists") {
      return res.status(409).json({
        error: "Email already exists",
      });
    }

    res.status(500).json({
      error: "Failed to create doctor",
      details: error.message,
    });
  }
};

// edit doctor controller function
export const editDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const updateData = req.body;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        error: "No update data provided",
      });
    }

    // validate input
    const { error } = doctorSchema
      .fork(["name", "email", "degree"], (schema) => schema.optional())
      .validate(updateData, { abortEarly: false });

    if (error) {
      const validationErrors = error.details.map((detail) => detail.message);
      return res.status(400).json({
        message: "Validation error",
        details: validationErrors,
      });
    }

    // prepare update data
    const filteredUpdateData = {};
    const allowedFields = [
      "name",
      "email",
      "experience_year",
      "degree",
      "biography",
      "photo_url",
      "location",
      "average_rating",
      "speciality",
      "disease",
      "gender",
    ];

    allowedFields.forEach((field) => {
      if (updateData[field] !== undefined) {
        filteredUpdateData[field] = updateData[field];
      }
    });

    // update doctor
    const updatedDoctor = await DoctorModel.updateDoctor(
      doctorId,
      filteredUpdateData
    );

    // respond with updated doctor details
    res.status(200).json({
      message: "Doctor updated successfully",
      doctor: {
        doctor_id: updatedDoctor.doctor_id,
        name: updatedDoctor.name,
        email: updatedDoctor.email,
        updated_at: updatedDoctor.updated_at,
      },
    });
  } catch (error) {
    console.error("Edit doctor error:", error);

    // handle specific error cases
    if (error.message === "Doctor not found") {
      return res.status(404).json({
        error: "Doctor not found",
      });
    }

    if (error.message === "Email already exists") {
      return res.status(409).json({
        error: "Email already exists",
      });
    }

    res.status(500).json({
      error: "Failed to update doctor",
      details: error.message,
    });
  }
};

// remove doctor controller function
export const removeDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;

    // validate doctor ID format
    if (!doctorId) {
      return res.status(400).json({
        error: "Doctor ID is required",
      });
    }

    // validate UUID format
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(doctorId)) {
      return res.status(400).json({
        error: "Invalid doctor ID format",
      });
    }

    // attempt to remove doctor
    const removedDoctor = await DoctorModel.removeDoctor(doctorId);

    // respond with success message
    res.status(200).json({
      message: "Doctor removed successfully",
      doctor: {
        doctor_id: removedDoctor.doctor_id,
        name: removedDoctor.name,
        email: removedDoctor.email,
      },
    });
  } catch (error) {
    console.error("Remove doctor error:", error);

    // handle specific error cases
    if (error.message === "Doctor not found") {
      return res.status(404).json({
        error: "Doctor not found",
      });
    }

    res.status(500).json({
      error: "Failed to remove doctor",
      details: error.message,
    });
  }
};

export const getDoctorDetail = async (req, res) => {
  try {
    const doctor_id = req.params.doctorId;

    const doctor = await DoctorModel.getDoctorById(doctor_id);

    res.status(200).json({
      message: "Doctor detail retrieve successfully",
      doctor,
    });
  } catch (error) {
    console.error("retrieval doctor error by id :", error);

    // handle specific error cases
    if (error.message === "Doctor not found") {
      return res.status(404).json({
        error: "Doctor not found",
      });
    }

    res.status(500).json({
      error: "failed to retrieve doctor detail",
      details: error.message,
    });
  }
};

export const searchDoctors = async (req, res) => {
  try {
    // extract query parameters
    const { gender, experience, rating, search, pageNo = 1 } = req.query;

    const doctor_name = search;
    const specialty = search;
    const disease = search;
    console.log("---------");
    console.log(doctor_name, specialty, disease);
    const filters = {
      gender,
      experience: experience,
      rating: rating
        ? rating.toLowerCase() == "all"
          ? null
          : parseFloat(rating)
        : null,
      doctor_name,
      specialty,
      disease,
    };

    const parsedPageNo = parseInt(pageNo);
    const pageSize = 6;
    // get total records count only for the first page
    const totalRecords =
      parsedPageNo === 1
        ? await DoctorModel.getTotalDoctorRecords(filters)
        : null;

    // fetch paginated data
    const data = await DoctorModel.getFilteredDoctors(
      filters,
      parsedPageNo,
      pageSize
    );
    res.json({
      totalRecords: totalRecords ?? data.length,
      totalPages: Math.ceil((totalRecords ?? data.length) / pageSize),
      currentPage: parsedPageNo,
      data,
    });
  } catch (error) {
    console.error("Error searching doctors:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default { createDoctor, editDoctor, removeDoctor, searchDoctors };
