import { useState } from 'react';
import { Box, Paper } from '@mui/material';
import DateSpanControl from './DateSpanControl';
import MainDataPlot from './MainDataPlot';
import StatsCardLayout from './StatCardsLayout';
import DemandCard from './DemandCard';
import BatteryCard from './BatteryCard';
import dayjs from 'dayjs';

export default function DashboardLayout() {
    const [date, setDate] = useState({
        span: 'month',
        start: dayjs('2023-08-01'),
        end: dayjs('2023-08-31'),
    });

	return (
        <Box sx={{
            width: '100%',
			height: '100%',
			padding: '1rem',
			}}>
            <Paper elevation={3} sx={{
                width: '100%',
                p: '.5rem 1rem 1rem 1rem',
                minHeight: '34rem',
                height: 'auto',
                margin: 'auto',
                display: 'flex',
                flexDirection: 'column',
            }} >
                <DateSpanControl date={date} setDate={setDate} />
                <MainDataPlot date={date} />
            </Paper>
            <Box sx={{
                height: 'auto',
                padding: '1rem 0 1rem 0',
                gap: '1rem',
                display: 'flex',
                flexWrap: 'wrap'
			}}>
                <StatsCardLayout date={date} />
                <DemandCard date={date} />            
                <BatteryCard date={date} />    
            </Box>
        </Box>
    );
}
