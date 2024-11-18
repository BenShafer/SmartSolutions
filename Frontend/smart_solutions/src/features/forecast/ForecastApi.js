import Api from 'src/utils/api';

async function fetchPostData(endpoint, signal,  data) {
    try {
        const result = await Api.post(endpoint, signal, data);
        return await JSON.parse(result);
    } catch(error) {
        console.log("Error fetching data:", error);
    };
};

const ForecastApi = {
    getPrediction: (startDate, signal) => fetchPostData('insights/forecast', signal, {"start_date": startDate.format('YYYY-MM-DD')}),
};

export default ForecastApi;