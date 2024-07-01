import { GlobalStyles } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './Global.css';
import routes from './routes/Routes';
import useThemeStore from './stores/themeStore';

const App = () => {
  const { muiTheme } = useThemeStore();

  const router = createBrowserRouter(routes());

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
