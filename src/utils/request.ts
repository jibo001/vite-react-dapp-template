import axios, { AxiosHeaders, AxiosRequestHeaders } from 'axios';
import { toLower } from 'lodash';
import { Toast } from 'antd-mobile';
import { ApiResponse } from '@/types/request';
import { env } from '@/config/env';

axios.defaults.timeout = 50000;

const request = <T>(
  method: string,
  url: string,
  params: any,
  needToken: boolean = true,
  headerContentType: string = 'application/json',
  baseURL: string = env.baseUrl,
): Promise<ApiResponse<T>> => {
  const headers: AxiosRequestHeaders = new AxiosHeaders();
  headers['Content-type'] = headerContentType;
  const sign = JSON.parse(localStorage.getItem('sign') || '{}');
  headers.address = toLower(sign?.address || '');
  headers.message = sign?.message || '';
  headers.signature = sign?.signature || '';
  if (needToken) {
    if (!headers.signature) {
      return new Promise((resolve) => {
        resolve({
          code: -1,
          success: false,
          data: null,
          msg: 'Network exception',
        });
      });
    }
    headers.authorized = localStorage.getItem('authorized') || '';
  }

  return new Promise((resolve) => {
    axios({
      method,
      headers,
      baseURL,
      url,
      timeout: 15000,
      params: method === 'GET' || method === 'DELETE' ? params : null, // 是即将与请求一起发送的 URL 参数
      data: method === 'POST' || method === 'PUT' ? params : null, // 是作为请求主体被发送的数据
    })
      .then((res) => {
        Toast.clear();
        if (res.data.code === 1) {
          // eslint-disable-next-line no-param-reassign
          res.data.success = true;
          resolve(res.data);
        } else {
          resolve({
            code: res.data.code,
            success: false,
            data: null,
            msg: res.data.msg || 'Network exception',
          });
        }
      }).catch((error) => {
        Toast.clear();
        let messageText = '';
        if (
          error.response
          && error.response.data
          && error.response.data.message
        ) {
          messageText = error.response.data.msg;
        } else {
          messageText = 'Network exception';
        }
        Toast.show(messageText);
        resolve({
          code: 500,
          success: false,
          data: null,
          msg: 'Network exception',
        });
      });
  });
};

export default request;
