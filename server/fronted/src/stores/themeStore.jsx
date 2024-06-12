import { create } from 'zustand';
import { darkTheme, switchToDarkTheme } from '../themes/darkTheme';
import { clairTheme, switchToClairTheme } from '../themes/clairTheme';

const useThemeStore = create((set) => ({
  theme: 'light', // thème par défaut
  muiTheme: clairTheme,
  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    if (newTheme === 'dark') {
      switchToDarkTheme();
      return { theme: newTheme, muiTheme: darkTheme };
    } else {
      switchToClairTheme();
      return { theme: newTheme, muiTheme: clairTheme };
    }
  }),
}));

export default useThemeStore;