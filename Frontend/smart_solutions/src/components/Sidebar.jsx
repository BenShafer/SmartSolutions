import { useState } from "react";
import { Box, IconButton, Typography, Paper } from "@mui/material";
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';

// TODO add animations
// TODO dont rerender every time side bar is closed

export default function Sidebar( {children} ) {
	const [isCollapsed, setIsCollapsed] = useState(false);

	return (
		<Paper elevation={1} sx={{
			maxWidth:"20vw",
			width:"auto",
			height: '100%',
			display:'flex',
			flexDirection: 'column',
			}}>
			<Box flex="0 0 auto" margin=".5rem" >
				{!isCollapsed && (
					<Box display="flex" justifyContent="space-between" alignItems="center" ml="15">
						<Typography variant="h4" >
							Options
						</Typography>
						<IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
							<MenuOutlinedIcon />
						</IconButton>
					</Box>
				)}
				{isCollapsed && (
					<Box display="flex" justifyContent="space-between" alignItems="center" ml="15">
						<IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
							<MenuOutlinedIcon />
						</IconButton>
					</Box>
				)}
			</Box>
			{!isCollapsed && (<>{children}</>)}
		</Paper>
	)
}
