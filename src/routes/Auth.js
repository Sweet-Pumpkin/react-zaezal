import React, { useState } from 'react'
import { authService } from '../firebaseApp';

import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
} from 'firebase/auth';

export default function Auth() {
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

  const onSocialClick = async (e) => {
    const { target: { name } } = e;
    let provider;
    
    if (name === "google") {
      provider = new GoogleAuthProvider();
    } else if (name === "github") {
      provider = new GithubAuthProvider();
    }

    const data = await signInWithPopup(authService, provider);
    console.log(data);
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input name="email" type="email" placeholder='Email' value={email} onChange={onChange} required />
        <input name="pw" type="password" placeholder='Password' value={pw} onChange={onChange} required />
        <input type="submit" value={newAccount ? "Create Account" : "Log in"} />
        {error}
      </form>
      <span onClick={toggleAcount}>{newAccount ? "Sign in" : "Create Account"}</span>
      <div>
        <button name="google" onClick={onSocialClick}>Continue with Google</button>
        <button name="github" onClick={onSocialClick}>Continue with Github</button>
      </div>
    </div>
  )
}
