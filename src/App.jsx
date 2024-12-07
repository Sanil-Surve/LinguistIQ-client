import React from "react";
import { useSelector } from "react-redux";
import Navbar from "./components/Navbar";
import Unauthorized from "./components/Unauthorized";
import Home from "./components/Home";

function App() {

  const user = useSelector((state) => state.auth.user);

  return (
    <div>
      <Navbar />

      {user ? (
        <Home />
      ) : (
        <Unauthorized />
      )}
    </div>
  );
}

export default App;
