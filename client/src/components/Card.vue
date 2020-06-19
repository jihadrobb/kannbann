<template>
<div>
    <div class="card-body p-2 btn btn-light" @click.prevent="details(task.id)">{{ task.title }}</div>
</div>
</template>

<script>
import axios from 'axios';
import swal from 'sweetalert';

export default {
    name: 'Card',
    props: ['task'],
    data(){
        return {
            baseUrl: 'http://localhost:3000',
            title: ''
        }
    },
    methods: {
        details(id){
            let data;
            axios({
                method: 'get',
                url: this.baseUrl + `/tasks/${id}`,
                headers: {
                token: localStorage.token
                }
            })
            .then(response => {
                data = response.data;
                let buttons;
                switch(response.data.category){
                    case 'backlog':
                    buttons = {
                        back: false,
                        edit: {
                        className: 'btn-success',
                        text: 'edit',
                        value: 'edit'
                        },
                        delete : {
                        className: 'btn-danger',
                        text: 'delete',
                        value: 'delete'
                        },
                        next: {
                        className: 'btn-primary',
                        text: 'to Todo',
                        value: 'todo'
                        }
                    };
                    break;
                    case 'todo':
                    buttons = {
                        back: {
                        className: 'btn-warning',
                        text: 'to Backlog',
                        value: 'backlog'
                        },
                        edit: {
                        className: 'btn-success',
                        text: 'edit',
                        value: 'edit'
                        },
                        delete : {
                        className: 'btn-danger',
                        text: 'delete',
                        value: 'delete'
                        },
                        next: {
                        className: 'btn-primary',
                        text: 'to Doing',
                        value: 'doing'
                        }
                    };
                    break;
                    case 'doing':
                    buttons = {
                        back: {
                        className: 'btn-warning',
                        text: 'to Todo',
                        value: 'todo'
                        },
                        edit: {
                        className: 'btn-success',
                        text: 'edit',
                        value: 'edit'
                        },
                        delete : {
                        className: 'btn-danger',
                        text: 'delete',
                        value: 'delete'
                        },
                        next: {
                        className: 'btn-primary',
                        text: 'to Done',
                        value: 'done'
                        }
                    };
                    break;
                    default:
                    buttons = {
                        back: {
                        className: 'btn-warning',
                        text: 'to Doing',
                        value: 'doing'
                        },
                        edit: {
                        className: 'btn-success',
                        text: 'edit',
                        value: 'edit'
                        },
                        delete : {
                        className: 'btn-danger',
                        text: 'delete',
                        value: 'delete'
                        },
                        next: false
                    };
                    }
                return swal(response.data.title, { buttons });
            })
            .then(value => {
                console.log(data.UserId, 'id di data');
                // console.log(currentUserId, 'id di localstorage')
                switch(value){
                    case 'delete':
                    if(!this.authorization(data.UserId)){
                        throw 'Not Authorized to do this';
                    } else {
                        this.delete(id);
                        return false;
                    }
                    case 'edit':
                    if(!this.authorization(data.UserId)){
                        throw 'Not Authorized to do this';
                    } else {
                        this.edit(id);
                        return false;
                    }
                    case null: // if clicked outside alert box
                    break;
                    default:
                    return axios({
                        method: 'put',
                        url: this.baseUrl + `/tasks/${id}`,
                        headers: {
                            token: localStorage.token
                        },
                        data: {
                            title: data.title,
                            category: value
                        }
                    });
                }
            })
            .then(res => {
                if(res){
                    this.$emit('refresh');
                    swal(`Task moved to ${res.data.category}`, {
                        icon: 'success',
                    });
                }
            })
            .catch(err => {
                let errMsg;
                if(typeof err === 'string'){
                    errMsg = err;
                } else {
                    errMsg = err.response.data.message;
                }
                this.$emit('showError', errMsg);
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
                });
            })
            .then(res => {
                this.$emit('refresh');
                swal(`Task edited`, {
                    icon: 'success',
                });
            })
            .catch(err => {
                const errMsg = err.response.data.message;
                this.$emit('showError', errMsg);
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
                this.$emit('refresh')
                if(response.data){
                    swal("Task deleted", {
                        icon: "success",
                    });
                }
            })
            .catch(err => {
                const errMsg = err.response.data.message;
                this.$emit('showError', errMsg);
            });
        },
        authorization(taskUserId){
            if(Number(localStorage.currentUserId) !== taskUserId){
                return false;
            } else {
                return true;
            }
        },
    }
}
</script>