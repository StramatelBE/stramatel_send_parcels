import { AppBar, Box, Toolbar } from "@mui/material";
import useThemeStore from "../stores/themeStore";

function Header() {
  const { theme, muiTheme } = useThemeStore();
  
  return (
    <AppBar
      sx={{
        justifyContent: "center",
        position: "sticky",
        top: "0",
        marginBottom: "2vh",
        boxShadow: `0 0 4px 0 ${muiTheme.palette.divider}`,
      }}
    >
      <Toolbar
        style={{
          justifyContent: "center",
          padding: "0",
        }}
      >
        <Box
          component="img"
          src={
            theme === "dark"
              ? "/Logo_Stramatel_White.png"
              : "/Logo_Stramatel_Dark.png"
          }
          alt="Logo"
          sx={{ width: "200px", height: "auto" }}
        />
      </Toolbar>
    </AppBar>
  );
}

export default Header;
