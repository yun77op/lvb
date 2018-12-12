import {stringify} from 'query-string';
import TokenStore from '../store/token';

const API_BASE = 'https://api.weibo.com/2';


// accessToken: "2.00PI7V8ByY87OCfa1720b5e0mYU9lC"
// errCode: 0
// expirationDate: 1546023600419.932
// refreshToken: "2.00PI7V8ByY87OCbcc8648ce5jvBNDD"
// type: "WBAuthorizeResponse"
// userID: "1322582527"


interface RequestObject {
  method?: string;
  query?: object | null;
  id?: string;
  type?: string;
  cursor?: string;
}

const request = async (path: string, options: RequestObject = {}) => {
  let url = `${API_BASE}${path}`;

  options.method = options.method || 'GET';

  const access_token = TokenStore.getAccessToken();

  const opts = {
    method: options.method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  }

  if (options.method.toLowerCase() === 'get') {
    url += '?' + stringify({
      access_token,
      ...options.query
    });
  } else if (options.method.toLowerCase() === 'post') {
    opts.body = stringify({
      access_token,
      ...options.query
    });
  }

  try {
    const response = await fetch(url, opts);

    let responseJson = await response.json();

    return responseJson;
  } catch (error) {
    console.error(error);

    throw error;
  }
}

export default request;