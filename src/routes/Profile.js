import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

import { authService, DB } from '../firebaseApp'
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';

import Tweet from '../components/Tweet';

export default function Profile({ userObj, refreshUser }) {
  const navigate = useNavigate();
  
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const [myTweets, setMyTweets] = useState([]);

  const onLogOutClick = () => {
    authService.signOut();
    navigate("/");
  }

  useEffect(() => {
    const myTweets = query(
      collection(DB, "tweets"), 
      where("createrId", "==", userObj.uid),
      orderBy("createdAt")
    );
    onSnapshot(myTweets, (snapshot) => {
      const myTweetArr = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }))
      setMyTweets(myTweetArr);
    })
  }, [userObj]);

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
      {
        myTweets.map(tweet => (
          <Tweet key={tweet.id} tweetObj={tweet} isOwner={tweet.createrId === userObj.uid} />
        ))
      }
    </>
  )
}
