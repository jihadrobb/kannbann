new Vue({
    el: '#app',
    data: {
        baseUrl: 'http://localhost:3000',
        email_login: '',
        password_login: '',
        email_register: '',
        password_register: '',
        isLoggedIn: false,
        registerPage: false,
        editPage: false,
        tasks: []
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
        }
    },
    methods: {
        toLogin(){
            this.registerPage = false;
            this.isLoggedIn = false;
        },
        login(){
            axios({
                method: 'post',
                url: this.baseUrl + '/login',
                data: {
                  email: this.email_login,
                  password: this.password_login
                }
            })
            .then(response => {
                const { token } = response.data;
                localStorage.setItem('token', token);
                this.isLoggedIn = true;
                this.getTask();
            })
            .catch(error => console.log(error))
            .then(_=> {
                this.email_login = '';
                this.password_login = '';
            })
        },
        toRegister(){
            this.registerPage = true;
        },
        register(){
            axios({
                method: 'post',
                url: this.baseUrl + '/register',
                data: {
                    email: this.email_register,
                    password: this.password_register
                }
            })
            .then(_=> {
                return swal({
                    title: "Register success!",
                    text: "Please login to continue!",
                    icon: "success",
                  });
            })
            .then(_=> {
                this.toLogin();
            })
            .catch(err => {
                const errMsg = err.response.data.message;
                this.errorAlert(errMsg);
            })
        },
        logout(){
            swal({
                title: "Successfully logged out",
                icon: "success",
            })
            .then(_=> {
                localStorage.removeItem('token');
                this.isLoggedIn = false;
                this.tasks = [];
            })
            .catch(err => {
                const errMsg = err.response.data.message;
                this.errorAlert(errMsg);
            });
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
                return axios({
                    method: 'post',
                    url: this.baseUrl + '/tasks',
                    headers: {
                        token: localStorage.token
                    },
                    data: { title, category }
                })
            })
            .then(task => {
                this.getTask();
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
                switch(value){
                    case 'delete':
                        this.delete(id);
                        return false;
                    case 'edit':
                        this.edit(id);
                        return false;
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
                    this.getTask();
                    swal(`Task moved to ${res.data.category}`, {
                        icon: 'success',
                    });
                }
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
            .then(title=> {
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
                console.log(res.data);
                this.getTask();
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
                return swal("Task deleted", {
                    icon: "success",
                });

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
    },
})