"use client";
import { useContext, createContext, useState, useEffect } from "react";
import {
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  User,
  updateProfile,
} from "firebase/auth";
import { auth } from "../config";

const AuthContext = createContext({
  user: {} as User,
  signUp: async (_email: string, _password: string, _username: string) => {},
  logIn: async (_email: string, _password: string) => {},
  logOut: async () => {},
});

export const AuthContextProvider = ({ children }: any) => {
  //@ts-ignore
  const [user, setUser] = useState<User | null>(null);

  const signUp = (email: string, password: string, username: string) => {
    createUserWithEmailAndPassword(auth, email, password).then((result) => {
      updateProfile(result.user, { displayName: username });
    });
  };

  const logIn = (email: string, password: string) => {
    signInWithEmailAndPassword(auth, email, password);
  };

  const logOut = () => {
    signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [user]);

  return (
    //@ts-ignore
    <AuthContext.Provider value={{ user, signUp, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};
