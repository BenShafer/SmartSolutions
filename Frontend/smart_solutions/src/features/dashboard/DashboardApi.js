import Api from 'src/utils/api';

async function fetchData(endpoint, signal=null, data=null) {
    try {
        const result = await Api.post(endpoint, signal, data);
        return await JSON.parse(result);
    } catch(error) {
        console.log("Error fetching data:", error);
    };
};

const DashboardApi = {
    getMainData: (span, signal) => fetchData('data/main', signal, {'span': span}),
    getStatsData: (startDate, endDate, signal) => fetchData('data/stats', signal, {'start_date': startDate.format('YYYY-MM-DD'), 'end_date': endDate.format('YYYY-MM-DD')}),
    getDemandData: (startDate, signal) => fetchData('data/demand', signal, {'start_date': startDate.format('YYYY-MM-DD')}),
};

export default DashboardApi;

