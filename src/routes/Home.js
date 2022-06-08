import React, { useEffect, useState } from 'react'

import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';

import { DB } from '../firebaseApp';

import Tweet from '../components/Tweet';
import TweetFactory from '../components/TweetFactory';

export default function Home({ userObj }) {
  
  const [tweets, setTweets] = useState([]);

  

  // getDocs로 DB에서 text 가져오기.
  // const getTweets = async () => {
  //   const DBtweets = await getDocs(query(collection(DB, "tweets")));
  //   DBtweets.forEach(doc => {
  //     const tweetObj = {
  //       ...doc.data(),
  //       id: doc.id,
  //     }
  //     setTweets(prev => [tweetObj, ...prev]);
  //   })
  // }

  useEffect(() => {
  //  getTweets();
  // Realtime으로 DB에서 text 가져오기.
    const q = query(collection(DB, "tweets"), orderBy("createdAt"));
    onSnapshot(q, (snapshot) => {
      const tweetArr = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));  
      setTweets(tweetArr);
    })
  }, []);

  

  return (
    <div>
      <TweetFactory userObj={userObj}/>
      <div>
        { 
          tweets.map(tweet => (
            <Tweet key={tweet.id} tweetObj={tweet} isOwner={tweet.createrId === userObj.uid} />
          ))
        }
      </div>
    </div>
  )
}
