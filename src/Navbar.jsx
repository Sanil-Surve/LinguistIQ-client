
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser, clearUser } from "./authSlice";
import { auth, provider } from "./firebase";

function Navbar() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const handleSignIn = () => {
    auth
      .signInWithPopup(provider)
      .then((result) => {
        dispatch(setUser(result.user)); // Dispatch action to set user in Redux
        console.log("User signed in:", result.user);
      })
      .catch((error) => alert(error.message));
  };

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        dispatch(clearUser()); // Dispatch action to clear user in Redux
        console.log("User signed out");
      })
      .catch((error) => alert(error.message));
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        <h1 className="text-lg font-bold">LinguistIQ</h1>

        {user ? (
          <div className="flex items-center space-x-3">
            <span className="text-base">Hi,{user.displayName}!</span>
            <img
              src={user.photoURL || "https://via.placeholder.com/40"}
              alt="User Avatar"
              className="w-8 h-8 rounded-full"
            />
            <button
              onClick={handleSignOut}
              className="bg-red-500 hover:bg-red-600 text-white py-1 px-4 rounded"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <button
            onClick={handleSignIn}
            className="bg-blue-500 hover:bg-blue-800 text-white py-1 px-4 rounded"
          >
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;