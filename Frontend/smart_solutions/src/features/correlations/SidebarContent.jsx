import { Box, Button } from "@mui/material";
import VarSelector from "./VarsSelector";

export default function SidebarContent( {selectedVars, setSelectedVars, handlePlot} ) {

    return (
        <Box sx={{
            flex: "1 1 auto",
            display:"flex",
            flexDirection:"column",
            height:'100%',
            width:"14rem",
            padding: '0rem 0.3rem 2rem 0.3rem',
            overflow:'hidden',
        }}>
			<Button onClick={handlePlot} variant='contained'>Plot</Button>
			<VarSelector selectedVars={selectedVars} setSelectedVars={setSelectedVars} />
		</Box>
    )
}

