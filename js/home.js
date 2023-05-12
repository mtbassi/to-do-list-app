document.addEventListener('DOMContentLoaded', function () {
    var _self = this;
    const url = 'https://todolist-api.edsonmelo.com.br/api';
    const login = '../html/login.html'
    let token = null
    let listaDeObjetos = []
    let task = null;
    var userData = sessionStorage.getItem('data');
    if (userData) {
        userData = JSON.parse(userData);
        token = userData.token;
    } else {
        // O objeto data não está disponível
    }

    $(document).on('click', '.btn-edit-doing', function () {
        var index = $(this).data("index");
        task = listaDeObjetos[index];
        _self.abrirModalTask(task);
    });

    $(document).on('click', '.btn-edit-done', function () {
        var index = $(this).data("index");
        task = listaDeObjetos[index];
        _self.abrirModalTask(task);
    });

    $('#bt-criar-tarefa').click(function () {
        _self.abrirModalNewTask();
    })

    $('#bt-delete-tarefa').click(function () {
        _self.deletarTask(task)
    })

    $('.botao-delete-account').click(function () {
        _self.abrirModalUserDelete();
    })

    $('.botao-back').click(function () {
        _self.fecharModalNewTask();
        _self.fecharModalTask();
        _self.fecharModalTaskDelete();
        _self.fecharModalUserSetting();
        _self.fecharModalUserProfile();
        _self.fecharModalUserSecurity();
        _self.fecharModalUserDelete();
        _self.pesquisar();
    })

    $('.botao-delete').click(function () {
        _self.fecharModalTask();
        _self.abrirModalTaskDelete();
    })

    $('#bt-config-user').click(function () {
        _self.abrirModalUserSetting();
    })

    $('#bt-profile-user').click(function () {
        _self.abrirModalUserProfile(userData);
    })

    $('#bt-security-user').click(function () {
        _self.abrirModalUserSecurity();
    })

    const formElNewTask = document.getElementById('new-task-form');
    formElNewTask.addEventListener('submit', function (event) {
        event.preventDefault();
        const formData = new FormData(formElNewTask);
        const data = Object.fromEntries(formData);
        _self.criar(data);
    });

    this.criar = function (body) {
        console.log(body)
        var endpoint = '/task/new/';
        fetch(url + endpoint, {
            method: 'POST', body: JSON.stringify(body), headers: {
                'Content-Type': 'application/json', 'Authorization': token
            }
        }).then(response => {
            if (response.ok) {
                return response.json();
            } else if (response.status === 404) {
                throw new Error('Not found.');
            } else {
                throw new Error('Erro ao consumir a API.');
            }
        }).then(data => {
            console.log(data)
            _self.fecharModalNewTask();
            _self.pesquisar();
        }).catch(error => {
            console.error('Erro ao consumir a API', error);
        });
    }

    const formElDeleteUser = document.getElementById('delete-user-form');
    formElDeleteUser.addEventListener('submit', function (event) {
        event.preventDefault();
        const formData = new FormData(formElDeleteUser);
        const data = Object.fromEntries(formData);
        _self.deleteUser(data);
    });

    this.deleteUser = function (body) {
        console.log(body)
        var endpoint = '/user/delete/';
        fetch(url + endpoint, {
            method: 'DELETE', body: JSON.stringify(body), headers: {
                'Content-Type': 'application/json', 'Authorization': token
            }
        }).then(response => {
            if (response.ok) {
                return response.json();
            } else if (response.status === 404) {
                throw new Error('Not found.');
            } else {
                throw new Error('Erro ao consumir a API.');
            }
        }).then(data => {
            console.log(data)
            window.location.href = login;
        }).catch(error => {
            console.error('Erro ao consumir a API', error);
        });
    }

    const formElUpdateUser = document.getElementById('profile-user-form');
    formElUpdateUser.addEventListener('submit', function (event) {
        event.preventDefault();
        const formData = new FormData(formElUpdateUser);
        const data = Object.fromEntries(formData);
        _self.editarUser(data);
    });

    this.editarUser = function (body) {
        var endpoint = '/user/update/';
        fetch(url + endpoint, {
            method: 'PUT', body: JSON.stringify(body), headers: {
                'Content-Type': 'application/json', 'Authorization': token
            }
        }).then(response => {
            if (response.ok) {
                return response.json();
            } else if (response.status === 404) {
                throw new Error('Not found.');
            } else {
                throw new Error('Erro ao consumir a API.');
            }
        }).then(data => {
            window.location.href = login;
        }).catch(error => {
            console.error('Erro ao consumir a API', error);
        });
    }

    const formElUpdateLoginUser = document.getElementById('security-user-form');
    formElUpdateLoginUser.addEventListener('submit', function (event) {
        event.preventDefault();
        const formData = new FormData(formElUpdateLoginUser);
        const data = Object.fromEntries(formData);
        _self.editarLoginUser(data);
    });

    this.editarLoginUser = function (body) {
        console.log(body)
        var endpoint = '/user/updateuserpass/';
        fetch(url + endpoint, {
            method: 'PUT', body: JSON.stringify(body), headers: {
                'Content-Type': 'application/json', 'Authorization': token
            }
        }).then(response => {
            if (response.ok) {
                return response.json();
            } else if (response.status === 404) {
                throw new Error('Not found.');
            } else {
                throw new Error('Erro ao consumir a API.');
            }
        }).then(data => {
            console.log(data);
            window.location.href = login;
        }).catch(error => {
            console.error('Erro ao consumir a API', error);
        });
    }

    this.pesquisar = function () {
        var endpoint = '/task/search/';
        fetch(url + endpoint, {
            method: 'POST', headers: {
                'Content-Type': 'application/json', 'Authorization': token
            }
        }).then(response => {
            if (response.ok) {
                return response.json();
            } else if (response.status === 404) {
                throw new Error('Not found.');
            } else {
                throw new Error('Erro ao consumir a API.');
            }
        }).then(data => {
            var tabela = $("#tabela-corpo");
            if (data.message == null) {
                tabela.empty();
                listaDeObjetos = data;
                _self.listar(listaDeObjetos)
            } else {
                tabela.empty();
            }
        }).catch(error => {
            console.error('Erro ao consumir a API', error);
        });
    }

    const formElTask = document.getElementById('task-form');
    formElTask.addEventListener('submit', function (event) {
        event.preventDefault();
        const formData = new FormData(formElTask);
        const data = Object.fromEntries(formData);
        _self.editarTask(data);
    });

    this.editarTask = function (body) {
        var endpoint = '/task/update/';
        console.log(body)
        fetch(url + endpoint, {
            method: 'PUT', body: JSON.stringify(body), headers: {
                'Content-Type': 'application/json', 'Authorization': token
            }
        }).then(response => {
            if (response.ok) {
                return response.json();
            } else if (response.status === 404) {
                throw new Error('Not found.');
            } else {
                throw new Error('Erro ao consumir a API.');
            }
        }).then(data => {
            console.log(data)
            _self.fecharModalTask();
            _self.pesquisar();
        }).catch(error => {
            console.error('Erro ao consumir a API', error);
        });
    }

    this.deletarTask = function (body) {
        var endpoint = '/task/delete/';
        var id = {id: body.id}
        fetch(url + endpoint, {
            method: 'DELETE', body: JSON.stringify(id), headers: {
                'Content-Type': 'application/json', 'Authorization': token
            }
        }).then(response => {
            if (response.ok) {
                return response.json();
            } else if (response.status === 404) {
                throw new Error('Not found.');
            } else {
                throw new Error('Erro ao consumir a API.');
            }
            console.log(reponse.status)
        }).then(data => {
            console.log(data)
            _self.fecharModalTaskDelete();
            _self.pesquisar();
        }).catch(error => {
            console.error('Erro ao consumir a API', error);
        });
    }

    this.listar = function (listaDeObjetos) {
        var tabela = $("#tabela-corpo");
        tabela.empty();

        $.each(listaDeObjetos, function (i, objeto) {
            var tr = $("<tr>");
            var tdName = $("<td>");
            var status = null;
            var addClass = null
            if (objeto.realized != 0) {
                status = 'Done';
                addClass = 'btn-edit-done'
            } else {
                status = 'To do';
                addClass = 'btn-edit-doing'
            }

            var btnName = $("<button>").addClass(addClass).data("index", i);
            var spanName = $("<span>").text(objeto.name);
            var spanStatus = $("<span>").text(status);
            btnName.append(spanName, "<br>", spanStatus);
            tdName.append(btnName);
            tr.append(tdName);
            tabela.append(tr);
        });
    };

    this.popularTarefa = function (task) {
        document.getElementById('idTask').value = task.id;
        document.getElementById('nameTask').value = task.name;
        document.getElementById('dateTask').value = task.date;
        document.getElementById('statusTask').value = task.realized;
    }

    this.popularUser = function (user) {
        document.getElementById('nameUser').value = user.name;
        document.getElementById('emailUser').value = user.email;
        document.getElementById('pictureUser').value = user.picture;

        document.getElementById('usernameUser').value = '';
        document.getElementById('passwordUser').value = '';
    }

    this.abrirModalNewTask = function () {
        document.getElementById('new-task-board').style.display = 'block';
        document.getElementById('task-board').style.display = 'none';
    }

    this.fecharModalNewTask = function () {
        document.getElementById('name').value = '';
        document.getElementById('new-task-board').style.display = 'none';
        document.getElementById('task-board').style.display = 'block';
    }

    this.abrirModalTask = function (task) {
        document.getElementById('task-modal').style.display = 'block';
        document.getElementById('task-board').style.display = 'none';
        _self.popularTarefa(task);
    }

    this.fecharModalTask = function () {
        document.getElementById('task-modal').style.display = 'none';
        document.getElementById('task-board').style.display = 'block';
    }

    this.abrirModalTaskDelete = function () {
        _self.fecharModalTask();
        document.getElementById('task-board').style.display = 'none';
        document.getElementById('setting-user-modal').style.display = 'none';
        document.getElementById('delete-task-modal').style.display = 'block';
    }

    this.fecharModalTaskDelete = function () {
        document.getElementById('task-board').style.display = 'block';
        document.getElementById('delete-task-modal').style.display = 'none';
    }

    this.abrirModalUserSetting = function () {
        document.getElementById('task-board').style.display = 'none';
        document.getElementById('setting-user-modal').style.display = 'block';
    }

    this.fecharModalUserSetting = function () {
        document.getElementById('task-board').style.display = 'block';
        document.getElementById('setting-user-modal').style.display = 'none';
    }

    this.abrirModalUserProfile = function (user) {
        document.getElementById('setting-user-modal').style.display = 'none';
        document.getElementById('profile-user-board').style.display = 'block';
        _self.popularUser(user);
    }

    this.fecharModalUserProfile = function () {
        document.getElementById('task-board').style.display = 'block';
        document.getElementById('profile-user-board').style.display = 'none';
    }

    this.abrirModalUserSecurity = function () {
        document.getElementById('setting-user-modal').style.display = 'none';
        document.getElementById('security-user-board').style.display = 'block';
    }

    this.fecharModalUserSecurity = function () {
        document.getElementById('task-board').style.display = 'block';
        document.getElementById('security-user-board').style.display = 'none';
    }

    this.abrirModalUserDelete = function () {
        document.getElementById('setting-user-modal').style.display = 'none';
        document.getElementById('delete-user-board').style.display = 'block';
    }

    this.fecharModalUserDelete = function () {
        document.getElementById('task-board').style.display = 'block';
        document.getElementById('delete-user-board').style.display = 'none';
    }

    // Função para converter a imagem em Base64
    this.convertImageToBase64 = function (file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                resolve(reader.result);
            };
            reader.readAsDataURL(file);
        });
    }

    _self.pesquisar();

});




