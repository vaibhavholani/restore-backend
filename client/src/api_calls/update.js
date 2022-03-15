import {API_HOST} from '../api.js'

export default function update_data  (type, data)  {
    const request = new Request(`${API_HOST}/api/${type}/update`, {
        method: "post",
        body: JSON.stringify(data),
        headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json"
        }
    });
    // Send the request with fetch()
    fetch(request)
}