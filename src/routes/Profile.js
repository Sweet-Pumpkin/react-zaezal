import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

import { authService, DB } from '../firebaseApp'
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';

export default function Profile({ userObj, refreshUser }) {
  const navigate = useNavigate();
  
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);

  const onLogOutClick = () => {
    authService.signOut();
    navigate("/");
  }

  const getMyTweets = async () => {
    const tweets = await query(
      collection(DB, "tweets"), 
      where("createrId", "==", userObj.uid),
      orderBy("createdAt")
    );
    const querySnapshot = await getDocs(tweets);
    console.log(querySnapshot.docs.map(doc => doc.data()));
  }

  useEffect(() => {
    getMyTweets();
  }, []);

  const onChange = e => {
    const { target: { value } } = e;
    setNewDisplayName(value);
  }

  const onSubmit = async e => {
    e.preventDefault();
    if (userObj.displayName !== newDisplayName) {
      await updateProfile(authService.currentUser, {displayName: newDisplayName});
      refreshUser();
    }
  }

  return (
    <>
      <form onSubmit={onSubmit}>
        <input type="text" value={newDisplayName} onChange={onChange} />
        <input type="submit" value="Update Profile" />
      </form>
      <button onClick={onLogOutClick}>Log Out</button>
    </>
  )
}
