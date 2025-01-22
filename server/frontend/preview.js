const { exec } = require('child_process');
const dotenv = require('dotenv');
const path = require('path');

// Charger les variables d'environnement
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const port = process.env.FRONT_PORT || 3000;

exec(`vite preview --port ${port}`, (err, stdout, stderr) => {
  if (err) {
    console.error(`Erreur: ${err}`);
    return;
  }
  console.error(stderr);
});