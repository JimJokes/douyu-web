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
            var cl = $(this).attr('data-id');
            $(cl).show();
            $(cl).siblings().hide();
        }
    });
    var roomid = $('.form-control').find('.selected').val();
    var interval;

    // 切换直播间
    $('.navbar-btn').click(function () {
        var $select = $('.form-control'),
        $id = $select.find('option:selected');
        if (!$id.hasClass('selected')) {
            $select.find('.selected').removeClass('selected');
            $id.addClass('selected');
            roomid = $id.val();
            get_info();
        }
    });
    // 动态加载模态框数据
    $('#removeModal').on('show.bs.modal', function (event) {
       var button = $(event.relatedTarget),
           name = button.data('name'),
           modal = $(this);
       modal.find('.modal-body p span').text(name);
    });
    // 添加关注
    $('.add').click(function () {
        var name = $('#name').val();
        if (name) {
            
        }
    });
    // 直播间信息获取
    function get_room_info () {
        var $alert = $('.alert-danger');
        var url = '/api/info/' + roomid;
        $.ajax({
            url:url,
            type:'get',
            success:function (result) {
                result = JSON.parse(result);
                if (result.error === 0) {
                    $alert.hide();
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
                }else if (result.error === 101) {
                    $alert.show();
                    $alert.text(result.data)
                }
            },
            error: function () {
                $alert.show();
                $alert.text('弹幕服务器无响应，可能已退出')
            }
        });
    }
    // function get_info() {
    //     clearInterval(interval);
    //     get_room_info();
    //     interval = setInterval(function () {
    //         get_room_info();
    //     }, 10*1000);
    // }
    // get_info()
});