import { useState, useEffect } from 'react';
import { Typography } from '@mui/material';
import DashboardApi from './DashboardApi';
import dayjs from 'dayjs';
import GridItem from 'src/components/GridItem';

// TODO Decide what to do when not on month span.
export default function DemandCard( {date} ) {  
    const [demandData, setDemandData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Runs on date change
    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;
        async function loadData() {
            setIsLoading(true);
            const data = await DashboardApi.getDemandData(date?.start, signal);
            setDemandData(data);
            setIsLoading(false);       
        };
        loadData(signal);
        return () => abortController.abort();
    }, [date]);

    const Demand = function() {
        if (isLoading) return <>Loading...</>
        if (demandData?.cost === 'No data') return <>No data</>
        return (
            <>
                <div>
                    Occured: {dayjs(demandData?.date).format('YYYY-MM-DD HH:mm')}                    
                </div>            
                <div>
                    Charge: ${demandData?.cost}
                </div>
            </>
        );
    }

	return (
        <>
            <GridItem title={'Demand Charge'}>
                <Typography variant="h5" ml=".5em">
                    <Demand />                          
                </Typography>
            </GridItem>
        </>
    );
}