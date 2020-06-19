<template>
  <div>
    <section class="m-2 login-form" v-if="(!isLoggedIn) && (!registerPage)">
      <FormLogin v-on:loginUser="login" v-on:toRegister="toRegister" v-on:error="errorAlert"></FormLogin>
      <button class="btn btn-success my-2" @click="googleSign">Sign in With Google</button>
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
              <CardContainer 
              v-for="cat in categories"
              v-bind:key="cat"
              v-bind:tasks="tasks" 
              v-bind:category="cat" 
              v-bind:backlogs="getBacklog" 
              v-on:refresh="refresh" 
              v-on:error="errorAlert">
              </CardContainer>
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
import GAuth from 'vue-google-oauth2'
// import GoogleLogin from 'vue-google-login';
import axios from 'axios';

export default {
  name: 'App',
  components: {
    FormLogin,
    FormRegister,
    GAuth,
    // GoogleLogin,
    CardContainer
  },
  data () {
    return {
      baseUrl: 'https://kannbannn.herokuapp.com',
      isLoggedIn: false,
      registerPage: false,
      categories: ['backlog', 'todo', 'doing', 'done'],
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
    googleSign(){
      this.$gAuth.signIn()
      .then(data => {
        const { id_token } = data.wc;
        return axios({
          method: 'post',
          url: this.baseUrl + '/googleSign',
          data: {
            id_token
          }
        })
      })
      .then(response => {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('currentUserId', response.data.id);
        this.isLoggedIn = true;
        this.getTask();
      })
      .catch(err => {
        this.errorAlert(err);
      })
    },
    logout(){
      swal({
        title: "Successfully logged out",
        icon: "success",
      })
      .then(_=> {
        localStorage.removeItem('token');
        localStorage.removeItem('currentUserId');
        this.$gAuth.signOut();
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