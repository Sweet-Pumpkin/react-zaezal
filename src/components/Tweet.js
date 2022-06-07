import React, { useState } from 'react';
import { DB } from '../firebaseApp';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';

export default function Tweet({ tweetObj, isOwner }) {
  const [editing, setEditing] = useState(false);
  const [newTweet, setNewTweet] = useState(tweetObj.text);
  
  const TweetTextRef = doc(DB, "tweets", tweetObj.id);

  const onDeleteClick = async () => {
    const ok = window.confirm("Are you sure you want to delete this tweet?");

    if (ok) {
      await deleteDoc(TweetTextRef);
    }
  }

  const onSubmit = async e => {
    e.preventDefault();
    await updateDoc(TweetTextRef, {text: newTweet});
    setEditing(false);
  }

  const toggleEditing = () => setEditing(prev => !prev);

  const onChange = e => {
    const { target: {value} } = e;
    setNewTweet(value)
  }

  return (
    <>
      {
        editing ? (
          <>
            <form onSubmit={onSubmit}>
              <input type="text" placeholder="Edit your tweet" value={newTweet} onChange={onChange} required />
              <input type="submit" value="Update Tweet" />
            </form>
            <button onClick={toggleEditing}>Cancel</button>
          </>
        ) : (
          <>
            <h4>{tweetObj.text}</h4>
            { isOwner &&
              <>
                <button onClick={onDeleteClick}>Delete Tweet</button>
                <button onClick={toggleEditing}>Edit Tweet</button>
              </>
            }
          </>
        )
      }
    </>
  )
}
