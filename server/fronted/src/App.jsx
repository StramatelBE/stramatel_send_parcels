import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import routes from "./routes/Routes";
import useThemeStore from "./stores/themeStore";
import { GlobalStyles } from "@mui/material";
import "./Global.css";
import useAuthStore from "./stores/authStore";
import { useEffect, useState } from "react";

const App = () => {
  const [hasToken, setHasToken] = useState(false);
  const { muiTheme } = useThemeStore();
  const { token } = useAuthStore();

  useEffect(() => {
    if (token) {
      setHasToken(true);
    } else {
      setHasToken(false);
    }
  }, [token]);

  const router = createBrowserRouter(routes(hasToken));

  return (
    <ThemeProvider theme={muiTheme}>
      <GlobalStyles
        styles={{
          body: {
            backgroundColor: muiTheme.palette.background.default,
          },
        }}
      />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};

export default App;
