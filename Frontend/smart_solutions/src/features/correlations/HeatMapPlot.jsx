import { useState, useEffect } from "react";
import { useMode, shades } from 'src/theme';
import Plot from 'react-plotly.js';
import CorrelationsApi from "./CorrelationApi";

// TODO resize plot based on # of vars used
// TODO remember selection and corr data

export default function HeatMapPlot( {corrVars} ) {
    const [theme, colorMode] = useMode();
	const colors = shades(colorMode);
    const [corrData, setCorrData] = useState(null);

    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;
        async function loadData(signal) {          
            let data = await CorrelationsApi.getCorrData(corrVars, signal);                                
            setCorrData(data);
        };
        loadData(signal);
        return () => abortController.abort();
    }, [corrVars]);
    
	const layoutColors = {
		xaxis: {
			linecolor: colors.secondary[500], 
			tickfont: {
				size: 10,
			},
			gridcolor: colors.secondary[800]  // Grid line color for X axis
		},
		yaxis: {
			automargin:true,
			linecolor: colors.secondary[500],  // Axis line color
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

	let title = "No Data"
	if (corrData == null) {
	} else {
		title = "Correlations"
	}

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
			style={{width: "100%", height: "100%"}}
		/>
	)
}