$('#login').click(() => {
    login();
});

const login = () => {
    $.post('/admin/login', {
        username: $('#username').val(),
        password: $('#password').val()
    }, (data) => {
        if (data.status === 0) {
            layer.msg(data.msg);
        } else {
            window.location.href = '/admin';
        }
    })
}

$('#username, #password').keydown((e)=>{
    if (e.keyCode == 13) {
        login();
    }
})