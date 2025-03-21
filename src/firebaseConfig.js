import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc
} from "firebase/firestore";

// Configuración del entorno
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Inicio de sesión con Google
const googleProvider = new GoogleAuthProvider();

const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        wishlist: [],
        createdAt: new Date().toISOString()
      });
    }

    return user;
  } catch (error) {
    console.error("Error al iniciar sesión con Google:", error);
    throw new Error("No se pudo iniciar sesión con Google.");
  }
};

// Registro con correo
const registerWithEmail = async (email, password) => {
  try {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);

    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      wishlist: [],
      createdAt: new Date().toISOString()
    });

    return user;
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    throw new Error("No se pudo registrar el usuario.");
  }
};

// Inicio de sesión con correo
const loginWithEmail = async (email, password) => {
  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    return user;
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    throw new Error("Correo o contraseña incorrectos.");
  }
};

// Cierre de sesión
const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  }
};

// Exportaciones
export {
  auth,
  db,
  loginWithGoogle,
  logout,
  registerWithEmail,
  loginWithEmail
};