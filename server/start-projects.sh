#!/bin/bash

# Démarrer une nouvelle session tmux
tmux new-session -d -s my_session

# Ouvrir une fenêtre pour le backend
tmux rename-window -t my_session:0 'Backend'
tmux send-keys -t my_session:0 'pnpm --filter backend dev' C-m

# Ouvrir une nouvelle fenêtre pour le frontend
tmux new-window -t my_session:1 -n 'Frontend'
tmux send-keys -t my_session:1 'pnpm --filter frontend dev' C-m

# Ouvrir une nouvelle fenêtre pour le preview
tmux new-window -t my_session:2 -n 'Preview'
tmux send-keys -t my_session:2 'pnpm --filter preview dev' C-m

# Attacher la session tmux
tmux attach-session -t my_session
