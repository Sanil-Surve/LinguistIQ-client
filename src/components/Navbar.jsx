import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
// import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
// import Button from '@mui/material/Button';
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { useDispatch, useSelector } from "react-redux";
import { setUser, clearUser } from "../app/slices/authSlice";
import { auth, provider } from "./firebase";

function Navbar() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  // const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  // const handleOpenNavMenu = (event) => {
  //   setAnchorElNav(event.currentTarget);
  // };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  // const handleCloseNavMenu = () => {
  //   setAnchorElNav(null);
  // };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleSignIn = () => {
    auth
      .signInWithPopup(provider)
      .then((result) => {
        dispatch(setUser(result.user));
        console.log("User signed in:", result.user);
      })
      .catch((error) => alert(error.message));
    handleCloseUserMenu();
  };

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        dispatch(clearUser());
        console.log("User signed out");
      })
      .catch((error) => alert(error.message));
    handleCloseUserMenu();
  };

  const settings = user ? ["Logout"] : ["Sign Up"];

  return (
    <AppBar position="static" sx={{ bgcolor: "rgb(50,96,174)" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontWeight: "bold",
            }}
          >
            LinguistIQ
          </Typography>

          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              flexGrow: 1,
              display: { xs: "flex", md: "none" },
              fontWeight: "bold",
            }}
          >
            LinguistIQ
          </Typography>

          <Box sx={{ flexGrow: 0, ml: "auto" }}>
            <Box sx={{ flexGrow: 0 }}>
              {user && (
                <Typography sx={{ display: "inline", mr: 1 }}>
                  Hi, {user.displayName}!
                </Typography>
              )}
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    alt={user ? user.displayName : ""}
                    src={
                      (user && user?.photoURL) ||
                      "https://e7.pngegg.com/pngimages/342/260/png-clipart-computer-icons-blog-people-shadow-silhouette-tomcat-thumbnail.png"
                    }
                  />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar-user"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem
                    key={setting}
                    onClick={
                      setting === "Sign Up" ? handleSignIn : handleSignOut
                    }
                  >
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Navbar;
