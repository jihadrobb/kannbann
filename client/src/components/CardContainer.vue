<template>
    <div class="col bg-secondary mx-2 my-1">
        <strong>{{ (category[0].toUpperCase()) + (category.slice(1)) }}</strong> 
        <div>
            <div class="card-container" v-for="task in getTaskByCategory" v-bind:key="task.id">
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
    props: ['tasks', 'category'],
    data(){
        return {
            baseUrl: 'http://localhost:3000'
        }
    },
    computed: {
        getTaskByCategory(){
            let datas = [];
            this.tasks.forEach(task => {
                if(task.category === this.category){
                    datas.push(task);
                }
            })
            return datas;
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