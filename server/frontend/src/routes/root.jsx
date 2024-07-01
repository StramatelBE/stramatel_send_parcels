import { BottomNavigation, BottomNavigationAction, Box } from "@mui/material";
import { Link, useLocation } from "react-router-dom";

import useAuthStore from '../stores/authStore';
import LogoutIcon from "@mui/icons-material/Logout";
import PermMediaIcon from "@mui/icons-material/PermMedia";
import SettingsIcon from "@mui/icons-material/Settings";

function Root() {
  const location = useLocation();  
  const { setToken } = useAuthStore();

  function logout() {
    setToken(null);
  }

  const getIconColor = (path) => {
    return location.pathname === path ? "secondary.light" : "secondary.main";
  };

  return (
    <Box sx={{ position: "fixed", bottom: "0", width: "100%" }}>
      <BottomNavigation>
        <BottomNavigationAction
          component={Link}
          to="/dashboard"
          label="Dashboard"
          icon={<PermMediaIcon sx={{ color: getIconColor("/dashboard") }} />}
        />
        <BottomNavigationAction
          component={Link}
          to="/settings"
          label="Paramètres"
          icon={<SettingsIcon sx={{ color: getIconColor("/settings") }} />}
        />
        <BottomNavigationAction
          label="Déconnexion"
          onClick={logout}
          icon={<LogoutIcon sx={{ color: "secondary.main" }} />}
        />
      </BottomNavigation>
    </Box>
  );
}

export default Root;
