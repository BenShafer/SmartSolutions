import { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import CorrelationsApi from './CorrelationApi';
import { useTheme } from '@mui/material/styles';

// TODO resize plot based on # of vars used
// TODO remember selection and corr data

export default function HeatMapPlot( {corrVars} ) {
	const colors = useTheme().palette;
    const [corrData, setCorrData] = useState(null);

	const isDarkMode = colors.mode === 'dark';

    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;
        async function loadData() {          
            const data = await CorrelationsApi.getCorrData(corrVars, signal);                                
            setCorrData(data);
        };
        loadData(signal);
        return () => abortController.abort();
    }, [corrVars]);
    
	const layoutColors = {
		xaxis: {
			linecolor: colors.divider, 
			tickfont: {
				size: 10,
			},
			gridcolor: colors.divider  // Grid line color for X axis
		},
		yaxis: {
			automargin:true,
			linecolor: colors.divider,  // Axis line color
			tickfont: {
			},
			gridcolor: colors.divider  
		},
		plot_bgcolor: isDarkMode ? colors.secondary[900] : colors.secondary[50],
		paper_bgcolor: isDarkMode ? colors.secondary[900] : colors.secondary[50],
		font: {
			color:colors.text.primary,
		},
	}

	let title = 'No Data'
	if (corrData != null) title = 'Correlations';

	return (
		<Plot
			data={[{
				x: corrData?.index,
				y: corrData?.columns,
				z: corrData?.data,
				type: 'heatmap',
				zmin:-1,
				zmax:1,
			}]}
			layout={{
				autosize:true,
				...layoutColors,
				title: title,
				margin: {
					t: 50,
					r:50,
				}
			}}
			config={{responsive: true}}
			useResizeHandler={true}
			style={{width: '100%', height: '100%'}}
		/>
	)
}