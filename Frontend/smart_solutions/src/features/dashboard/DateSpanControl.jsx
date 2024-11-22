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
			newDate.span = span;

			if (span === 'day') {
				newDate.start = dayjs(newDate.end).subtract(1, 'day');
			} else {
				newDate.start = dayjs(newDate.end).startOf(span);
			}
            updateEndDate(newDate);
		}
	}

	function handleDateShift(direction) {
		const newDate = date;

		if (direction === 'left') {
			newDate.start = dayjs(newDate.start).subtract(1, newDate.span);
		} else if (direction === 'right') {
			newDate.start = dayjs(newDate.start).add(1, newDate.span);
		}
		updateEndDate(newDate);
	}
	
    function updateEndDate(newDate) {
		if (newDate.span === 'day') {
			newDate.end = newDate.start.endOf('day').add(1, 'day');
		} else {
			newDate.end = newDate.start.endOf(newDate.span);
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