$('#login').click(() => {
    $.post('/admin', {
        username: $('#username').val(),
        password: $('#password').val()
    }, function (data) {
        if (data.status === 0) {
            alert(data.msg);
        } else {
            window.location.href = '/admin';
        }
    })
});
