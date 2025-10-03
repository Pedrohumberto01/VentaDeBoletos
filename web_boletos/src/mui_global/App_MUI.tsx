import { createTheme, type Theme } from '@mui/material/styles';

// Reglas globales de estilos a los components
const theme: Theme = createTheme({
 palette: {
    primary: {
      main: '#0088FF',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
       backgroundColor: "#0088FF", 
        color: "#fff",              
        borderRadius: "1rem",       
        margin: "1rem",            
        }
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "#0088FF",

          "&.Mui-focused": {
            color: "#0088FF",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: '3rem',
            "& fieldset": {
              borderColor: "#0088FF",
            },
            "&:hover fieldset": {
              borderColor: "#0088FF",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#0088FF",
            },
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {

          borderRadius: '3rem',
          "& fieldset": {
            borderColor: "#0088FF",
          },

          "&:hover fieldset": {
            borderColor: "#0088FF",
          },

          "&.Mui-focused fieldset": {
            borderColor: "#0088FF",
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          color: "#0088FF",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '2.5rem',
          
          textTransform: 'none',
        },
      },
    },
  },
});

export default theme;