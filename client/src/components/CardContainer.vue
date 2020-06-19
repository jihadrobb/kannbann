<template>
    <div class="col bg-secondary mx-2 my-1">
        <strong>{{ (category[0].toUpperCase()) + (category.slice(1)) }}</strong> 
        <div v-if="category === 'backlog'">
            <div class="card-container" v-for="task in backlogs" v-bind:key="task.id">
                <Card class="p-1" v-bind:task="task" v-on:showError="error" v-on:refresh="refresh"></Card>  
            </div>
            <a href="" @click.prevent="addTask(category)"><small>Add a card...</small></a>
        </div>
        <div v-else-if="category === 'todo'">
            <div class="card-container" v-for="task in todos" v-bind:key="task.id">
                <Card class="p-1" v-bind:task="task" v-on:showError="error" v-on:refresh="refresh"></Card>  
            </div>
            <a href="" @click.prevent="addTask(category)"><small>Add a card...</small></a>
        </div>
        <div v-else-if="category === 'doing'">
            <div class="card-container" v-for="task in doings" v-bind:key="task.id">
                <Card class="p-1" v-bind:task="task" v-on:showError="error" v-on:refresh="refresh"></Card>  
            </div>
            <a href="" @click.prevent="addTask(category)"><small>Add a card...</small></a>
        </div>
        <div v-else>
            <div class="card-container" v-for="task in dones" v-bind:key="task.id">
                <Card class="p-1" v-bind:task="task" v-on:showError="error" v-on:refresh="refresh"></Card>  
            </div> 
            <a href="" @click.prevent="addTask(category)"><small>Add a card...</small></a>
        </div>
    </div>
    
</template>

<script>
import Axios from 'axios';
import swal from 'sweetalert';
import Card from './Card';

export default {
    name: 'CardContainer',
    components: {
        Card
    },
    props: ['category', 'backlogs', 'todos', 'doings', 'dones'],
    data(){
        return {
            baseUrl: 'http://localhost:3000'
        }
    },
    methods: {
        addTask(category){
            swal({
                text: 'Input Title',
                content: "input",
                button: {
                text: "Submit",
                closeModal: false,
                },
            })
            .then(title => {
                return Axios({
                    method: 'post',
                    url: this.baseUrl + '/tasks',
                    headers: {
                        token: localStorage.token
                },
                    data: { title, category }
                });
            })
            .then(task => {
                this.$emit('refresh');
                swal({
                    title: "Success!",
                    text: `New ${category} task is added!`,
                    icon: "success",
                    button: "Close",
                });
            })
            .catch(err => {
                const errMsg = err.response.data.message;
                this.errorAlert(errMsg);
            });
        },
        error(message){
            this.$emit('error', message)
        },
        refresh(payload){
            this.$emit('refresh');
        },
    }
}
</script>