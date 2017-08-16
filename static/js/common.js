$(function(){
    $('.view').click(function(){
        if($('#attenclick').hasClass('active')){
            $('#all').show();
            $('#attention').hide();
            $('#attenclick').removeClass('active');
            $('#allclick').addClass('active');
        }else {
        	$('#all').hide();
            $('#attention').show();
            $('#attenclick').addClass('active');
            $('#allclick').removeClass('active');
        }
    });
});