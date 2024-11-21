import { createContext, useState, useMemo } from "react";
import { createTheme } from "@mui/material/styles";
import { blueGrey, green } from '@mui/material/colors';

const lightSettings = {background: {default: "#eee"}};

const themeSettings = (mode) => {
	return {
		palette: {
			mode: mode,
			primary: green,
			secondary: blueGrey,
			...(mode === 'dark' ? {} : lightSettings),
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