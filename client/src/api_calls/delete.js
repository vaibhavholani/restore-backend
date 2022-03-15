import {API_HOST} from '../api.js'

export default function delete_data  (type, id)  {
    fetch(`${API_HOST}/api/${type}?id=${id}`,{
    method:'DELETE'})
}