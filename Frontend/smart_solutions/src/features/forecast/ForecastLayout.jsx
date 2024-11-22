import dayjs from 'dayjs';
import { Box, Typography, Paper } from '@mui/material';
import ForecastPlot from './ForecastPlot';

const isBetween = require('dayjs/plugin/isBetween');
dayjs.extend(isBetween);

export default function ForecastLayout() {
	const startDate = dayjs('2023-08-24');
	const endDate = dayjs('2023-08-31');

    return (
        <Box sx={{
			width:'100%',
			height:'100%',
			padding:'1rem',
			}}>
			<Paper elevation={3} sx={{
				padding:'1rem',
				width:'100%',
				height:'auto',
				margin:'auto',
				minHeight:'32rem',
				}} >
				<Box sx={{m:'auto', display:'flex', alignItems:'baseline', justifyContent:'center', pb:'1em'}}>
					<Typography variant="h4" >
						{dayjs(startDate).format('YYYY-MM-DD')} — {dayjs(endDate).format('YYYY-MM-DD')}
					</Typography>
				</Box>
				<ForecastPlot startDate={startDate} />
			</Paper>
		</Box>
    )
}