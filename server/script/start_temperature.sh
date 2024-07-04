#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

# Charger les variables d'environnement depuis le fichier .env situé dans le répertoire parent
dotenvx run --env-file=../.env -- python ./temperature/i2c_temp_reader.py