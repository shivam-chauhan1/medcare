import { insertNotification } from "../model/notificationModel.js";
import DoctorModel from "../model/doctorModel.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// function to create transporter for sending emails
const createTransport = () => {
  return nodemailer.createTransport({
    service: "gmail",
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAIL_ID,
      pass: process.env.MAIL_PASS,
    },
  });
};

// function to send notification (insert in DB + send email)
export const sendNotification = async ({
  user_id,
  appointment_id,
  doctor_id,
  booking_type,
  date,
  user_email,
  booking_status,
  startTime,
  endTime,
}) => {
  try {
    // insert notification into DB
    const result = await DoctorModel.getDoctorById(doctor_id);
    const doctor_name = result.name;
    console.log(doctor_name);
    await insertNotification({
      user_id,
      appointment_id,
      message: `Your appointment with Dr. ${doctor_name} for a ${booking_type} consultation is currently ${booking_status}.`,
      type: booking_status,
    });

    console.log("Notification added successfully.");
    let locationValue = result.location;
    console.log(locationValue);
    if (booking_type === "virtual") {
      locationValue = "virtual";
    }
    // Send email
    const transporter = createTransport();
    const emailBody = `
      <h2>Appointment Notification</h2>
      <p>Your appointment status is now <strong>${booking_status}</strong>.</p>
      <p><strong>Appointment ID:</strong> ${appointment_id}</p>
      <p><strong>Doctor:</strong> ${doctor_name}</p>
      <p><strong>Timing: </strong> ${startTime} to ${endTime}</p>
      <p><strong>Date & Time:</strong> ${date}</p>
      <p><strong>Location:</strong> ${locationValue}</p>
      <p><strong>Consultation Type:</strong> ${booking_type}</p>
      <p>Thank you for choosing our service.</p>
    `;

    await transporter.sendMail({
      from: `"Doctor-App" <${process.env.MAIL_ID}>`,
      to: "rajeshsingh2882003@gmail.com",
      subject: "Your Appointment Notification",
      html: emailBody,
    });

    console.log("Email sent successfully.");
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};
