
// import React from "react";
import { IconButton, useTheme, Tabs, Tab, Typography, Paper, Box } from "@mui/material";
import { useContext } from "react";
import { ThemeContext } from "src/theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined';
import ElectricBoltOutlinedIcon from '@mui/icons-material/ElectricBoltOutlined';
import GridOnIcon from '@mui/icons-material/GridOn';
import { Link } from "react-router-dom";

// TODO finish dark mode toggle

export default function Topbar({ pathname }) {
	const theme = useTheme();
	const colorMode = useContext(ThemeContext);
	
	return (
		<Paper elevation={1}  sx={{ display:"flex", padding:"0em 1em 0em 1em" }}>
				<IconButton sx={{"outline": "0px outset #efff7630"}} >
					<ElectricBoltOutlinedIcon fontSize="large" />
					<Typography variant="h3">
						Smart Solutions
					</Typography>
				</IconButton>
				<Tabs sx={{paddingLeft: "2.5em"}} value={pathname}  >
					<Tab sx={{fontSize: "1.2em", textTransform: 'none'}} 
						icon={<HomeOutlinedIcon fontSize="large"/>}
						label={"Dashboard"}
						value={"/"}
						component={Link} to={"/"}		
					/>
					<Tab sx={{fontSize: "1.2em", textTransform: 'none'}} 
						icon={<GridOnIcon fontSize="large"/>}
						label={"Correlations"}
						value={"/correlations"}
						component={Link} to={"/correlations"}
					/>
					<Tab sx={{fontSize: "1.2em", textTransform: 'none'}} 
						icon={<InsightsOutlinedIcon fontSize="large"/>}
						label={"Forecast"}
						value={"/forecast"}
						component={Link} to={"/forecast"}
					/>
				</Tabs>

				<Box display="flex" ml="auto"> 
					<IconButton onClick={colorMode.toggleColorMode}>
						{theme.palette.mode === "dark" ? (
							<DarkModeOutlinedIcon />
						) : (
							<LightModeOutlinedIcon />
						)}
					</IconButton>
				</Box>
		</Paper>
	);
};
