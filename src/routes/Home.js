import React, { useEffect, useState } from 'react'
import { DB } from '../firebaseApp';
import { addDoc, collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import Tweet from '../components/Tweet';

export default function Home({ userObj }) {
  const [tweet, setTweet] = useState("");
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

  const onSubmit = async e => {
    e.preventDefault();
    try {
      await addDoc(collection(DB, "tweets"), {
        text: tweet,
        createdAt: Date.now(),
        createrId: userObj.uid,
      });
    } catch (error) {
      console.log(error)
    }
    setTweet("");
  }
  const onChange = e => {
    const { target: {value} } = e;
    setTweet(value);

  }
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input type="text" placeholder="What's on your mind?" value={tweet} onChange={onChange} maxLength={120}/>
        <input type="submit" value="Tweet" />
      </form>
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
