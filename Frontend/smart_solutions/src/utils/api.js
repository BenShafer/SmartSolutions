import { API_URL } from 'src/constants.js';

async function fetchData(path, method, signal=null, data=null) {
    const url = API_URL + '/api/' + path;

    const request = {
        method,
        credentials: 'same-origin',
        headers: {'Content-Type': 'application/json'},
        signal
    }
    
    // Add body only if there is data and the method is not GET.
    if (data && method !== 'GET') {
        request.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(url, request);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        };
        return await response.json();
    } catch(error) {
        console.log("Error fetching data:", error);
    };
};

const Api = {
    get: (endpoint, signal) => fetchData(endpoint, 'GET', signal),
    post: (endpoint, signal, data) => fetchData(endpoint, 'POST', signal, data),
  };

export default Api;
