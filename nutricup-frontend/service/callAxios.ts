import axios from 'axios';

export async function callAxios(url: string, method: string, data: any) {
  try {
    const baseUrl = 'https://patrikborzik.sk/';
    // const baseUrl = 'http://localhost:4444/';

    const response = await axios({
      method: method,
      url: baseUrl + url,
      data: data,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')  // Add a space between 'Bearer' and the token
      }
    });
    return response;
  } catch (error) {
    if (error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.reload
    }
    return error;
  }
};
