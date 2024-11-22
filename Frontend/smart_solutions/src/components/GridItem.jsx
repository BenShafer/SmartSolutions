import { Box, Typography, Paper } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export default function GridItem( {title, long, children} ) {
	const colors = useTheme().palette;

	return (
        <>
            <Box sx={{
                flex: long ? '2 1 auto' : '1 1 auto',
                width:'auto',
                maxWidth: {xs:'100%', sm: long ? '22rem' : '17rem'},
            }}>
                <Paper elevation={3} sx={{display:"flex",
						alignItems:"baseline",
                        flexDirection:"column",
						pb:"1rem",
                        width: "auto",
						}} >
                    <Box sx={{width:"100%", mb:".5rem", borderBottom:`1px solid ${colors.divider}`}}>
                        <Typography sx={{textAlign:"center", p:"0.3rem 0.5rem"}} variant="h4">
                            {title}
                        </Typography>
                    </Box>
                    <Box sx={{width:"100%", p:"0 0.7rem"}} >
                        {children}
                    </Box>
                </Paper>
            </Box>
        </>
	);
}