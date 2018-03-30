import axios from 'axios';
import { Message } from 'element-ui';
// 创建axios实例
const service = axios.create({
  transformRequest: [function (data) {
    // Do whatever you want to transform the data
    let ret = ''
    for (let i in data) {
      if(typeof data[i] == 'object'){
        let listData = data[i]
        for(let k = 0; k < listData.length; k++ ){
          ret += encodeURIComponent(i) + '=' + encodeURIComponent(listData[k]) + '&'
        }
      }else{
        ret += encodeURIComponent(i) + '=' + encodeURIComponent(data[i]) + '&'
      }
    }
    ret = ret.substring(0,ret.length-1)
    return ret
  }],
});
// request拦截器
service.interceptors.request.use(config => {
  // Do something before request is sent
  return config;
}, error => {
  // Do something with request error
  console.log(error); // for debug
  Promise.reject(error);
})
// respone拦截器
service.interceptors.response.use(
  response => {
    if(response.data.errCode){
      Message({
        message: response.data.errMsg,
        type: 'error',
        duration: 5 * 1000
      });
      return Promise.reject(response.data.err_msg)
    }else{
      return response
    }
  },
  error => {
    console.log('err' + error);// for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    });
    return Promise.reject(error);
  }
)

export default service;
