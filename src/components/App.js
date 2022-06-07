import React, { useEffect, useState } from 'react'
import Router from './Main'

import { getAuth, onAuthStateChanged } from "firebase/auth";
import { authService } from '../firebaseApp';

export default function App() {
  const [init, setInit] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [userObj, setUserObj] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLogin(true);
        setUserObj(user);
      } else {
        setIsLogin(false);
      }
      setInit(true);
    })
  }, []);

  const refreshUser = () => {
    const user = authService.currentUser;
    setUserObj({
      ...user
    });
  }

  return (
    <>
      {init ? <Router isLogin={isLogin} userObj={userObj} refreshUser={refreshUser} /> : "Initializing..."}
      <footer>
        &copy; React-Twitter {new Date().getFullYear()}
      </footer>
    </>
  )
}
