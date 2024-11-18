import { useState, useEffect } from "react";
import dayjs from 'dayjs';
import { Box } from "@mui/material";
import Plot from 'react-plotly.js';
import ForecastApi from "./ForecastApi";
import { useTheme } from "@mui/material/styles";

export default function ForecastPlot( {startDate} ) {
	const colors = useTheme().palette;
	const [plotData, setPlotData] = useState(null);

    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;
        async function loadData(signal) {                       
            let data = await ForecastApi.getPrediction(startDate, signal);                                
            plot(data);
        };
        loadData(signal);
        return () => abortController.abort();
    }, []);

	const layoutColors = {
		xaxis: {
			type:'date',
			linecolor: colors.secondary[500], 
			tickfont: {
				size: 10,
			},
			gridcolor: colors.secondary[800]  // Grid line color for X axis
		},
		yaxis: {
			automargin:true,
			title: 'kW',
			linecolor: colors.secondary[500],  // Axis line color
			ticksuffix: ' kW',
			tickfont: {
			},
			gridcolor: colors.secondary[600]  
		},
		plot_bgcolor:colors.secondary[900],
		paper_bgcolor:colors.secondary[900],
		font: {
			color:colors.secondary[50],
		},
	}

	function plot(data) {
		let x = [];
		let y = [];
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
            height:"100%",
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
                    title: (plotData?.x?.length > 0) ? "1-Week Predicted Energy Consumption (kW)" : "Loading...",
                    margin: {
                        t: 50,
                        r:50,
                    }
                }}
                config={{responsive: true}}
                useResizeHandler={true}
                style={{width: "100%", height: "100%"}}
            />
        </Box>
	);
}