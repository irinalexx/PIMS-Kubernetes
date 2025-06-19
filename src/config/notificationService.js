import { messaging } from "./firebase";
import { getToken } from "firebase/messaging";
import { doc, setDoc } from "firebase/firestore";
import { db, auth } from "./firebase";

// ✅ Replace with your Web Push VAPID Key from Firebase
const VAPID_KEY = "YOUR_PUBLIC_VAPID_KEY";

export const requestFCMToken = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await getToken(messaging, { vapidKey: VAPID_KEY });

      if (token) {
        console.log("FCM Token:", token);

        // ✅ Store token in Firestore under the logged-in user's document
        const user = auth.currentUser;
        if (user) {
          await setDoc(doc(db, "residents", user.uid), { fcmToken: token }, { merge: true });
        }

        return token;
      } else {
        console.warn("No FCM token received.");
      }
    } else {
      console.warn("Permission for notifications denied.");
    }
  } catch (error) {
    console.error("Error getting FCM token:", error);
  }
};
