// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  User,
  UserCredential,
} from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBjpwh7DwIdgMBl47zmFxazRkmZQ8pNd4Q",
  authDomain: "spacey-1ba5b.firebaseapp.com",
  projectId: "spacey-1ba5b",
  storageBucket: "spacey-1ba5b.firebasestorage.app",
  messagingSenderId: "88737434175",
  appId: "1:88737434175:web:bce01ac5858df4a29ec68a",
  measurementId: "G-79M261YNLY",
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize analytics only in the browser (avoid SSR errors)
let analytics;
if (typeof window !== "undefined") {
  try {
    analytics = getAnalytics(app);
  } catch {
    // analytics may fail in some environments — ignore safely
  }
}

// Initialize Auth and set up Google provider (only Google auth enabled here)
export const auth = getAuth(app);
auth.useDeviceLanguage();

export const googleProvider = new GoogleAuthProvider();

/**
 * Sign in with Google using a popup.
 * Returns the UserCredential on success or throws the error.
 */
export async function signInWithGoogle(): Promise<UserCredential> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result;
  } catch (error) {
    throw error;
  }
}

/** Sign out current user */
export async function signOutUser(): Promise<void> {
  await signOut(auth);
}

export default app;