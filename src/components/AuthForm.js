import React, { useState } from 'react'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { authService } from '../firebaseApp';

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");  
  const [newAccount, setNewAccount] = useState(true);
  const [error, setError] = useState("");

  const onChange = (e) => {
    const { target: { name, value } } = e;

    if (name === "email") {
      setEmail(value);
    } else if (name === "pw") {
      setPw(value);
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      let data;
      if (newAccount) {
        data = await createUserWithEmailAndPassword(
          authService, email, pw
        );
      } else {
        data = await signInWithEmailAndPassword(
          authService, email, pw
        );
      }
      console.log(data);
    } catch (error) {
      setError(error.message);
    }
  }

  const toggleAcount = () => setNewAccount(prev => !prev);

  return (
    <>
      <form onSubmit={onSubmit}>
        <input name="email" type="email" placeholder='Email' value={email} onChange={onChange} required />
        <input name="pw" type="password" placeholder='Password' value={pw} onChange={onChange} required />
        <input type="submit" value={newAccount ? "Create Account" : "Log in"} />
        {error}
      </form>
      <span onClick={toggleAcount}>{newAccount ? "Sign in" : "Create Account"}</span>
    </>
  )
}
