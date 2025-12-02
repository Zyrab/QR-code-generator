import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, query, where } from "firebase/firestore/lite";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const loginGoogle = async () => {
  try {
    await signInWithPopup(auth, provider);
  } catch (error) {
    console.error("Login failed", error);
    alert("Login failed: " + error.message);
  }
};

export const logoutUser = () => signOut(auth);

export const saveQrToHistory = async (user, text, logoBase64 = null) => {
  if (!user) return;
  try {
    await addDoc(collection(db, "qrcodes"), {
      uid: user.uid,
      text: text,
      logoBase64: logoBase64,
      createdAt: new Date().toISOString(),
    });
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

export const fetchHistory = async (user) => {
  if (!user) return [];
  const q = query(collection(db, "qrcodes"), where("uid", "==", user.uid));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};
