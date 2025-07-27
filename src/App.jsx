import { Suspense, lazy } from "react";
import { useSelector } from "react-redux";
import Navbar from "./components/Navbar";

const Unauthorized = lazy(() => import("./components/Unauthorized"));
const Home = lazy(() => import("./components/Home"));

function App() {
  const user = useSelector((state) => state.auth.user);

  return (
    <div>
      <Navbar />
      <Suspense
        fallback={
          <div style={loaderStyle}>
            <div className="spinner"></div>
          </div>
        }
      >
        {user ? <Home /> : <Unauthorized />}
      </Suspense>
    </div>
  );
}

export default App;

const loaderStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh", // Full height of the viewport
  backgroundColor: "#f9f9f9",
};
