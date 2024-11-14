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
};

export default DashboardApi;

