import { useState, useEffect } from "react";
import { Box, Typography, Button, TextField } from "@mui/material";
import DashboardApi from './DashboardApi';
import GridItem from 'src/components/GridItem';


// TODO Fix large battery size values return negative savings.
export default function BatteryCard( {date} ) {  
    const [savings, setSavings] = useState(null);
    const [batterySize, setBatterySize] = useState(0);
    const [inputSize, setInputSize] = useState(0);
    const [isCalculating, setIsCalculating] = useState(true);

    // Runs on date change
    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;
        async function loadData(signal) {
            setIsCalculating(true);
            let data = await DashboardApi.getBatteryData(date.start, date.end, batterySize, signal);
            setSavings(data);
            setIsCalculating(false);    
        };
        loadData(signal);
        return () => abortController.abort();
    }, [date, batterySize]);

    function validateBatterySize(size) {
        if (size === null || size < 0 || size === "") {
            setBatterySize(0);
        } else setBatterySize(size);
        setIsCalculating(false);
    }

	const handleBatterySizeChange = (event)  => {
		setInputSize(event.target.value);
	}

	async function handleCalculateSavings() {
        setIsCalculating(true);
        validateBatterySize(inputSize);
	}

    const BatterySavings = function() {
        if (isCalculating) return <>Calculating...</>
        if (savings?.savings === 'No data') return <>No data</>

        return (
            <>
                <div>Demand Charge before: ${savings?.before}</div>
                <div>Demand Charge after: ${savings?.after}</div>
                <div>{batterySize}kW Savings: ${savings?.savings}</div>                
            </>
        )
    }

	return (
        <>  
            <GridItem long title={"Battery Savings Estimator"}>
                <Box sx={{display:"flex",
                    alignItems:"baseline",
                    flexDirection:"column",
                    minWidth:"14em",
                    p:".1em",
                    minHeight:"1em",
            }} >
                <Typography variant="h5" ml=".5em">
                    <BatterySavings />
                </Typography>
                </Box>
                <Box sx={{pt:"1em", display:"flex",}}>
                    <TextField
                        label="Enter battery size (kW)"
                        type="number"
                        value={inputSize}
                        onChange={handleBatterySizeChange}
                    />
                    <Button onClick={() => handleCalculateSavings()} sx={{ml:"1em"}} variant="contained" color="secondary" >Submit</Button>
                </Box>
            </GridItem>
        </>
    )
}





