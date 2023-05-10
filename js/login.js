document.addEventListener('DOMContentLoaded', function() {
    const url = 'https://todolist-api.edsonmelo.com.br/api';
    const home = '../html/home.html'
    var _self = this;

    const formEl = document.getElementById('signin-form');
    formEl.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(formEl);
        const data = Object.fromEntries(formData);
        login(data);
    });

    function login(body) {
        var endpoint = '/user/login/';
        fetch(url + endpoint, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
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
            if (data.token != null){
                sessionStorage.setItem('data', JSON.stringify(data));
                window.location.href = home;
            }else{
                console.log(data)
                console.error(data.message);
            }
        }).catch(error => {
            console.error('Erro ao consumir a API', error);
        });
    }
});
