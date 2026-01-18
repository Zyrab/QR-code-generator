import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, type User } from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  deleteDoc, 
  doc, 
  updateDoc, 
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export const loginGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    console.error("Google Login failed", error);
    throw error;
  }
};

export const logoutUser = () => signOut(auth);

// --- Extended Saving Logic ---

export interface QRCodeData {
  type: 'url' | 'wifi' | 'vcard' | 'text'; 
  content: {
    url?: string;
    text?: string;
    ssid?: string;
  };
  design: {
    color: string;
    bgColor: string;
    style: string;
    logoStyle: string;
    eyeFrame: string;
    eyeBall: string;
    logo: string | null; 
  };
  name: string;
}

export const saveToDashboard = async (user: User | null, data: QRCodeData) => {
  if (!user) throw new Error("User not authenticated");

  // SAFETY CHECK: Firestore Document Size Limit is 1MB
  if (data.design.logo && data.design.logo.length > 800000) {
    throw new Error("Logo image is too large for database storage. Please resize below 500KB.");
  }

  try {
    await addDoc(collection(db, "qrcodes"), {
      uid: user.uid,
      type: data.type,
      content: data.content,
      design: data.design,
      name: data.name || "Untitled QR",
      // serverTimestamp() tells the server to insert the time IT receives the request
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
};

export const updateQrCode = async (id: string, data: Partial<QRCodeData>) => {
  try {
    const docRef = doc(db, "qrcodes", id);
    const payload = {
      ...data,
      // Only update the modified time
      updatedAt: serverTimestamp()
    };
    await updateDoc(docRef, payload);
  } catch (e) {
    console.error("Error updating document: ", e);
    throw e;
  }
};

export const deleteQrCode = async (id: string) => {
  try {
    await deleteDoc(doc(db, "qrcodes", id));
  } catch (e) {
    console.error("Error deleting document: ", e);
    throw e;
  }
};

export const fetchHistory = async (user: User | null) => {
  if (!user) return [];
  try {
    const q = query(collection(db, "qrcodes"), where("uid", "==", user.uid));
    const snapshot = await getDocs(q);
    
    // Convert Firestore Timestamps back to simple Strings for the UI
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return { 
        id: doc.id, 
        ...data,
        // Helper: Check if it's a Firestore Timestamp (has .toDate) and convert to ISO string
        // This handles cases where data might still be a string (legacy data) or a Timestamp (new data)
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt,
        updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : data.updatedAt,
      };
    });
  } catch (e) {
    console.error("Error fetching history: ", e);
    return [];
  }
};

export { app, auth, db };