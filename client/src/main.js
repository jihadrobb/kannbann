import Vue from 'vue';
import App from './App.vue';
import GAuth from 'vue-google-oauth2'

const gauthOption = {
  clientId: '809177839151-qu1s38pkpsht3tqprff9emd4pf7crqlv.apps.googleusercontent.com'
}
Vue.use(GAuth, gauthOption);

new Vue({
  render: h => h(App),
}).$mount('#app');