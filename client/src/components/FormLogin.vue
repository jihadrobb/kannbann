<template>
<div>
    <h2>Login to continue</h2>
    <div class="mb-2">
        <small>or click <a href="" v-on:click.prevent="toRegister()">here</a> to register</small>
    </div>
    <form @submit.prevent="login()">
    <div class="form-group">
        <label for="email_login">Email address:</label>
        <input type="email" class="form-control" id="email_login" v-model="email_login">
    </div>
    <div class="form-group">
        <label for="password_login">Password:</label>
        <input type="password" class="form-control" id="password_login" v-model="password_login">
    </div>
    <button type="submit" class="btn btn-primary">Login</button>
    </form>
</div>
</template>

<script>
import Axios from 'axios';
import swal from 'sweetalert';

export default {
    name: 'FormLogin',
    data(){
        return {
            email_login: '',
            password_login: '',
            baseUrl: 'https://kannbannn.herokuapp.com'
        }
    },
    methods: {
        login(){
            Axios({
                method: 'post',
                url: this.baseUrl + '/login',
                data: {
                    email: this.email_login,
                    password: this.password_login
                }
            })
            .then(response => {
                this.$emit('loginUser', {
                    token: response.data.token,
                    currentUserId: response.data.id
                });
            })
            .catch(err => {
                const errMsg = err.response.data.message;
                this.$emit('error', errMsg);
            })
            .finally(_=> {
                this.email_login = '';
                this.password_login = '';
            })
        },
        toRegister(){
            this.$emit('toRegister');
        },
    }
}
</script>