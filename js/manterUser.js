document.addEventListener('DOMContentLoaded', function() {
    const url = 'https://todolist-api.edsonmelo.com.br/api';
    const formEl = document.getElementById('signup-form');
    formEl.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(formEl);
        formData.delete('termos');
        const data = Object.fromEntries(formData);
        cadastrar(data);
    });

    function cadastrar(body) {
        var endpoint = '/user/new/';
        fetch(url + endpoint, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Erro ao consumir a API.');
        }).then(data => {
            console.log(data);
        }).catch(error => {
            console.error('Erro ao consumir a API', error);
        });
    }
});
