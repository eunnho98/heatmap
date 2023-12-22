import Axios from 'axios';

const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_HTTPS_BASEURL,
});

export default axios;
