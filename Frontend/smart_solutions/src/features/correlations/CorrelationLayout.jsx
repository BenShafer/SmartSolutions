import { useState } from "react";
import { Box, Paper } from "@mui/material";
import Sidebar from "src/components/Sidebar";
import HeatMapPlot from "./HeatMapPlot";
import SidebarContent from "./SidebarContent";

export default function CorrelationLayout() {
	const [selectedVars, setSelectedVars] = useState({"Main":["Main_kw", "datetime"]});
	const [corrVars, setCorrVars] = useState({"Main":["Main_kw", "datetime"]});

    function handlePlot() {
        setCorrVars(selectedVars);
    }
    
    return (
        <Box sx={{
            display:"flex",
            width:"100%",
            height:"100%",
            overflow: "hidden",
        }}>
                <Sidebar>
                    <SidebarContent selectedVars={selectedVars} setSelectedVars={setSelectedVars} handlePlot={handlePlot} />
                </Sidebar>
                <div style={{flex:"1 1 auto", width:"100%", height:"100%", padding:"1rem"}} >
                    <Paper elevation={2} sx={{
                        minHeight:"50vh",
                        height:"100%",
                        }} >
                        <HeatMapPlot corrVars={corrVars} />
                    </Paper>
                </div>
        </Box>
    )
}