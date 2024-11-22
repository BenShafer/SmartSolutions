import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { Box } from '@mui/material';
import Plot from 'react-plotly.js';
import ForecastApi from './ForecastApi';
import { useTheme } from '@mui/material/styles';

export default function ForecastPlot( {startDate} ) {
	const colors = useTheme().palette;
	const [plotData, setPlotData] = useState(null);

	const isDarkMode = colors.mode === 'dark';

	// Runs once on mount
    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;
        async function loadData() {                       
            const data = await ForecastApi.getPrediction(startDate, signal);                                
            plot(data);
        };
        loadData(signal);
        return () => abortController.abort();
    }, []);

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
			tickfont: {
			},
			gridcolor: colors.divider  
		},
		plot_bgcolor: isDarkMode ? colors.secondary[900] : colors.secondary[100],
		paper_bgcolor: isDarkMode ? colors.secondary[900] : colors.secondary[100],
		font: {
			color:colors.text.primary,
		},
	}

	function plot(data) {
		const x = [];
		const y = [];
		if (data?.length > 0) {
			data.map((item) => {
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
                    title: (plotData?.x?.length > 0) ? '1-Week Predicted Energy Consumption (kW)' : 'Loading...',
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