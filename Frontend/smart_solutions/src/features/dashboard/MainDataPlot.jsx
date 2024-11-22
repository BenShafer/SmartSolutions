import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import dayjs from 'dayjs';
import Plot from 'react-plotly.js';
import DashboardApi from './DashboardApi';
import { useTheme } from '@mui/material/styles';

let isBetween = require('dayjs/plugin/isBetween');
dayjs.extend(isBetween);

export default function MainDataPlot( {date}) {
	const colors = useTheme().palette;

	const [mainData, setMainData] = useState(null);
	const [yearlyData, setYearlyData] = useState(null);
	const [plotData, setPlotData] = useState(null);
	
	const plotTitle = plotData?.x?.length === 0 ? 'No Data' : 'Energy Consumption (kW)';
	const isDarkMode = colors.mode === 'dark';
	
	// Runs once on mount
    useEffect(() => {
		const abortController = new AbortController();
		const signal = abortController.signal;
		async function loadData(signal) {
			let main = await DashboardApi.getMainData(date.span, signal);
			setMainData(main);
			let yearly = await DashboardApi.getMainData('all', signal);
			setYearlyData(yearly);
			plot(date.start, date.end, date.span, main);
		};
		loadData(signal);
		return () => abortController.abort();
	}, []);

	// Runs on date change
	useEffect(() => {
		const abortController = new AbortController();
		const signal = abortController.signal;
		async function loadData(signal) {
			if (mainData) {
				plot(date.start, date.end, date.span);				
			};
		};
		loadData(signal);
		return () => abortController.abort();
	}, [date]);

	const layoutColors = {
		xaxis: {
			type:'date',
			linecolor: colors.divider, 
			tickfont: {
				size: 10,
			},
			gridcolor: colors.divider  // Grid line color for X axis
		},
		yaxis: {
			automargin:true,
			title: 'kW',
			linecolor: colors.divider,  // Axis line color
			ticksuffix: ' kW',
			gridcolor: colors.divider  
		},
		plot_bgcolor: isDarkMode ? colors.secondary[900] : colors.secondary[100],
		paper_bgcolor: isDarkMode ? colors.secondary[900] : colors.secondary[100],
		font: {
			color:colors.text.primary,
		},
	}

	function plot(start=date.start, end=date.end, span=date.span, main=mainData) {
		let x;
		let y;
		let filteredData;
		
		if (span === 'all' || span === 'year') {
			filteredData = yearlyData?.filter((data) => {
				const currentDate = dayjs(data.datetime);
				return currentDate.isBetween(start, end, null, '[]');
			});
		} else {
			filteredData = main?.filter((data) => {
				const currentDate = dayjs(data.datetime);
				return currentDate.isBetween(start, end, null, '[]');
			});
		}

		if (filteredData && filteredData.length > 0) {
			x = [];
			y = [];
			filteredData.map((item) => {
				x.push(dayjs(item.datetime).format('YYYY-MM-DD HH:mm'));
				y.push(item.Main_kw);
			})
		} 
		setPlotData({
			x: x,
			y: y
		});
	}
	
	return (
		<Box sx={{
			flex:'1 1 auto',
			height:'100%',
			}}>
			<Plot
				data={[{
					x: plotData?.x,
					y: plotData?.y,
					type: 'scatter',
					mode: 'lines',
					marker: {color: colors.primary[700], size: 2},
				}]}
				layout={{
					autosize:true,
					...layoutColors,
					title: plotData ? plotTitle : 'Loading...',
					margin: {
						t: 50,
						r:50,
					}
				}}
				config={{responsive: true}}
				useResizeHandler={true}
				style={{width: '100%', height: '100%'}}
			/>
		</Box>
	);
}