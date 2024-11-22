import { useState, useEffect } from 'react';
import DashboardApi from './DashboardApi';
import GridItem from 'src/components/GridItem';
import { useTheme } from '@mui/material/styles';

// TODO Add loading state.
// TODO Maybe split the 2 cards.
export default function StatCardsLayout( {date} ) {
    // const [colorMode] = useMode();
	const colors = useTheme().palette;
    const [statsData, setStatsData] = useState(null);

    // Runs on date change
    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;
        async function loadData(signal) {
            let stats = await DashboardApi.getStatsData(date.start, date.end, signal);                    
            setStatsData(stats);
        };
        loadData(signal);
        return () => abortController.abort();
    }, [date]);

    const CostTable = function( {data} ) {
        
        return (
            <table style={{ 
                borderCollapse: 'collapse',
                width: '100%',
                }}>
                <thead>
                    <tr>
                        <th>Billing</th>
                        <th>Cost</th>
                    </tr>
                </thead>
                <tbody>
                    {data?.map((stat, index) => (
                        <tr key={stat.billing}
                            style={{
                                backgroundColor: index % 2 === 0 ? 'rgba(120, 120, 120, 0.15)' : 'rgba(120, 120, 120, 0.3)'
                            }} >
                            <td style={{paddingRight: '1rem'}}>{stat.billing}</td>
                            <td>${stat.total_cost}</td>    
                        </tr>
                    ))}
                    <tr style={{
                        fontWeight: '500',
                        backgroundColor: 'rgba(120, 120, 120, 0.4)'
                    }} >
                        <td>Total</td>
                        <td>${data?.[0]?.total_costs}</td>
                    </tr>
                </tbody>
            </table>            
        )
    }

    const UsageTable = function( {data} ) {
        return (
            <table style={{ 
                borderCollapse: 'collapse',
                width: '100%',
                }}>
                    <thead>
                        <tr>
                            <th>Billing</th>
                            <th>Usage (kW)</th>
                        </tr>
                    </thead>
                <tbody>
                    {data?.map((stat, index) => (
                        <tr
                        key={stat.billing}
                        style={{
                            backgroundColor: index % 2 === 0 ? 'rgba(120, 120, 120, 0.15)' : 'rgba(120, 120, 120, 0.3)'
                        }} >
                            <td style={{paddingRight: '1rem'}}>{stat.billing}</td>
                            <td>{stat.total_kwh}</td>    
                        </tr>
                    ))}
                    <tr
                        style={{
                            fontWeight: '500',
                            backgroundColor: 'rgba(120, 120, 120, 0.4)'
                        }} >
                        <td>Total</td>
                        <td>{data?.[0]?.total_kwhs}</td>
                    </tr>
                </tbody>
            </table>            
        )
    }

	return (
        <>
            <GridItem title={'Billing Costs'}>
                <CostTable data={statsData} />
            </GridItem>
            <GridItem title={'Electricity Use'}>
                <UsageTable data={statsData} />
            </GridItem>
        </>
    )
}