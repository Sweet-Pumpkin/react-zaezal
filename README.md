## React twitter clone coding

![](./img/twitter-clonecoding.png)

### Version
![Generic badge](https://img.shields.io/badge/React-18.1.0-green.svg)
![Generic badge](https://img.shields.io/badge/ReactDOM-18.1.0-green.svg)
![Generic badge](https://img.shields.io/badge/ReactRouterDOM-6.3.0-green.svg)
![Generic badge](https://img.shields.io/badge/Firebase-9.6.1-green.svg)
![Generic badge](https://img.shields.io/badge/uuid-8.3.2-green.svg)

### Firebase v9
#### Initialize Firebase App
```
// firestoreApp.js
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGIN_ID,
  appId: process.env.REACT_APP_APP_ID,
};

const firebaseApp = initializeApp(firebaseConfig);
```

#### getAuth
```
// firestoreApp.js
import { getAuth } from "firebase/auth";
export const authService = getAuth(firebaseApp);
```

#### Creating Account
```
// AuthForm.js
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { authService } from '../firebaseApp';
// ~~~
let data;
      if (newAccount) {
        data = await createUserWithEmailAndPassword(
          authService, email, pw
        );
      } else {
        data = await signInWithEmailAndPassword(
          authService, email, pw
        );
```

#### Login
```
// App.js
import { getAuth, onAuthStateChanged } from "firebase/auth";
// ~~~
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
```

#### Social Login(Google, Github)
```
// Auth.js
import { authService } from '../firebaseApp';
import { GoogleAuthProvider, GithubAuthProvider,signInWithPopup,} from 'firebase/auth';
// ~~~
const { target: { name } } = e;
    let provider;
    
    if (name === "google") {
      provider = new GoogleAuthProvider();
    } else if (name === "github") {
      provider = new GithubAuthProvider();
    }

    const data = await signInWithPopup(authService, provider);
```

#### Logout
```
// Profile.js
// ~~~
authService.signOut();
```

#### Twitting
```
// firebaseApp.js
import { getFirestore } from "firebase/firestore";
// ~~~
export const DB = getFirestore();

// Home.js
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { DB } from '../firebaseApp';
// ~~~
const q = query(collection(DB, "tweets"), orderBy("createdAt"));
    onSnapshot(q, (snapshot) => {
      const tweetArr = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));  
      setTweets(tweetArr);
    })

// TweetFactory.js
import { addDoc, collection } from 'firebase/firestore';
// ~~~
const tweeter = {
  text: tweet,
  createdAt: Date.now(),
  createrId: userObj.uid,
  downloadFile
}
// ~~~
await addDoc(collection(DB, "tweets"), tweeter)
```

#### Delete&Update Tweet
```
// Tweet.js
import { DB } from '../firebaseApp';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
// ~~~
const TweetTextRef = doc(DB, "tweets", tweetObj.id);
// if delete
await deleteDoc(TweetTextRef);
// if update
await updateDoc(TweetTextRef, {text: newTweet});
```

#### Firebase Storage & Upload File
Firebase Storage Rules Tab
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```
CODE
```
// firebaseApp.js
import { getStorage } from "firebase/storage"; 
// ~~~
export const storage = getStorage();

// TweetFactory.js
import { addDoc, collection } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
// ~~~
let downloadFile = "";
    if (fileURL !== "") {
      const fileRef = ref(storage, `${userObj.uid}/${uuidv4()}`);
      const res = await uploadString(fileRef, fileURL, "data_url");
      downloadFile = await getDownloadURL(res.ref);
```

#### Delete File
```
// Tweet.js
import { ref, deleteObject } from "firebase/storage"
// ~~~
// if Delete file
await deleteObject(ref(storage, tweetObj.downloadFile));
```

### Reference 노마드 코더 트위터 클론 코딩
[![](./img/nomardcoderbg.png)](https://nomadcoders.co/nwitter)
