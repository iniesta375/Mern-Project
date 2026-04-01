import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyD26fnLvnlkvUiAKRVDIytf0nZmDQhYkYE",
  authDomain: "medreminder-a.firebaseapp.com",
  projectId: "medreminder-a",
  storageBucket: "medreminder-a.firebasestorage.app",
  messagingSenderId: "473696701805",
  appId: "1:473696701805:web:28d1cd973876f3e034de64"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  const idToken = await result.user.getIdToken();
  return { idToken, user: result.user };
};

export const firebaseSignOut = async () => {
  await signOut(auth);
};