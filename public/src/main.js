import Vue from '@/utils/element-ui-import'; //引入vue
import App from './App'
//按需element-ui css
require.ensure([], function () {
  require('element-ui/lib/theme-chalk/index.css')
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  render: h => h(App)
}).$mount('#app');
