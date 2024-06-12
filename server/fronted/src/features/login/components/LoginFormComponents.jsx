import LoginIcon from "@mui/icons-material/Login";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import useAuthStore from '../../../stores/authStore';
import UserService from '../api/userService';

function LoginComponents() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const setToken = useAuthStore((state) => state.setToken);

  async function handleSubmit(e) {
    if (e) e.preventDefault();
    const username = "user";
    try {
      const user = await UserService.login(username, password);
        console.log(user.data);
        
      if (user) {
        console.log("Connecté avec succès", user.token);
        
        setToken(user.data);
      }
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      setError("Mot de passe incorrect");
    }
  }

  return (
    <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100vh'}}>
      <Paper >
      <Box className="herderTitlePage">
        <Box className="headerLeft">
          <IconButton disabled>
            <LoginIcon
              sx={{ color: "primary.light" }}
              className="headerButton"
            />
          </IconButton>
          <Typography
            className="headerTitle"
            variant="h6"
            sx={{ color: "primary.light" }}
          >
            Connexion 
          </Typography>
        </Box>
      </Box>

      <Box className="centeredContainer">
        <form onSubmit={handleSubmit}>
          <FormControl sx={{ width: "35vh" }}>
            <TextField
              label="Mot de passe"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              margin="normal"
            />
            <Typography
              variant="body2"
              sx={{
                color: error ? "error.main" : "transparent",
                textAlign: "center",
                height: "1.5em",
              }}
            >
              {error || " "}
            </Typography>
            <Button type="submit" sx={{ color: "secondary.main" }}>
              Se connecter
            </Button>
          </FormControl>
        </form>
      </Box>
      </Paper>
    </div>
  );
}

export default LoginComponents;