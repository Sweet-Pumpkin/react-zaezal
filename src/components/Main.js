import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "../routes/Auth";
import Home from "../routes/Home";
import Profile from "../routes/Profile";
import Navigation from "./Navigation";

export default function Router({ isLogin, userObj, refreshUser, }) {
  return (
    <BrowserRouter>
      {isLogin && <Navigation userObj={userObj} />}
      <Routes>
        { isLogin ? 
          <>
            <Route path="/" element={<Home userObj={userObj} />} /> 
            <Route path="/profile" element={<Profile userObj={userObj} refreshUser={refreshUser} />} />
          </>
          :
          <Route path="/" element={<Auth />} /> 
        }
      </Routes>
    </BrowserRouter>
  );
}