document.addEventListener('DOMContentLoaded', function() {
    var _self = this;
    const url = 'https://todolist-api.edsonmelo.com.br/api';
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

    $(document).on('click', '.btn-edit-doing', function() {
        var index = $(this).data("index");
        task = listaDeObjetos[index];
        _self.abrirModalTask(task);
    });

    $(document).on('click', '.btn-edit-done', function() {
        var index = $(this).data("index");
        task = listaDeObjetos[index];
        _self.abrirModalTask(task);
    });

    $('#bt-criar-tarefa').click(function () {
        _self.abrirModalNewTask();
    })

    $('.botao-back').click(function () {
        _self.fecharModalNewTask();
        _self.fecharModalTask();
        _self.pesquisar();
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
            console.log(data)
            var tabela = $("#tabela-corpo");
            tabela.empty();
            listaDeObjetos = data;
            _self.listar(listaDeObjetos)
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

    this.popularTarefa = function (task){
        document.getElementById('idTask').value = task.id;
        document.getElementById('nameTask').value = task.name;
        document.getElementById('dateTask').value = task.date;
        document.getElementById('statusTask').value = task.realized;
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
});




