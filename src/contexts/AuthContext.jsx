import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../services/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Configurar persistência
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        console.log("Persistência configurada");
      })
      .catch((error) => {
        console.error("Erro na persistência:", error);
      });

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log(
        "AuthStateChanged:",
        currentUser ? currentUser.email : "null"
      );

      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            setUser({
              uid: currentUser.uid,
              email: currentUser.email,
              ...userDoc.data(),
            });
          } else {
            setUser(currentUser);
          }
        } catch (error) {
          console.error("Erro ao buscar dados do usuário:", error);
          setUser(currentUser);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const register = async (email, password, role = "user") => {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, "users", res.user.uid), {
      email,
      role,
    });
  };

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    return signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
