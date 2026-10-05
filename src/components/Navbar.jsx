import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
  Container,
  Avatar,
  Button,
  Divider,
  Chip,
  Tooltip,
} from "@mui/material";
import {
  Psychology as BrainIcon,
  Google as GoogleIcon,
  Logout as LogoutIcon,
  KeyboardArrowDown as ArrowDownIcon,
} from "@mui/icons-material";
import defaultProfile from "../assets/profile.png";
import { setUser, clearUser } from "../app/slices/authSlice";
import { auth, provider } from "./firebase";

function Navbar() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleSignIn = async () => {
    setIsSigningIn(true);
    try {
      const result = await auth.signInWithPopup(provider);
      dispatch(setUser(result.user));
    } catch (error) {
      console.error("Sign-in failed:", error);
      alert(error.message);
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      dispatch(clearUser());
    } catch (error) {
      console.error("Sign-out failed:", error);
      alert(error.message);
    } finally {
      handleCloseUserMenu();
    }
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: "rgba(255, 255, 255, 0.85)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid",
        borderColor: "divider",
        color: "text.primary",
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ minHeight: { xs: 64, sm: 70 }, py: 0.5 }}>
          {/* Brand Logo & Name */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              textDecoration: "none",
              cursor: "pointer",
            }}
          >
            <Box
              sx={{
                width: { xs: 36, sm: 40 },
                height: { xs: 36, sm: 40 },
                borderRadius: 2.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)",
                color: "white",
                boxShadow: "0 4px 12px rgba(79, 70, 229, 0.25)",
              }}
            >
              <BrainIcon sx={{ fontSize: { xs: 22, sm: 24 } }} />
            </Box>
            <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
              <Typography
                variant="h6"
                component="div"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: "1.2rem", sm: "1.35rem" },
                  letterSpacing: "-0.02em",
                  color: "#0f172a",
                }}
              >
                Linguist<span style={{ color: "#4f46e5" }}>IQ</span>
              </Typography>
              <Chip
                label="AI Studio"
                size="small"
                sx={{
                  display: { xs: "none", sm: "inline-flex" },
                  height: 20,
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  bgcolor: "rgba(79, 70, 229, 0.08)",
                  color: "#4f46e5",
                  border: "1px solid rgba(79, 70, 229, 0.2)",
                }}
              />
            </Box>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          {/* User actions */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            {user ? (
              <>
                <Tooltip title="Account menu">
                  <Button
                    onClick={handleOpenUserMenu}
                    variant="outlined"
                    sx={{
                      p: { xs: 0.5, sm: "4px 12px 4px 6px" },
                      borderColor: "divider",
                      borderRadius: 9999,
                      color: "text.primary",
                      bgcolor: "background.paper",
                      "&:hover": {
                        borderColor: "primary.light",
                        bgcolor: "grey.50",
                      },
                    }}
                  >
                    <Avatar
                      alt={user.displayName || "User"}
                      src={user.photoURL || defaultProfile}
                      sx={{ width: 32, height: 32, mr: { xs: 0, sm: 1 } }}
                    />
                    <Typography
                      variant="body2"
                      fontWeight="600"
                      sx={{
                        display: { xs: "none", sm: "block" },
                        maxWidth: 140,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {user.displayName || "Learner"}
                    </Typography>
                    <ArrowDownIcon
                      sx={{
                        fontSize: 18,
                        color: "text.secondary",
                        display: { xs: "none", sm: "block" },
                        ml: 0.5,
                      }}
                    />
                  </Button>
                </Tooltip>

                <Menu
                  sx={{ mt: 1.5 }}
                  id="menu-appbar-user"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                  PaperProps={{
                    sx: {
                      borderRadius: 3,
                      minWidth: 220,
                      p: 1,
                      boxShadow: "0 10px 30px rgba(15, 23, 42, 0.1)",
                      border: "1px solid",
                      borderColor: "divider",
                    },
                  }}
                >
                  <Box sx={{ px: 1.5, py: 1 }}>
                    <Typography variant="subtitle2" fontWeight="700">
                      {user.displayName || "Learner"}
                    </Typography>
                    {user.email ? (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "block", wordBreak: "break-all" }}
                      >
                        {user.email}
                      </Typography>
                    ) : null}
                  </Box>
                  <Divider sx={{ my: 0.5 }} />
                  <MenuItem
                    onClick={handleSignOut}
                    sx={{
                      borderRadius: 1.5,
                      gap: 1.5,
                      color: "error.main",
                      "&:hover": { bgcolor: "error.50" },
                    }}
                  >
                    <LogoutIcon fontSize="small" />
                    <Typography variant="body2" fontWeight="600">
                      Sign Out
                    </Typography>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                variant="contained"
                startIcon={<GoogleIcon />}
                onClick={handleSignIn}
                disabled={isSigningIn}
                sx={{
                  bgcolor: "#0f172a",
                  color: "#ffffff",
                  px: { xs: 1.8, sm: 2.5 },
                  py: 1,
                  fontSize: { xs: "0.85rem", sm: "0.9rem" },
                  fontWeight: 600,
                  borderRadius: 2.5,
                  boxShadow: "0 2px 6px rgba(15, 23, 42, 0.15)",
                  "&:hover": {
                    bgcolor: "#1e293b",
                    boxShadow: "0 4px 12px rgba(15, 23, 42, 0.25)",
                  },
                }}
              >
                {isSigningIn ? "Signing in..." : "Sign in with Google"}
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
