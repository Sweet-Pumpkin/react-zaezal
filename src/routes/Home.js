import React, { useEffect, useState } from 'react'

import { addDoc, collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from "uuid";

import { DB, storage } from '../firebaseApp';

import Tweet from '../components/Tweet';

export default function Home({ userObj }) {
  const [tweet, setTweet] = useState("");
  const [tweets, setTweets] = useState([]);

  // image URL
  const [fileURL, setFileURL] = useState(""); 

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
    
    // uploading img
    let downloadFile = "";
    if (fileURL !== "") {
      const fileRef = ref(storage, `${userObj.uid}/${uuidv4()}`);
      const res = await uploadString(fileRef, fileURL, "data_url");
      downloadFile = await getDownloadURL(res.ref);
    }
    
    const tweeter = {
      text: tweet,
      createdAt: Date.now(),
      createrId: userObj.uid,
      downloadFile
    }

    try {
       await addDoc(collection(DB, "tweets"), tweeter);
     } catch (error) {
       console.log(error)
     }

    setTweet("");
    setFileURL("");
  }

  const onChange = e => {
    const { target: {value} } = e;
    setTweet(value);
  }

  // File
  const onFileChange = e => {
    const { target: { files }, } = e;
    const theFile = files[0];

    // using FileReader API
    const reader = new FileReader();
    reader.onloadend = finishedEvent => {
      const { currentTarget: { result } } = finishedEvent
      setFileURL(result);
    }
    reader.readAsDataURL(theFile);
  }

  // Clear img preview
  const onClearFileURL = () => {
    setFileURL("");
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input type="text" placeholder="What's on your mind?" value={tweet} onChange={onChange} maxLength={120}/>
        <input type="file" accept="image/*" onChange={onFileChange} />
        <input type="submit" value="Tweet" />
        {
          fileURL && (
            <>
              <img src={fileURL} width="50px" height="50px" alt="img" />
              <button onClick={onClearFileURL}>Cancel</button>
            </>
          )
        }
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
