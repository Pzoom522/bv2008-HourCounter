var stab='';
$(function(){
    C.tabs({"selected":stab,"params":
        [
            {"nav":"#nav_pwd","con":"#pwd","sclass":"current","nclass":""},
            {"nav":"#nav_login","con":"#login","sclass":"current","nclass":""}
        ]
    });
    C.tabs({"selected":stab,"params":
        [
            {"nav":"#nav_qvol","con":"#qvol","sclass":"current","nclass":""},
            {"nav":"#nav_qcert","con":"#qcert","sclass":"current","nclass":""}
        ]
    });
    C.tabs({"selected":stab,"params":
        [
            {"nav":"#tabs1","con":"#con1","sclass":"current","nclass":""},
            {"nav":"#tabs2","con":"#con2","sclass":"current","nclass":""},
            {"nav":"#tabs3","con":"#con3","sclass":"current","nclass":""},
            {"nav":"#tabs4","con":"#con4","sclass":"current","nclass":""},
            {"nav":"#tabs5","con":"#con5","sclass":"current","nclass":""}
        ]
    });
    var explode=C.cookie.get('explode');
    //搜索条件折叠展开
    if(explode==0 || explode==''){
        $('#search_form').css({'height':'auto','overflow':'hidden'});
        $('#explode_div>a').html('收起');
    }else{
        $('#search_form').css({'height':'55px','overflow':'hidden'});
        $('#explode_div>a').html('更多筛选条件');
    }
    $('#explode_div>a').click(function(){
        if($('#search_form').height()==55){
            $('#search_form').css({'height':'auto'});
            $(this).html('收起');
            C.cookie.set('explode',0,24);
        }else{
            $('#search_form').css({'height':'55px'});
            $(this).html('更多筛选条件');
            C.cookie.set('explode',1,24);
        }
    });
});
//登录
function login(o){
    var p=$(o).parent();p.html('<a href="javascript:void(0);" class="but1">登录中</a>');
    var postdata=C.form.get_form('#ulogin');//alert(host);
    var pubkey='-----BEGIN PUBLIC KEY-----';
        pubkey+='MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCbJ2QYNdiFlzE0mcyq7tcZc5dP';
        pubkey+='vof6696l2cJJM8kOxeXT8EonfvLzfsEGmwjNp3gvAyF14LvqT6w7oH40sFFnX358';
        pubkey+='Eb+HZXx6CZ4LOkaTW0KNS6yodsRv0uwJhFMwREqEVbqd6jcCxTGKDOieendC8x1f';
        pubkey+='sg3Muagyfawc+o+tewIDAQAB';
        pubkey+='-----END PUBLIC KEY-----';
        // 利用公钥加密
        var encrypt = new JSEncrypt();
        encrypt.setPublicKey(pubkey);
        var upass = encrypt.encrypt(postdata['upass']);
        postdata['upass']=upass;
    //alert(encrypted);return;
    $.post('/app/user/login.php?m=login', postdata, function(data) {
        p.html('<a href="javascript:void(0);" class="but1" onclick="login(this);">登录</a>');
        $('#vcode_img').click();
        try {
            var ret = $.evalJSON(data);
            if(ret.code==0){
                window.location.href=ret.referer;
            }else if(ret.code==2){
                
                C.alert.confirm({width:500,height:300,content:ret.msg,funcOk:function(){
                    var vol_district1=$('#vol_district1').val();
                    if(vol_district1==0) {
                        alert('请选择区域');
                        return false;
                    }
                    postdata['vol_district1']=vol_district1;
                    $.post('/app/user/login.php?m=move', postdata, function(data) {
                        C.alert.opacty_close();
                        try {
                            var ret = $.evalJSON(data);
                            if(ret.code==0){
                                C.alert.alert({content:ret.msg,funcOk:function(){
                                    $('body').append(ret.html);
                                }});
                            }else{
                                C.alert.alert({content:ret.msg});
                            }
                        } catch (e) {
                            C.alert.show('error:'+data);
                        }
                    });
                }});
            }else{
                C.alert.alert({content:ret.msg,funcOk:function(){
                        $('#'+ret.id).focus();
                }});
            }
        } catch (e) {
            C.alert.show('error:'+data);
        }
    });
}
//加入项目
function opp_join(opp_id,job_id,type,ques){
    var q=ques.split(/###/);
    
    var chtml='<div style="margin:10px;">';
    var cheight=140;
    var cwidth=300;
    if(type==1) chtml='请输入免审密码<br><input type="password" id="opp_pwd" class="ipt1" value="">';
    if(q.length>1 && ques!='') {
        var qstr='';
        for(var i=0;i<q.length;i++){
            qstr+='问：'+q[i]+'\r\n答：\r\n\r\n';
        }
        chtml+='<br>请回答以下问题<br><textarea id="answer" class="txt1" style="width:600px;">'+qstr+'</textarea><br><br>';
        cheight=cheight+200;
        cwidth=700;
    }
    chtml+='</div>';
    
    if(chtml!='<div style="margin:10px;"></div>'){
        C.alert.confirm({title:'免审加入',height:cheight,width:cwidth,
            content:chtml,
            funcOk:function(){
                var opp_pwd=$('#opp_pwd').val();
                var answer=$('#answer').val();
                $.post('/app/api/view.php?m=opp_join', {opp_id:opp_id,job_id:job_id,opp_pwd:opp_pwd,answer:answer}, function(data) {
                    try {
                        var ret = $.evalJSON(data);
                        C.alert.alert({content:ret.msg});

                    } catch (e) {
                        C.alert.show('error:'+data);
                    }
                    C.alert.opacty_close();
                });
            }
        });
    }else{
        $.post('/app/api/view.php?m=opp_join', {opp_id:opp_id,job_id:job_id}, function(data) {
            try {
                var ret = $.evalJSON(data);
                C.alert.alert({content:ret.msg});

            } catch (e) {
                C.alert.show('error:'+data);
            }
            C.alert.opacty_close();
        });
    }
    
}
//找回密码
function get_pwd(o){
    $('.v_result').html('');
    var marea='#pwd';
    var mdiv=$(marea);
    var p=$(o).parent();p.html('<a href="javascript:void(0);" class="but1">提交中</a>');
    var postdata=C.form.get_form(marea);
    
    $.post('getpwd.php?m=get_pwd', postdata, function(data) {
        p.html('<a href="javascript:void(0);" class="but1" onclick="get_pwd(this);">提交</a>');
        try {
            var ret = $.evalJSON(data);
            if(ret.code=='1'){
                mdiv.find("#"+ret.id).focus();
                mdiv.find("#"+ret.id).parent().parent().find('.v_result').html(ret.msg);
            }else{
                C.alert.show(ret.msg);
            }
        } catch (e) {
            C.alert.show('error:'+data);
        }
        C.alert.opacty_close();
    });
}
//读取评论列表
function get_comment(type,id,p){
    $.get('/app/api/view.php?m=get_comment', {type:type,id:id,p:p}, function(data) {
        $('#comment').html(data);
    });
}
//获取团体发起项目列表
function get_opps(type,id,p){
    $.get('/app/api/view.php?m=get_opps', {type:type,id:id,p:p}, function(data) {
        $('#opps').html(data);
    });
}
//获取志愿者参与团体列表
function get_orgs(id,p){
    $.get('/app/api/view.php?m=get_orgs', {id:id,p:p}, function(data) {
        $('#orgs').html(data);
    });
}
//发布评论
function do_reply(o){
    $('.v_result').html('');
    var marea='#creply';
    var mdiv=$(marea);
    var p=$(o).parent();p.html('评论中');
    var postdata=C.form.get_form(marea);
    $.post('/app/api/view.php?m=do_reply', postdata, function(data) {
        p.html('<a href="javascript:void(0);" class="but1" onclick="do_reply(this);">发布评论</a>');
        try {
            var ret = $.evalJSON(data);
            if(ret.code=='1'){
                C.alert.alert({content:ret.msg,funcOk:function(){$('#content').focus();}});
            }else{
                C.alert.alert({content:ret.msg,funcOk:function(){
                        get_comment(postdata.comment_type,postdata.source_id,1)
                }});
            }
        } catch (e) {
            C.alert.show('error:'+data);
        }
        C.alert.opacty_close();
    });
}
//显示回复
function show_reply(parent_id,uid_reply){
    $('#creply').find('#parent_id').val(parent_id);
    $('#creply').find('#uid_reply').val(uid_reply);
    C.alert.opacty({title:'回复评论',width:700,height:260,div_tag:'#creply'});
}
//读取项目动态列表
function get_track(id,p){
    $.get('/app/api/view.php?m=get_track', {id:id,p:p}, function(data) {
        $('#tracks').html(data);
    });
}
//读取时长公示列表
function get_hour(id,p){
    $.get('/app/api/view.php?m=get_hour_list', {id:id,p:p}, function(data) {
        $('#hour_list').html(data);
    });
}
//时长举报
function hour_tips(hour_id){
    C.alert.confirm({title:'服务时长举报',width:650,height:140,
            content:'<div style="margin:10px 10px 10px 50px;float:left;">举报理由：<input type="text" id="memo_hour" style="width:300px;" class="ipt1" value=""><span id="memo_hour_alert" style="color:red;margin-left:10px;"></span></div>',
            funcOk:function(){
                var memo_hour=$('#memo_hour').val();
                $.post('/app/api/view.php?m=hour_tips', {hour_id:hour_id,memo_hour:memo_hour}, function(data) {
                    try {
                        var ret = $.evalJSON(data);
                        if(ret.code==1){
                            $('#memo_hour_alert').html(ret.msg);
                        }else{
                            C.alert.alert({content:ret.msg});
                            C.alert.opacty_close();
                        }
                    } catch (e) {
                        C.alert.show('error:'+data);
                    }
                });
            }
        });
}
//发布动态
function do_track(o){
    $('.v_result').html('');
    var marea='#track';
    var mdiv=$(marea);
    var p=$(o).parent();p.html('发布中');
    var postdata=C.form.get_form(marea);
    $.post('/app/api/view.php?m=do_track', postdata, function(data) {
        p.html('<a href="javascript:void(0);" class="but1" onclick="do_track(this);">发布动态</a>');
        try {
            var ret = $.evalJSON(data);
            if(ret.code=='1'){
                C.alert.alert({content:ret.msg,funcOk:function(){$('#track_img').focus();}});
            }else{
                C.alert.alert({content:ret.msg,funcOk:function(){
                        $('#track_img').val('');
                        $('#track_content').val('');
                        get_track(postdata.opp_id,1);
                }});
            }
        } catch (e) {
            C.alert.show('error:'+data);
        }
        C.alert.opacty_close();
    });
}
//找回用户名
function get_login(o,type){
    $('.v_result').html('');
    var marea=type==1?'#vol_login':'#org_login';
    var mdiv=$(marea);
    var p=$(o).parent();p.html('<a href="javascript:void(0);" class="but1">提交中</a>');
    var postdata=C.form.get_form(marea);
    postdata['service_type']=[];
    
    $.post('getpwd.php?m='+(type==1?'get_vol_login':'get_org_login'), postdata, function(data) {
        p.html('<a href="javascript:void(0);" class="but1" onclick="get_login(this,'+type+');">提交</a>');
        try {
            var ret = $.evalJSON(data);
            if(ret.code=='1'){
                mdiv.find("#"+ret.id).focus();
                mdiv.find("#"+ret.id).parent().parent().find('.v_result').html(ret.msg);
            }else{
                C.alert.show(ret.msg);
            }
        } catch (e) {
            C.alert.show('error:'+data);
        }
        C.alert.opacty_close();
    });
}
//重设密码
function reset_pwd(o){
    $('.v_result').html('');
    var marea='#reset_pwd';
    var mdiv=$(marea);
    var p=$(o).parent();p.html('查询中');
    var postdata=C.form.get_form(marea);
    postdata['service_type']=[];
    
    $.post('getpwd.php?m=reset_pwd', postdata, function(data) {
        p.html('<a href="javascript:void(0);" class="but1" onclick="reset_pwd(this);">重设密码</a>');
        try {
            var ret = $.evalJSON(data);
            if(ret.code=='1'){
                mdiv.find("#"+ret.id).focus();
                mdiv.find("#"+ret.id).parent().parent().find('.v_result').html(ret.msg);
            }else{
                C.alert.alert({content:ret.msg,funcOk:function(){
                        window.location.href="/app/user/login.php";
                }});
            }
        } catch (e) {
            C.alert.show('error:'+data);
        }
        C.alert.opacty_close();
    });
}
//加入团体
function org_join(org_id,type){
    if(type==1){
        C.alert.confirm({title:'免审加入',height:140,
            content:'<div style="margin:10px;">请输入免审密码：<input type="password" id="org_pwd" class="ipt1" value=""></div>',
            funcOk:function(){
                var org_pwd=$('#org_pwd').val();
                $.post('/app/api/view.php?m=org_join', {org_id:org_id,org_pwd:org_pwd}, function(data) {
                    try {
                        var ret = $.evalJSON(data);
                        C.alert.alert({content:ret.msg});

                    } catch (e) {
                        C.alert.show('error:'+data);
                    }
                    C.alert.opacty_close();
                });
            }
        });
    }else{
        $.post('/app/api/view.php?m=org_join', {org_id:org_id}, function(data) {
            try {
                var ret = $.evalJSON(data);
                C.alert.alert({content:ret.msg});

            } catch (e) {
                C.alert.show('error:'+data);
            }
            C.alert.opacty_close();
        });
    }
}
function exam_list(){
    var postdata=C.form.get_form('#exam_list');
    $.post("/app/train/exam.php?m=score",postdata, function(data){
        try{
            var json=$.evalJSON(data);
            if(json.code==0){
                if(json.score>=60){
                    C.alert.alert({content:'答题完毕，本次得分：'+json.score+' 分，通过测试。'});
                }else{
                    C.alert.alert({content:'答题完毕，本次得分：'+json.score+' 分'});
                }
                clearInterval(exintval);
                for(var i=0;i<json.data.length;i++){
                    if(json.data[i].rasr=='1'){
                        $("#right_"+json.data[i].exam_id).html('<font color=green>答题正确</font>');
                    }else{
                        $("#right_"+json.data[i].exam_id).html('<font color=red>答题错误，正确答案：'+json.data[i].ras+'</font>');
                    }
                    $(".ans").attr({'disabled':'disabled'});
                }
            }else{
                if(json.href!=''){
                    C.alert.alert({content:json.msg,funcOk:function(){
                            window.location.href='#no_'+json.href;
                    }});
                }
            }
        }catch(e){
            C.alert.alert({content:data});
        }
    });
}

function show_cpl(){
    C.alert.opacty({'title':'我要投诉','width':'600','height':'330','div_tag':'#add_cpl'});
}

function add_cpl(o){
    $('.v_result').html('');
    var marea='#add_cpl';
    var mdiv=$(marea);
    var p=$(o).parent();p.html('提交中');
    var postdata=C.form.get_form(marea);
    
    $.post('/app/api/view.php?m=add_cpl', postdata, function(data) {
        p.html('<a href="javascript:void(0);" class="but1" onclick="add_cpl(this);">提交数据</a>');
        try {
            var ret = $.evalJSON(data);
            if(ret.code=='1'){
               C.alert.alert({content:ret.msg,funcOk:function(){
                     mdiv.find("#"+ret.id).focus();
                     mdiv.find("#"+ret.id).parent().parent().find('.v_result').html(ret.msg);
                }});
            }else{
                alert('投诉提交成功');
                C.alert.opacty_close(marea);
            }
        } catch (e) {
            C.alert.show('error:'+data);
        }
        
    });
}
