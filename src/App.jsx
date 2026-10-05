import { Suspense, lazy } from "react";
import { useSelector } from "react-redux";
import { Box, Typography, CircularProgress } from "@mui/material";
import { Psychology as BrainIcon } from "@mui/icons-material";
import Navbar from "./components/Navbar";

const Unauthorized = lazy(() => import("./components/Unauthorized"));
const Home = lazy(() => import("./components/Home"));

// Hoist static loader component per vercel-react-best-practices (rendering-hoist-jsx)
const AppFallback = () => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "calc(100vh - 70px)",
      gap: 2,
    }}
  >
    <Box
      sx={{
        width: 64,
        height: 64,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)",
        color: "white",
        boxShadow: "0 8px 24px rgba(79, 70, 229, 0.3)",
      }}
      className="pulse-glow"
    >
      <BrainIcon sx={{ fontSize: 36 }} />
    </Box>
    <Typography variant="h6" fontWeight="700" color="text.primary">
      Linguist<span style={{ color: "#4f46e5" }}>IQ</span>
    </Typography>
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mt: 1 }}>
      <CircularProgress size={16} thickness={5} sx={{ color: "primary.main" }} />
      <Typography variant="body2" color="text.secondary">
        Initializing workspace...
      </Typography>
    </Box>
  </Box>
);

function App() {
  // Subscribe to derived boolean state per vercel-react-best-practices (rerender-derived-state)
  const isAuthenticated = useSelector((state) => Boolean(state.auth.user));

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Navbar />
      <Suspense fallback={<AppFallback />}>
        {isAuthenticated ? <Home /> : <Unauthorized />}
      </Suspense>
    </Box>
  );
}

export default App;
