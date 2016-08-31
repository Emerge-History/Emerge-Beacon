var index;
setTimeout(function () {
    if (!$('.login__content').data('login')) {
        layer.open({
            title: '请登录',
            type: 1,
            skin: 'layui-layer-demo', //样式类名
            closeBtn: 0, //不显示关闭按钮
            shift: 2,
            move: false,
            content: $('.login'),
            skin: 'layui-layer-lan',
            area: '360px',
            closeBtn: 2,
            success: function (dom, layer) {
                $('#username').focus();
                index = layer;
            }
        });
    }
}, 1000);
var login = function () {
    var username = $('#username').val();
    var password = $('#password').val();
    $.post('/admin', {
        username: username,
        password: password
    }, function (data) {
        if (data.status === 0) {
            layer.msg(data.msg);
        } else {
            layer.close(index);
            layer.msg(data.msg);
        }
    })
}
$('#password').keydown(function (e) {
    if (e.keyCode == 13) {
        login();
    }
});
$('.login__btn').click(function () {
    login();
});

$('#addDevice').click(function () {
    layer.prompt({
        move: false,
        title: '英文逗号分隔可添加多个',
        formType: 0
    }, function (deviceStr) {
        var groupId = $('#tbody').data('groupId');
        $.getJSON('/admin/group/adddevice', {
            groupId: groupId,
            deviceStr: deviceStr
        }, function (res) {
            if (res.status === 1) {
                layer.msg(res.msg);
            } else {
                layer.msg(res.msg);
            }
        });
    });
});
$('#removeDevice').click(function () {
    layer.prompt({
        move: false,
        title: '英文逗号分隔可批量删除',
        formType: 0
    }, function (deviceStr) {
        var groupId = $('#tbody').data('groupId');
        $.getJSON('/admin/group/deletedevice', {
            groupId: groupId,
            deviceStr: deviceStr
        }, function (res) {
            if (res.status === 1) {
                layer.msg(res.msg);
            } else {
                layer.msg(res.msg);
            }
        });
    });
});


$('.sider__add').click(function () {
    layer.prompt({
        move: false,
        title: '输入新组名',
        formType: 0
    }, function (groupName) {
        $.getJSON('/admin/group/add', {
            groupName: groupName
        }, function (res) {
            if (res.status === 1) {
                $('.sider__container').append(
                    '<li class="sider__item"><span class="sider__name" onclick="groupDetail('
                    + res.data.group_id
                    + ')">'
                    + res.data.group_name
                    + '</span><span class="sider__icon"><i class="iconfont icon-pencil" onclick="groupEdit('
                    + res.data.group_id
                    + ', $(this))"></i><i class="iconfont icon-trashbin" onclick="groupDelete('
                    + res.data.group_id
                    + ', $(this))"></i></span></li>'
                )
                layer.msg(res.msg);
            } else {
                layer.msg(res.msg);
            }
        });
    });
});


$.getJSON('/admin/group/list', function (res) {
    for (var i = 0; i < res.content.length; i++) {
        $('.sider__container').append(
            '<li class="sider__item"><span class="sider__name" onclick="groupDetail('
            + res.content[i].group_id
            + ')">'
            + res.content[i].group_name
            + '</span><span class="sider__icon"><i class="iconfont icon-pencil" onclick="groupEdit('
            + res.content[i].group_id
            + ', $(this))"></i><i class="iconfont icon-trashbin" onclick="groupDelete('
            + res.content[i].group_id
            + ', $(this))"></i></span></li>'
        )
    }
    if ($('.sider__item').size() > 0) {
        $('.sider__item').eq(0).find('.sider__name').trigger('click');
    }
});

$('.sider').delegate('.sider__item', 'click', function () {
    if (!$(this).hasClass('sider__item--active')) {
        $('.sider__item.sider__item--active').removeClass('sider__item--active');
        $(this).addClass('sider__item--active');
    }
});


function groupDetail(groupId) {
    pageTable(1, groupId);
}
function groupEdit(groupId, dom) {
    layer.prompt({
        move: false,
        title: '修改名称',
        formType: 0
    }, function (groupNewName) {
        $.getJSON('/admin/group/update', {
            groupId: groupId,
            groupNewName: groupNewName
        }, function (res) {
            if (res.status === 1) {
                dom.parent().prev().text(groupNewName);
                layer.msg(res.msg);
            } else {
                layer.msg(res.msg);
            }
        });
    });
}
function groupDelete(groupId, dom) {
    layer.confirm('确认删除该分组？', {
        move: false,
        btn: ['确定', '取消']
    }, function () {
        $.getJSON('/admin/group/delete', {
            groupId: groupId
        }, function (res) {
            if (res.status === 1) {
                dom.parents('li').remove();
                layer.msg(res.msg);
            } else {
                layer.msg(res.msg);
            }
        });
    });
}


function pageTable(curr, groupId) {
    $('#tbody').data('groupId', groupId);
    $.getJSON('/admin/group/detail', {
        page: curr || 1,
        groupId: groupId
    }, function (res) {
        $('#tbody').empty();
        for (var i = 0; i < res.devices.length; i++) {
            $('#tbody').append(
                '<tr>'
                + '<td><input type="checkbox"></td>'
                + '<td>' + res.devices[i].device_id + '</td>'
                + '<td>' + res.devices[i].comment + '</td>'
                + '<td><a href="javascript:;">暂无</a></td>'
                + '</tr>'
            )
        }
        laypage({
            cont: 'pageDiv',
            pages: res.pages,
            curr: curr || 1,
            jump: function (obj, first) {
                if (!first) {
                    pageTable(obj.curr, groupId);
                }
            }
        });
    });
};