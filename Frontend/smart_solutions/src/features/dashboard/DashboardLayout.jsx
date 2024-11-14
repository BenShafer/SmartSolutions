import { useState } from "react";
import { Box, Paper, Grid } from "@mui/material";
import DateSpanControl from './DateSpanControl';
import MainDataPlot from './MainDataPlot';
import StatsCardLayout from './StatCardsLayout';
import DemandCard from './DemandCard';
import dayjs from 'dayjs';


// TODO Set widths for cards so they don't move so much.
export default function DashboardLayout() {
    const [date, setDate] = useState({
        span: 'month',
        start: dayjs('2023-08-01'),
        end: dayjs('2023-08-31'),
    });

	return (
        <Box sx={{
            width:"100%",
			height:"100%",
			padding:"1rem",
			}}>
            <Paper elevation={2} sx={{
                    width:"100%",
                    p:".5rem 1rem 1rem 1rem",
                    minHeight:"34rem",
                    height:"auto",
                    margin:"auto",
                    display: "flex",
                    flexDirection:"column",
                    }} >
                <DateSpanControl date={date} setDate={setDate} />
                <MainDataPlot date={date} />
            </Paper>
            <Grid container spacing={2} sx={{
                margin:'auto',
                width:"100%", 
                height:"auto", 
                }} >
                <StatsCardLayout date={date} />
                <DemandCard date={date} />            
            </Grid>
        </Box>
    )
}
