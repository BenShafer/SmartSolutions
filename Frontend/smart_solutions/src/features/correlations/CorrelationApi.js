import Api from 'src/utils/api';

async function getData(endpoint, signal) {
    try {
        const result = await Api.get(endpoint, signal);
        return await JSON.parse(result);
    } catch(error) {
        console.log("Error fetching data:", error);
    };
};

async function fetchPostData(endpoint, signal,  data) {
    try {
        const result = await Api.post(endpoint, signal, data);
        return await JSON.parse(result);
    } catch(error) {
        console.log("Error fetching data:", error);
    };
};


const CorrelationsApi = {
    getVarsData: (signal) => getData('analysis', signal),
    getCorrData: (vars, signal) => fetchPostData('analysis/correlations', signal, vars),
};

export default CorrelationsApi;