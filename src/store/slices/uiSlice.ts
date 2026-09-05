import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  menuOpen: boolean;
  scrolled: boolean;
  activeSection: string;
}

const initialState: UiState = {
  menuOpen: false,
  scrolled: false,
  activeSection: 'inicio',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setMenuOpen(state, action: PayloadAction<boolean>) {
      state.menuOpen = action.payload;
    },
    toggleMenu(state) {
      state.menuOpen = !state.menuOpen;
    },
    setScrolled(state, action: PayloadAction<boolean>) {
      state.scrolled = action.payload;
    },
    setActiveSection(state, action: PayloadAction<string>) {
      state.activeSection = action.payload;
    },
  },
});

export const { setMenuOpen, toggleMenu, setScrolled, setActiveSection } = uiSlice.actions;
export default uiSlice.reducer;
