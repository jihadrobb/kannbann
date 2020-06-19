<template>
  <div>
    <section class="m-2 login-form" v-if="(!isLoggedIn) && (!registerPage)">
      <FormLogin v-on:loginUser="login" v-on:toRegister="toRegister" v-on:error="errorAlert"></FormLogin>
       <GoogleLogin :params="params" :renderParams="renderParams" :onSuccess="onSuccess" :onFailure="onFailure"></GoogleLogin>
    </section>
    <section class="m-2 register-form" v-if="registerPage">
        <FormRegister v-on:toLogin="toLogin" v-on:error="errorAlert"></FormRegister>
    </section>

      <section class="main-page" v-if="isLoggedIn">   
        <div class="navbar custom-navbar">
            <div class="btn btn-primary">Kanban App</div>
            <button class="btn btn-danger m-2" v-on:click="logout()">logout</button>
        </div>
        <div class="container">
            <div class="row">
              <CardContainer v-bind:category="categories[0]" v-bind:backlogs="getBacklog" v-on:refresh="refresh" v-on:error="errorAlert"></CardContainer>
              <CardContainer v-bind:category="categories[1]" v-bind:todos="getTodo" v-on:refresh="refresh" v-on:error="errorAlert"></CardContainer>
              <CardContainer v-bind:category="categories[2]" v-bind:doings="getDoing" v-on:refresh="refresh" v-on:error="errorAlert"></CardContainer>
              <CardContainer v-bind:category="categories[3]" v-bind:dones="getDone" v-on:refresh="refresh" v-on:error="errorAlert"></CardContainer>  
            </div>
        </div>
        </section>
  </div>
</template>

<script>
// ES6
import FormLogin from "./components/FormLogin";
import FormRegister from "./components/FormRegister";
import CardContainer from "./components/CardContainer";
import GoogleLogin from 'vue-google-login';
import Axios from 'axios';

export default {
  name: 'App',
  components: {
    FormLogin,
    FormRegister,
    GoogleLogin,
    CardContainer
  },
  data () {
    return {
      baseUrl: 'http://localhost:3000',
      email_login: '',
      password_login: '',
      email_register: '',
      password_register: '',
      isLoggedIn: false,
      registerPage: false,
      editPage: false,
      categories: ['backlog', 'todo', 'doing', 'done'],
      params: {
        client_id: "809177839151-qu1s38pkpsht3tqprff9emd4pf7crqlv.apps.googleusercontent.com"
        },
      renderParams: {
        width: 250,
        height: 50,
        longtitle: true
      },
      tasks: []
    }
  },
  computed: {
      getBacklog(){
        const backlogs = [];
        this.tasks.forEach(task => {
          if(task.category === 'backlog'){
            backlogs.push(task);
          }
        });
        return backlogs;
      },
      getTodo(){
        const todos = [];
        this.tasks.forEach(task => {
          if(task.category === 'todo'){
            todos.push(task);
          }
        });
        return todos;
      },
      getDoing(){
        const doings = [];
        this.tasks.forEach(task => {
          if(task.category === 'doing'){
            doings.push(task);
          }
        });
        return doings;
      },
      getDone(){
        const dones = [];
        this.tasks.forEach(task => {
          if(task.category === 'done'){
            dones.push(task);
          }
        });
        return dones;
      }
  },
  methods: {
    toLogin(){
      this.registerPage = false;
      this.isLoggedIn = false;
    },
    login(payload){
      localStorage.setItem('token', payload.token);
      localStorage.setItem('currentUserId', payload.currentUserId);
      this.isLoggedIn = true;
      this.getTask();
    },
    toRegister(){
      this.registerPage = true;
    },
    onSuccess(googleUser){
      // console.log(googleUser.getBasicProfile().getId());
      Axios({
        method: 'post',
        url: this.baseUrl + '/googleSign',
        data: {
          id_token: googleUser.getBasicProfile().getId()
        }
      })
      .then(response => {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('currentUserId', response.data.id);
        this.isLoggedIn = true;
        this.getTask();
      })
      .catch(err => {
        const errMsg = err.response.data.message;
        this.errorAlert(errMsg);
      });
    },
    onFailure(err){
      console.log(err);
    },
    logout(){
      swal({
        title: "Successfully logged out",
        icon: "success",
      })
      .then(_=> {
        localStorage.removeItem('token');
        localStorage.removeItem('currentUserId');
        this.isLoggedIn = false;
        this.tasks = [];
      })
      .catch(err => {
        const errMsg = err.response.data.message;
        this.errorAlert(errMsg);
      });
    },
    refresh(payload){
      this.getTask();
    },
    getTask(){
      axios({
        method: 'get',
        url: this.baseUrl + '/tasks',
        headers: {
            token: localStorage.token
        }
      })
      .then(response => {
        this.tasks = response.data;
        //sort the array by id
        this.tasks.sort((a, b) => {
            return a.id - b.id;
        })
      })
      .catch(err => {
        const errMsg = err.response.data.message;
        this.errorAlert(errMsg);
      });
    },
    edit(id){
      let task;
      axios({
        method: 'get',
        url: this.baseUrl + `/tasks/${id}`,
        headers: {
          token: localStorage.token
        }
      })
      .then(response => {
        task = response.data;
        return swal({
          text: 'Input Title',
          content: {
              element: "input",
              attributes: {
                value: task.title,
                type: "text",
              }
        },
          button: {
            text: "Submit",
            closeModal: true,
          },
        })
      })
      .then(title => {
        console.log(title);
        return axios({
          method: 'put',
          url: this.baseUrl + `/tasks/${id}`,
          headers: {
            token: localStorage.token
          },
          data: {
            title,
            category: task.category
          }
        })
      })
      .then(res => {
        this.getTask();
        swal(`Task edited`, {
          icon: 'success',
        });
      })
      .catch(err => {
        const errMsg = err.response.data.message;
        this.errorAlert(errMsg);
      });
    },
    delete(id){
      swal({
        title: "Are you sure?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
      .then(yes => {
        if(yes){
          return axios({
            method: 'delete',
            url: this.baseUrl + `/tasks/${id}`,
            headers: {
                token: localStorage.token
            }
          });
        } else {
          return swal("Cancelled");
        }
      })
      .then(response => {
        this.getTask();
        if(response.data){
          swal("Task deleted", {
            icon: "success",
          });
        }
      })
      .catch(err => {
        const errMsg = err.response.data.message;
        this.errorAlert(errMsg);
      });
    },
    errorAlert(message){
      if(Array.isArray(message)){
        message = message.join(', ');
      }
      swal({
        icon: 'error',
        text: message
      })
    }
  },
  created(){
    // cek token
    // ambil data dr server
    const token = localStorage.token;
    if(token){
      this.isLoggedIn = true;
      this.getTask();
    }
  },
  mounted(){
    // manipulasi dom
  }
}

</script>

<style>
</style>