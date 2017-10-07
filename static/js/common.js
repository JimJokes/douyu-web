$(function(){
    // 根据浏览器几面高度调整弹幕列表高度
    var $chat = $('.chat'), $top = $('.navbar-static-top');
    $chat.height(window.innerHeight-$top.height()-41);
    window.onresize=function(){
        $chat.height(window.innerHeight-$top.height()-41);
    };
    //转换日期时间格式
    function dateConvert(date, format) {
        if(!date){
            return "";
        }
        date = parseInt(date);
        var Udate = new Date(date);
        var Y = Udate.getFullYear(),
            M = (Udate.getMonth() + 1) < 10 ? "0" + (Udate.getMonth() + 1) : (Udate.getMonth() + 1),
            D = Udate.getDate() < 10 ? "0" + Udate.getDate() : Udate.getDate(),
            h = Udate.getHours() < 10 ? "0" + Udate.getHours() : Udate.getHours(),
            m = Udate.getMinutes() < 10 ? "0" + Udate.getMinutes() : Udate.getMinutes(),
            s = Udate.getSeconds() < 10 ? "0" + Udate.getSeconds() : Udate.getSeconds();

        if (!format) {
            format = "Y-M-D h:m:s";
        }

        if (format.indexOf("Y") >= 0) {
            format = format.replace("Y", Y);
        }
        if (format.indexOf("M") >= 0) {
            format = format.replace("M", M);
        }
        if (format.indexOf("D") >= 0) {
            format = format.replace("D", D);
        }
        if (format.indexOf("h") >= 0) {
            format = format.replace("h", h);
        }
        if (format.indexOf("m") >= 0) {
            format = format.replace("m", m);
        }
        if (format.indexOf("s") >= 0) {
            format = format.replace("s", s);
        }

        return format;
    }
    // 导航栏切换
    $('.view').click(function(){
        if (!$(this).hasClass('active')) {
            $('.active').removeClass('active');
            $(this).addClass('active');
            var cl = $(this).data('id');
            $(cl).show();
            $(cl).siblings().hide();
        }
    });
    // 切换直播间
    $('.navbar-btn').click(function () {
        var $select = $('.form-control'),
        $id = $select.find('option:selected');
        if (!$id.hasClass('selected')) {
            $select.find('.selected').removeClass('selected');
            $id.addClass('selected');
            get_info();
        }
    });
    // 添加关注、直播间
    var $newModal = $('#newModal'), $removeModal = $('#removeModal'), reg=/^\+?[1-9][0-9]*$/;
    $newModal.on('show.bs.modal', function (event) {
        var $this = $(this), $button = $(event.relatedTarget), title = $button.text(), type = $button.data('type');
        $('#newModalLabel').text(title);
        if (type===1) {
            $('.control-label').text('输入直播间ID：');
            $('.add').bind('click', function () {
                var $name = $('#name'),
                    name = $name.val();
                if (reg.test(name)) {
                    $.ajax({
                        url: '/api/room/add',
                        type: 'post',
                        data: {
                            name: name
                        },
                        dataType: 'json',
                        success: function (result) {
                            if (result.success) {
                                if (result.data) {
                                    $('.room-empty').hide('fast');
                                    $('.room-list').append('<li class="list-group-item cell">\n' +
                                        '            <p data-id="' + result.data.id + '">' + result.data.roomId + '</p>\n' +
                                        '            <button type="button" class="btn btn-sm btn-danger" data-toggle="modal" data-target="#removeModal" data-type="1">删除直播间</button>\n' +
                                        '        </li>');
                                    $name.val('');
                                    $this.modal('hide');
                                }
                            }else {
                                $('#name-error').text(result.message).show('fast');
                            }
                        }
                    });
                }else {
                    $('#name-error').text('请输入正确的直播间ID！').show('fast');
                }
            })
        }else {
            $('.control-label').text('输入昵称：');
            $('.add').bind('click', function () {
                var $name = $('#name'),
                    name = $name.val();
                if (name) {
                    $.ajax({
                        url: '/api/follow/add',
                        type: 'post',
                        data: {
                            name: name
                        },
                        dataType: 'json',
                        success: function (result) {
                            if (result.success) {
                                if (result.data) {
                                    $('.follow-empty').hide('fast');
                                    $('.follow-list').append('<li class="list-group-item cell">\n' +
                                        '            <p data-id="' + result.data.id + '">' + result.data.name + '</p>\n' +
                                        '            <button type="button" class="btn btn-sm btn-danger" data-toggle="modal" data-target="#removeModal">取消关注</button>\n' +
                                        '        </li>');
                                    $name.val('');
                                    $this.modal('hide');
                                }
                            }else {
                                $('#name-error').text(result.message).show('fast');
                            }
                        }
                    });
                }else {
                    $('#name-error').text('请输入正确的昵称！').show('fast');
                }
            })
        }

    });
    // 设置输入框焦点
    $newModal.on('shown.bs.modal', function () {
        $('#name').focus();
    });
    // 错误提示处理
    $('#name').focus(function () {
       $('#name-error').hide('fast');
    });
    $newModal.on('hidden.bs.modal', function () {
        $('#name-error').hide('fast');
        $('.add').unbind('click');
    });
    // 取消关注、直播间
    $removeModal.on('show.bs.modal', function (event) {
        var $this = $(this),
            $button = $(event.relatedTarget),
            name = $button.prev('p').text(),
            id = $button.prev('p').data('id'),
            type = $button.data('type');
        if (type===1) {
            $('.para').html('确定删除直播间：<strong></strong> ?');
            $('.remove').bind('click', function () {
                $.ajax({
                    url: 'api/room/remove',
                    type: 'delete',
                    data: {
                        id: id
                    },
                    dataType: 'json',
                    success: function (result) {
                        if (result.success) {
                            $('#remove-error').hide('fast');
                            $this.modal('hide');
                            $button.parent('li').remove();
                            if ($('.room-list').find('.cell').length===0) {
                                $('.room-empty').show('fast');
                            }
                        }else {
                            $('#remove-error').text(result.message).show('fast');
                        }
                    }
                });
            });
        } else {
            $('.para').html('确定取消关注：<strong></strong> ?');
            $('.remove').bind('click', function () {
                $.ajax({
                    url: 'api/follow/remove',
                    type: 'delete',
                    data: {
                        id: id
                    },
                    dataType: 'json',
                    success: function (result) {
                        if (result.success) {
                            $('#remove-error').hide('fast');
                            $this.modal('hide');
                            $button.parent('li').remove();
                            if ($('.follow-list').find('.cell').length===0) {
                                $('.follow-empty').show('fast');
                            }
                        }else {
                            $('#remove-error').text(result.message).show('fast');
                        }
                    }
                });
            });
        }
        $this.find('.modal-body p strong').text(name);
    });
    $removeModal.on('hidden.bs.modal', function () {
        $('#remove-error').hide('fast');
        $('.remove').unbind('click');
    });
    // 直播间信息获取
    function get_room_info () {
        var $alert = $('#info-error');
        var roomid = $('.form-control').find('.selected').val();
        var url = '/api/info/' + roomid;
        $.ajax({
            url:url,
            type:'get',
            success:function (result) {
                result = JSON.parse(result);
                if (result.error === 0) {
                    $alert.hide('fast');
                    var data = result.data, room_status = data.room_status;
                    var now = new Date(), time = parseInt((now - new Date(data.start_time)) / (60 * 1000));
                    $('#room_thumb').attr('src', data.room_thumb).attr('title', data.room_name);
                    $('#room_name').text(data.room_name);
                    $('#owner_name').text(data.owner_name);
                    if (room_status === '2') {
                        $('#room_status').text('下播了');
                        $('#online').text('开播后显示');
                    } else if (room_status === '1') {
                        $('#room_status').text('直播中（已播' + time + '分钟)');
                        $('#online').text(data.online);
                    }
                    $('#start_time').text(data.start_time);
                    $('#fans_num').text(data.fans_num);
                    $('#owner_weight').text(data.owner_weight);
                    $('#update_time').text(dateConvert(now.getTime()));
                }else {
                    $alert.text(result.data).show('fast');
                }
            },
            error: function () {
                $alert.text('弹幕姬无响应，可能已退出').show('fast');
            }
        });
    }
    var interval;
    function get_info() {
        clearInterval(interval);
        get_room_info();
        // interval = setInterval(function () {
        //     get_room_info();
        // }, 10*1000);
    }
    get_info();

    if ('WebSocket' in window) {
        var ws = new WebSocket('ws://localhost:5000/message');

        ws.onopen = function () {
            ws.send(JSON.stringify({msg_type: 0}));
        };

        ws.onmessage = function (event) {
            var result = JSON.parse(event.data);
                console.log(result.data)
        };

        ws.onclose = function () {
            console.log('连接已关闭……')
        }
    }else {
        alert('浏览器不支持websocket，请更换浏览器')
    }
});