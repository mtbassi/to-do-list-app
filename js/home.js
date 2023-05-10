
document.addEventListener('DOMContentLoaded', function() {
    var _self = this;
    const url = 'https://todolist-api.edsonmelo.com.br/api';
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    $('#bt-criar-tarefa').click(function () {
        _self.abrirModalNewTask();
    })

    $('#tabela-corpo tr').click(function() {
        // função para lidar com o evento de clique
        // por exemplo:
        console.log('Linha clicada!');
    });

    $('#botao-back').click(function () {
        _self.fecharModalNewTask();
    })

    $('#icone-delete').click(function () {
        _self.abrirModalDelete();
    })

    const formEl = document.getElementById('new-task-form');
    formEl.addEventListener('submit', function (event) {
        event.preventDefault();
        const formData = new FormData(formEl);
        const data = Object.fromEntries(formData);
        _self.criar(data);
    });

    this.criar = function (body) {
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
            _self.listar(data)
        }).catch(error => {
            console.error('Erro ao consumir a API', error);
        });
    }

    this.listar = function (listaDeObjetos) {
        var tabela = $("#tabela-corpo");
        $.each(listaDeObjetos, function (i, objeto) {
            var tr = $("<tr>");
            var tdName = $("<td>").text(objeto.name);
            var tdUpdate = $("<td>").append($("<input>").attr("type", "button")).val("Atualizar");
            tdUpdate.addClass("bt-udapte")
            tr.append(tdName);
            tr.append(tdUpdate);
            tabela.append(tr);
        });
    };


    this.abrirModalNewTask = function () {
        document.getElementById('new-task-board').style.display = 'block';
        document.getElementById('task-board').style.display = 'none';
    }

    this.abrirModalDelete = function () {
        console.log('to aqui porra')
        document.getElementById('delete-modal').style.display = 'block';
        document.getElementById('task-board').style.display = 'none';
    }

    this.fecharModalNewTask = function () {
        document.getElementById('name').value = '';
        document.getElementById('new-task-board').style.display = 'none';
        document.getElementById('task-board').style.display = 'block';
        _self.listar();
    }
});




