import { createTheme } from '@mui/material/styles'

// Design tokens pulled from the Movie Colab Figma frame.
export const tokens = {
  bg: '#1b1d28',
  surface: '#252a38',
  border: '#3f404a',
  primary: '#6c65d9',
  primaryLight: '#839cff',
  text: '#f9f9f9',
  textMuted: '#606479',
  textNav: '#717481',
  textSubtle: '#b1b5c9',
  danger: '#ff6161',
  avatarBorder: '#606479',
}

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: tokens.primary },
    background: { default: tokens.bg, paper: tokens.surface },
    text: { primary: tokens.text, secondary: tokens.textMuted },
    divider: tokens.border,
  },
  typography: {
    fontFamily: '"Poppins", sans-serif',
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    button: { textTransform: 'none', fontSize: 14, fontWeight: 400, lineHeight: 'normal' },
  },
  shape: { borderRadius: 5 },
  components: {
    MuiCssBaseline: {
      styleOverrides: { body: { backgroundColor: tokens.bg } },
    },
    MuiTooltip: {
      defaultProps: { disableInteractive: true },
    },
  },
})
