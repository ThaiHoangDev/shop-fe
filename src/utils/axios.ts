import axios from 'axios';
import { isEmpty, assign } from 'lodash';
// import { PATH_AUTH } from '../routes/paths';

export const BASE_URL =
  process.env.HOST_API_KEY || 'https://admin.anvatchuchu.com';
export const API_VERSION = '/api/';

const singletonEnforcer = Symbol();

class AxiosClient {
  axiosClient: any;
  static axiosClientInstance: any;

  constructor(enforcer: any) {
    if (enforcer !== singletonEnforcer) {
      throw new Error('Cannot initialize Axios client single instance');
    }

    this.axiosClient = axios.create({
      baseURL: `${BASE_URL}${API_VERSION}`,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });

    const accessToken =
      typeof window !== 'undefined' ? localStorage.getItem('accessToken') : '';

    if (accessToken) {
      this.axiosClient.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${accessToken}`;
    }

    this.axiosClient.interceptors.request.use(
      (configure: any) => {
        return configure;
      },
      (error: any) => {
        return Promise.reject(error);
      }
    );

    this.axiosClient.interceptors.response.use(
      (response: any) => {
        if (response.data && Array.isArray(response.data)) {
          response.data.dataObject = response.data.reduce(
            (dataObject: any, item: any) => {
              dataObject[item.id] = item;
              return dataObject;
            },
            {}
          );
        }
        return response;
      },
      (error: any) => {
        if (
          error.response?.data?.errors &&
          Array.isArray(error.response?.data?.errors)
        ) {
          error.response.data.errorsObject = error.response.data.errors.reduce(
            (errorObject: any, item: any) => {
              errorObject[item.field] = item;
              return errorObject;
            },
            {}
          );
        }
        const { response } = error;
        const status = response?.status;

        if (status === 401 || status === 403) {
          this.setHeader(null);
          localStorage.removeItem('accessToken');
          //   window.location.href = PATH_AUTH.login;
        }

        return Promise.reject(error.response);
      }
    );
  }

  static get instance() {
    if (!this.axiosClientInstance) {
      this.axiosClientInstance = new AxiosClient(singletonEnforcer);
    }

    return this.axiosClientInstance;
  }

  setHeader(userToken = null) {
    this.axiosClient.defaults.headers.common['Access-token'] = `${userToken}`;
  }

  get(resource: string, slug = '', config = {}) {
    const requestURL = isEmpty(slug) ? `${resource}` : `${resource}/${slug}`;
    return this.axiosClient.get(
      requestURL,
      assign(config, this.axiosClient.defaults.headers)
    );
  }

  post(resource: string, data: object, config = {}) {
    return this.axiosClient.post(
      `${resource}`,
      data,
      assign(config, this.axiosClient.defaults.headers)
    );
  }

  update(resource: string, data: object, config = {}) {
    return this.axiosClient.put(
      `${resource}`,
      data,
      assign(config, this.axiosClient.defaults.headers)
    );
  }

  put(resource: string, data: object, config = {}) {
    return this.axiosClient.put(
      `${resource}`,
      data,
      assign(config, this.axiosClient.defaults.headers)
    );
  }

  patch(resource: string, data: object, config = {}) {
    return this.axiosClient.patch(
      `${resource}`,
      data,
      assign(config, this.axiosClient.defaults.headers)
    );
  }

  delete(resource: string, data: object, config = {}) {
    return this.axiosClient.delete(`${resource}`, {
      params: data,
      ...assign(config, this.axiosClient.defaults.headers),
    });
  }
}

export default AxiosClient.instance;
