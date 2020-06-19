<template>
    <div>
        <h2>Register new user</h2>
            <form @submit.prevent="register()">
              <div class="form-group">
                <label for="email_register">Email address:</label>
                <input type="email" class="form-control" id="email_register" v-model="email_register">
              </div>
              <div class="form-group">
                <label for="password_register">Password:</label>
                <input type="password" class="form-control" id="password_register" v-model="password_register">
              </div>
              <button type="submit" class="btn btn-success">Register</button>
              <button type="button" class="btn btn-danger" v-on:click="toLogin">Cancel</button>
            </form>
    </div>
</template>

<script>
import Axios from 'axios';
import swal from 'sweetalert';

export default {
    name: 'FormRegister',
    data(){
        return {
            email_register: '',
            password_register: '',
        }
    },
    methods: {
        register(){
            Axios({
                method: 'post',
                url: 'http://localhost:3000/register',
                data: {
                    email: this.email_register,
                    password: this.password_register
                }
            })
            .then(_ => {
                return swal({
                    title: "Register success!",
                    text: "Please login to continue!",
                    icon: "success",
                });
            })
            .then(_=> {
                this.$emit('toLogin');
            })
            .catch(err => {
                const errMsg = err.response.data.message;
                this.$emit('error',errMsg);
            })
        },
        toLogin(){
            this.$emit('toLogin');
        },
    }
}
</script>