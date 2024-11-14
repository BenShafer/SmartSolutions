import { useMode, shades } from 'src/theme';
import { Box, Typography, Paper, Grid } from "@mui/material";

export default function GridItem( {title, children} ) {
    const [colorMode] = useMode();
	const colors = shades(colorMode);

	return (
        <>
            <Grid item xs="auto">
                <Paper elevation={2} sx={{display:"flex",
						alignItems:"baseline",
                        flexDirection:"column",
						pb:"1rem",
						minHeight:"9rem",
                        width: "auto",
						}} >
                    <Box sx={{width:"100%", mb:".5rem", borderBottom:`1px solid ${colors.secondary[700]}`}}>
                        <Typography sx={{textAlign:"center", p:"0.3rem 0.5rem"}} variant="h4">
                            {title}
                        </Typography>
                    </Box>
                    <Box sx={{width:"auto", p:"0 0.7rem"}} >
                        {children}
                    </Box>
                </Paper>
            </Grid>
        </>
	);
}