import { createContext, useState, useMemo } from "react";
import { createTheme } from "@mui/material/styles";
import { grey, blueGrey, green } from '@mui/material/colors';

// TODO finish tweaking colors.

export const shades = (mode) => ({
	...(mode === 'dark'
	? {
		primary: green,
		secondary: blueGrey
	} 
	: {
		primary: green,
		secondary: grey
	}),
});

// mui theme settings
export const themeSettings = (mode) => {
	const colors = shades(mode);

	return {
		palette: {
			mode: mode,
			...(mode === 'dark'
			? { primary: green,
				secondary: blueGrey,
				divider: green[200],
			} : { primary: blueGrey,
				secondary: grey
			}),
		},
		typography: {
			fontFamily: ["Poppins", "sans-serif"].join(','),
			fontSize: 12,
			h1 : {
				fontFamily: ["Poppins", "sans-serif"].join(','),
				fontSize: 40,
			},
			h2 : {
				fontFamily: ["Poppins", "sans-serif"].join(','),
				fontSize: 32,
			},
			h3 : {
				fontFamily: ["Poppins", "sans-serif"].join(','),
				fontSize: 28,
			},
			h4 : {
				fontFamily: ["Poppins", "sans-serif"].join(','),
				fontSize: 22,
			},
			h5 : {
				fontFamily: ["Poppins", "sans-serif"].join(','),
				fontSize: 16,
			},
			h6 : {
				fontFamily: ["Poppins", "sans-serif"].join(','),
				fontSize: 14,
			},
		},
	};
};

// context for color mode
export const ThemeContext = createContext({ toggleColorMode: () => {} });

export const useMode = () => {
	const [mode, setMode] = useState("dark");

	const colorMode = useMemo(() => ({
		toggleColorMode: () => setMode((prevMode) => (prevMode === "light" ? "dark" : "light"))
		}),
		[]
	);

	const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

	return [theme, colorMode];
};