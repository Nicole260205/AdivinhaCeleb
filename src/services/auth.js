import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

// REGISTRO
export const register = async (name, email, password, role, avatar) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      name,
      email,
      role, // 'player' ou 'judge'
      avatar, // 🔥 Salvar o avatar
    });

    return user;
  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      throw new Error("Este email já está cadastrado.");
    } else if (error.code === "auth/invalid-email") {
      throw new Error("Email inválido.");
    } else if (error.code === "auth/weak-password") {
      throw new Error("A senha precisa ter pelo menos 6 caracteres.");
    } else {
      throw new Error(
        "Erro ao registrar. Verifique os dados e tente novamente."
      );
    }
  }
};

// LOGIN
export const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    if (error.code === "auth/user-not-found") {
      throw new Error("Usuário não encontrado.");
    } else if (error.code === "auth/wrong-password") {
      throw new Error("Senha incorreta.");
    } else if (error.code === "auth/invalid-email") {
      throw new Error("Email inválido.");
    } else {
      throw new Error(
        "Erro ao fazer login. Verifique os dados e tente novamente."
      );
    }
  }
};

// LOGOUT
export const logout = () => signOut(auth);

// PEGAR DADOS DO USUÁRIO
export const getUserData = async (uid) => {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    throw new Error("Dados do usuário não encontrados.");
  }
};
