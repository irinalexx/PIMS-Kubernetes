import functions from "firebase-functions";
import admin from "firebase-admin";
import nodemailer from "nodemailer";

admin.initializeApp();

// ✅ Replace with your email credentials
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "irinalex148@gmail.com", // Your email
    pass: "irinalex148", // Use an App Password, not your email password
  },
});

exports.sendStatusUpdateEmail = functions.firestore
  .document("complaints/{complaintId}")
  .onUpdate(async (change, context) => {
    const newValue = change.after.data();
    const previousValue = change.before.data();

    if (newValue.status !== previousValue.status) {
      const userRef = admin.firestore().doc(`residents/${newValue.userId}`);
      const userSnapshot = await userRef.get();

      if (!userSnapshot.exists) {
        console.log("User not found.");
        return null;
      }

      const userData = userSnapshot.data();
      const userEmail = userData.email; // Ensure user has an email field

      if (!userEmail) {
        console.log("User email not found.");
        return null;
      }

      const mailOptions = {
        from: "irinalex148@gmail.com",
        to: userEmail,
        subject: "Complaint Status Update",
        text: `Your complaint status has been updated to: ${newValue.status}`,
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully to", userEmail);
      } catch (error) {
        console.error("Error sending email:", error);
      }
    }

    return null;
  });
