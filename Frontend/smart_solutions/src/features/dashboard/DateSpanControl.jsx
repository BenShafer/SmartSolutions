import { Box, Typography, IconButton, FormControl, Select, MenuItem, InputLabel } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import dayjs from 'dayjs';
import { DATA_START, DATA_END } from 'src/constants.js';

export default function DateSpanControl( {date, setDate} ) {
	const spanIsAll = (date?.span === 'all');

    function updateDate(newDate) {
        setDate({
            ...date,
            ...newDate,
        });
    }

    function handleSelectedSpan(span) {
		console.log(span);
        let newDate;
		if (span === 'all') {
			updateDate({
				span: span,
                start: dayjs(DATA_START),
                end: dayjs(DATA_END),
            })
		} else {
			newDate = date;
			newdate?.span = span;

			if (span === 'day') {
				newdate?.start = dayjs(newdate?.end).subtract(1, 'day');
			} else {
				newdate?.start = dayjs(newdate?.end).startOf(span);
			}
            updateEndDate(newDate);
		}
	}

	function handleDateShift(direction) {
		let newDate = date;

		if (direction === 'left') {
			newdate?.start = dayjs(newdate?.start).subtract(1, newdate?.span);
		} else if (direction === 'right') {
			newdate?.start = dayjs(newdate?.start).add(1, newdate?.span);
		}
		updateEndDate(newDate);
	}
	
    function updateEndDate(newDate) {
		if (newdate?.span === 'day') {
			newdate?.end = newdate?.start.endOf('day').add(1, 'day');
		} else {
			newdate?.end = newdate?.start.endOf(newdate?.span);
		}
        updateDate(newDate);
	}

    return (
        <Box sx={{
			flex: '0 0 auto',
            display:'flex',
            alignItems:'center',
            justifyContent:'center',
            }}>
			<Box sx={{mr:'auto'}}>
				<SpanSelect timeSpan={date?.span} handleSelected={handleSelectedSpan} />
			</Box>
			<Box sx={{ml:'-5%', mr:'auto', display:'flex', alignItems:'baseline', justifyContent:'center', pb:'1em'}}>
				<IconButton disabled={spanIsAll} color={spanIsAll ? 'disabled' : 'primary'} sx={{outline:'2px solid'}} onClick={() => handleDateShift('left')} >
					<ArrowBackIosIcon />
				</IconButton> 
					<Typography variant="h4" padding={'0em 0.5em'}>
						{dayjs(date?.start).format('YYYY-MM-DD')} — {dayjs(date?.end).format('YYYY-MM-DD')}
					</Typography>
				<IconButton disabled={spanIsAll} color={spanIsAll ? 'disabled' : 'primary'} sx={{outline:'2px solid'}} onClick={() => handleDateShift('right')} >
					<ArrowForwardIosIcon  /> 
				</IconButton>
			</Box>
		</Box>
    )
}

function SpanSelect( {timeSpan, handleSelected}) {
	
	return (
		<FormControl sx={{ m: 1, minWidth: 120 }}>
			<InputLabel id="time-span">Time Span</InputLabel>
			<Select 
				labelId="time-span"
				label="Time Span"
				value={timeSpan}
				onChange={(e) => handleSelected(e.target.value)}
				>
				<MenuItem value={'day'}>Day</MenuItem>
				<MenuItem value={'week'}>Week</MenuItem>
				<MenuItem value={'month'}>Month</MenuItem>
				<MenuItem value={'year'}>Year</MenuItem>
				<MenuItem value={'all'}>All</MenuItem>
			</Select>
		</FormControl>
	)
}