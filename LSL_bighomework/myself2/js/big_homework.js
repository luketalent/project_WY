/**
 * Created by dell on 2016/12/20.
 */

function ajax(url,data,method,success,error) {
    var req= new XMLHttpRequest();
    var resA='';
    data = data || {},
    method = method || 'get',
    success = success || function(){},
    error =  error || function (f) { alert(url+'发生错误！')};
    //在send之前重置onreadystatechange方法,否则会出现新的同步请求会执行两次成功回调
    req.onreadystatechange = function() {
        // alert(url+"req.readyState"+req.readyState);
        if (req.readyState == 4){
            // alert(url+"req.status"+req.status);
            if (req.status  >= 200 && req.status < 300 || req.status == 304 || req.status == 0) {
                success && success(req.responseText);
            } else {
                error && error(req.status);
            }
        }
    };
    if(data)
    {
        var res = [];
        for(var i in data)
        {
            res.push(encodeURIComponent(i) + '=' + encodeURIComponent(data[i]));
        }
        resA = res.join('&');
    }
    if(method === 'get')
    {
        if (data)
        {
            url += '?' + resA;
        }
        req.open(method,url,true);
        req.send();
    }
    if(method === 'post')
    {
        req.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        req.open(method,url,true);
        req.send(resA);
    }
}
function removeAllChild() {
    var aCourse = getByclass(document,'course');
    for(var i=0;i<aCourse.length;i++){
        while(aCourse[i].hasChildNodes()) //当div下还存在子节点时 循环继续
        {
            aCourse[i].removeChild(aCourse[i].firstChild);
        }
    }
}
function setCookie(name,value,days) {
    var cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value);
    var exp = new Date();
    exp.setTime(exp.getTime() + days*24*60*60*1000);//setTime() 方法以毫秒设置 Date 对象。//getTime() 方法可返回距 1970 年 1 月 1 日之间的毫秒数。
    cookie += '; expires=' + exp.toGMTString();//toGMTString() 方法可根据格林威治时间 (GMT) 把 Date 对象转换为字符串，并返回结果。
    document.cookie = cookie;
}
function getCookie(name) {
    if (document.cookie.length>0)
    {
        var start=document.cookie.indexOf(name + "=");
        var end;
        if (start!=-1)
        {
            start=start + name.length+1;
            end=document.cookie.indexOf(";",start);
            if (end==-1) end=document.cookie.length;
            return decodeURIComponent(document.cookie.substring(start,end))
        }
    }
    else
    {
        return "";
    }
}
function removeCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval=getCookie(name);
    if(cval!=null){
        document.cookie= name + "="+cval+";expires="+exp.toGMTString();
    }
}
function addEvent( obj, type, fn ) {
    if ( obj.attachEvent ) {
        obj['e'+type+fn] = fn;
        obj[type+fn] = function()
        {
            obj['e'+type+fn]( window.event );
        };
        obj.attachEvent( 'on'+type, obj[type+fn] );
    } else
        obj.addEventListener( type, fn, false );
}
function addLoadEvent(func) {
    var oldonload = window.onload;
    if (typeof window.onload != 'function') {
        window.onload = func;
    } else {
        window.onload = function() {
            oldonload();
            func();
        }
    }
}
function getStyle(obj, name) {
    if(obj.currentStyle){
        return obj.currentStyle[name];
    }
    else{
        return getComputedStyle(obj,false)[name];
    }
}
function getByclass(obj, sClass) {
    var eAll=obj.getElementsByTagName("*");
    var result=[];
    var re=new RegExp('\\b'+sClass+'\\b', 'i');

    for (var i=0;i<eAll.length;i++){
        if(eAll[i].className.search(re)!=-1){
            result.push(eAll[i]);
        }
    }
    return result;
}
function startMove(obj,json,timNum,fnEnd) {
    clearInterval(obj.timer);
    obj.timer=setInterval(function () {
        //假设所有值都已经到了
        for(var arrt in json){
            var oStop=true;
            if(arrt=='opacity')
            {
                var cur=Math.round(parseFloat(getStyle(obj,arrt))*100);
            }
            else
            {
                var cur=parseInt(getStyle(obj,arrt));
            }
            var speed=(json[arrt]-cur)/10;
            speed=speed>0?Math.ceil(speed):Math.floor(speed);
            if(cur!=json[arrt]){
                oStop=false;
            }
            if(arrt=='opacity')
            {
                obj.style.filter='alpha(opacity:'+cur+speed+')';
                obj.style.opacity=(cur+speed)/100;
            }
            else
            {
                obj.style[arrt]=cur+speed+'px';
            }
        }
        if(oStop){
            clearInterval(obj.timer);
            if(fnEnd){
                fnEnd();
            }
        }
    },timNum);
};

/*通知栏*/
function hide1() {
    var oTip=document.getElementById('tip');
    oTip.style.display='none';
}
function tip1() {
    var oClose=document.getElementById('close1');
    addEvent(oClose,'click',function () {
        hide1();
        setCookie('tipclose','tipCookieValue',30)
    });
}
addLoadEvent(tip1);
function checkCookie() {
    if(getCookie('tipclose')){
        hide1();
    }
    if(getCookie('followSuc')){
        hideFollow();
    }
}
addEvent(window,"unbeforeunload",checkCookie());

/*登录*/
function Logshow() {
    var oFollow=document.getElementById('follow');
    var oLoC=document.getElementById('loginClose');
    var loginButton = document.getElementById("loginButton");
    var oCancel=document.getElementById('cancel');
    addEvent(oLoC,'click',function () {
        hide2();
    });
    addEvent(oFollow,'click',function () {
        if(getCookie('loginSuc')){
            hideFollow();
            setCookie("followSuc","followSucValue",30);
        }
        else{
            show2();
        }
    });
    addEvent(loginButton,'click',function () {
        if(checkFollow()){
            console.log(10);
            ajax(
                url = 'http://study.163.com/webDev/login.htm',
                data={
                    userName:md5("studyOnline"),
                    password:md5("study.163.com")
                },
                method='get',
                success=function (res) {
                    if(res==1){
                        hideFollow();
                        hide2();
                        setCookie("loginSuc","loginSucValue",30);
                        ajax(
                            url = 'http://study.163.com/webDev/attention.htm',
                            data={},
                            method='get',
                            success=function (res) {
                                console.log(res);
                                setCookie("followSuc","followSucValue",30);
                            }
                        )

                    }
                }
            )



        }
    });
    addEvent(oCancel,'click',function () {
        showFollow();
        removeCookie('followSuc');
    })
}
function checkFollow() {
    //获取用户输入的用户名和密码
    var userName = document.getElementById("userName").value,
        password = document.getElementById("password").value;
    //验证用户名和密码是否为空，不为空则
    if ((userName == "studyOnline") && (password == "study.163.com")){
        console.log(userName);
        console.log(password);
        return true;
    } else {
        alert("请正确输入用户名和密码")
    }
}
function show2() {
    var oMask=document.getElementById('mask');
    var oLog=document.getElementById('login');
    oMask.style.display='block';
    oLog.style.display='block';
};
function hide2() {
    var oMask=document.getElementById('mask');
    var oLog=document.getElementById('login');
    oMask.style.display='none';
    oLog.style.display='none';
}
function hideFollow() {
    var follow = document.getElementById("follow");
    var followSuc = document.getElementById("followSuc");
    followSuc.style.display = "inline";
    follow.style.display = "none";
}
function showFollow() {
    var follow = document.getElementById("follow");
    var followSuc = document.getElementById("followSuc");
    followSuc.style.display = "none";
    follow.style.display = "block";
}
/*function hideFoll(){
    var follow = document.getElementById("follow");
    follow.style.display = "none";
    var followSuc = document.getElementById("followSuc");
    followSuc.style.display = "block";
}*/
addLoadEvent(Logshow);

/*轮播*/
function tabfunc() {
    var oBanner=getByclass(document,'banner')[0];
    var aA=oBanner.getElementsByTagName('a');
    var aLi=oBanner.getElementsByTagName('li');
    var oPen=getByclass(oBanner,'open')[0];
    var oPd=getByclass(oBanner,'open_dot')[0];
    var doo=1;
    var count=0;
    var timer3=null;
    (function () {
        for(var i=0;i<aLi.length;i++){
            aLi[i].index=i;
            aA[i].index=i;
            addEvent(aLi[i],'click',function () {
                count=this.index;
                tab3(count);
                doo=count+1;
            });
        }
    })();
    function tab3(name) {
        //设置当前oPen和oPd
        oPen.style.opacity=0;
        oPen.style.display='none';
        oPen.className='';
        oPd.className='';
        oPd.style.backgroundColor='#fff';

        //更新oPen和oPd
        aA[name].className='open';
        oPen=getByclass(oBanner,'open')[0];
        oPen.style.opacity=0;
        oPen.style.display='block';
        aLi[name].className='open_dot';
        oPd=getByclass(oBanner,'open_dot')[0];
        oPd.style.backgroundColor='rgb(51,51,51)';
        startMove(oPen,{opacity:100},10);
    }
    function autotab3() {
        timer3=setInterval(function () {
                tab3(doo);
                doo++;
                if(doo>2){
                    doo=0;
                }
        },5000);
    }
    autotab3();
    addEvent(oBanner,'mouseover',function () {
        clearInterval(timer3);
    });
    addEvent(oBanner,'mouseout',function () {
        autotab3();
    });
}
addLoadEvent(tabfunc);

/*主内容区*/
/*右侧内容*/
function video() {
    var videoImg = document.getElementById("img_vid");
    var videoClose = document.getElementById("videoClose");
    addEvent(videoImg,"click",function() {
        showVideo();
    });
    addEvent(videoClose,"click",function() {
        hideVideo();
    });
    // 弹出视频弹窗函数
    function showVideo() {
        document.getElementById("mask").style.display = "block";
        document.getElementById("videoWin").style.display = "block";
    }
    // 点击关闭视频弹窗
    function hideVideo() {
        document.getElementById("mask").style.display = "none";
        var videoWin = document.getElementById("videoWin");
        var video = document.getElementById("video");
        videoWin.style.display = "none";
        video.pause(); //停止视频播放
    }
}
addLoadEvent(video);

function rightajax() {
    var result=null;
    eleLi = '';
    count=0;
    var eleUl=getByclass(document,'right4_dul')[0];
    var num=10;
    function createNode(result) {
        var oRdNode = document.createElement('li'),
         oRdImg = document.createElement('img'),
         oRdh3 = document.createElement('h3'),
         oRddiv = document.createElement('div'),
         oRdSpan = document.createElement('span');
        oRdNode.setAttribute('class','right4_dli');
        oRdImg.setAttribute('class','img_right4');
        oRdSpan.setAttribute('class','imgsml_right4');

        oRdImg.src=result.smallPhotoUrl;
        oRdh3.innerHTML=result.name;
        oRdSpan.innerHTML=result.learnerCount;

        oRdNode.appendChild(oRdImg);
        oRdNode.appendChild(oRdh3);
        oRdNode.appendChild(oRddiv);
        oRddiv.appendChild(oRdSpan);
        return oRdNode;
    };
    ajax(
        url = 'http://study.163.com/webDev/hotcouresByCategory.htm',
        data = {},
        method = 'get',
        success = function(res) {
            result = JSON.parse(res);
            for (var i=0; i<10; i++) {
                eleUl.appendChild(createNode(result[i]));
            }
        }
    );
    if(eleUl.childNodes[0]){
        eleUl.removeChild(eleUl.childNodes[0]);
    }
    setInterval(function () {
        eleUl.removeChild(eleUl.childNodes[0]);
        eleUl.appendChild(createNode(result[num]));
        num == 19 ? num = 0 : num++;
    },5000);
}
addLoadEvent(rightajax);

/*左侧内容*/
//ajax请求
function leftajax(pageNo,psize,ptype,evelNum) {
    var eleUlleft=getByclass(document,'course');
    var result=null;
    function CreateNode(res) {
        /*默认显示*/ 
        var oLtNode = document.createElement('li');
            oLtDiv0=document.createElement('div');
            oLtImg = document.createElement('img'),

            oLtDiv = document.createElement('div'),
            oLtP1 = document.createElement('p'),
            oLtP2 = document.createElement('p'),
            oLtSp = document.createElement('span'),
            oLtP3 = document.createElement('p');
        //level 1
        oLtNode.appendChild(oLtDiv0);
        oLtDiv0.appendChild(oLtImg);
        oLtDiv0.appendChild(oLtDiv);
        //level 2
        oLtDiv.appendChild(oLtP1);
        oLtDiv.appendChild(oLtP2);
        oLtDiv.appendChild(oLtSp);
        oLtDiv.appendChild(oLtP3);
        //set className
        oLtDiv.setAttribute('class','unhover4');
        oLtP1.setAttribute('class','cont4');
        oLtP2.setAttribute('class','group4');
        oLtSp.setAttribute('class','num4');
        oLtP3.setAttribute('class','money');
        
        //hover显示
        var oLtDivh4 = document.createElement('div'),

            oLtDivh4up = document.createElement('div'),
            oLtImgh = document.createElement('img'),

            oLtDivh4r = document.createElement('div'),
            oLtH3h = document.createElement('h3'),
            oLtPhNum = document.createElement('span'),
            oLtSph1 = document.createElement('span'),

            oLtDivh4r1 = document.createElement('div'),
           // oLtSph2 = document.createElement('span'),

            oLtDivh4r2 = document.createElement('div'),
          //  oLtSph3 = document.createElement('span'),

            oLtDivh4d = document.createElement('div'),
            oLtDivh4dp = document.createElement('p');
        //level 1
        oLtNode.appendChild(oLtDivh4);
        oLtDivh4.appendChild(oLtDivh4up);
        oLtDivh4.appendChild(oLtDivh4d);
        oLtDivh4d.appendChild(oLtDivh4dp);
        //level2
        oLtDivh4up.appendChild(oLtImgh);
        oLtDivh4up.appendChild(oLtDivh4r);
        //level3
        oLtDivh4r.appendChild(oLtH3h);
        oLtDivh4r.appendChild(oLtPhNum);
        oLtDivh4r.appendChild(oLtDivh4r1);
        oLtDivh4r.appendChild(oLtDivh4r2);
        oLtDivh4r.appendChild(oLtSph1);
        //set className
        oLtDivh4.setAttribute('class','hover4');
        oLtDivh4up.setAttribute('class','hover4up');
        oLtDivh4r.setAttribute('class','hover4r');
        oLtPhNum.setAttribute('class','hoverNum');
        oLtDivh4r1.setAttribute('class','hoverPub');
        oLtDivh4r2.setAttribute('class','hoverGroup');
        oLtDivh4d.setAttribute('class','hover4d');
        //set value
        oLtSph1.innerHTML = '人在学';
        oLtImg.src = res.middlePhotoUrl;
        oLtP1.innerHTML = res.name;
        oLtP2.innerHTML = res.provider;
        oLtSp.innerHTML = res.learnerCount;
        oLtP3.innerHTML ='¥'+ res.price;

        oLtImgh.src = res.middlePhotoUrl;
        oLtH3h.innerHTML = res.name;
        oLtPhNum.innerHTML = res.learnerCount;
        oLtDivh4r1.innerHTML = '发布者： '+res.provider;
        oLtDivh4r2.innerHTML = '分类： '+res.categoryName;
        oLtDivh4dp.innerHTML = res.description;

        return oLtNode;
    };
    ajax(
        url = 'http://study.163.com/webDev/couresByCategory.htm',
        data = {
            pageNo: pageNo,
            psize: psize,
            type: ptype
        },
        method = 'get',
        success = function(res) {
            var count=0;
            result = JSON.parse(res);
            result=result.list;
            removeAllChild();
            for(var i=0;i<eleUlleft.length;i++){
                for(var j=0;j<evelNum;j++){
                    eleUlleft[i].appendChild(CreateNode(result[j+count]));
                }
                count+=4;
            }
        }
    )
}
//页码变化
function chosePag(playNum,typenum,evelNum) {
    leftajax(1,playNum,typenum,evelNum);
    var pageNum=1;
    var pageUl=getByclass(document,'page')[0];
    var aLi=pageUl.getElementsByTagName('li');
    var PaCur=null;
    var page_Log=getByclass(document,'page_currentlog');
    var oL4_title=getByclass(document,'left4_title')[0];
    var aH2=oL4_title.getElementsByTagName('h2');
    for(var i=0;i<aLi.length;i++){
        aLi[i].index=i;
        addEvent(aLi[i],'click',function () {
            if(aH2[1].getAttribute('class','left4_title_current')){
                typenum=20;
            }
            if((aH2[0].getAttribute('class','left4_title_current'))){
                typenum=10;
            }
            console.log(typenum);
            PaCur=getByclass(document,'page_current')[0];
            PaCur.setAttribute('class','');
            pageNum=aLi[this.index].innerHTML;
            aLi[this.index].setAttribute('class','page_current');
            leftajax(pageNum,playNum,typenum,evelNum);
        });
    }
    addEvent(page_Log[0],'click',function () {
        if(pageNum>1){
            pageNum--;
            if(aH2[1].getAttribute('class','left4_title_current')){
                typenum=20;
            }
            if((aH2[0].getAttribute('class','left4_title_current'))){
                typenum=10;
            }
            leftajax(pageNum,playNum,typenum,evelNum);
            PaCur=getByclass(document,'page_current')[0];
            PaCur.setAttribute('class','');
            aLi[pageNum-1].setAttribute('class','page_current');
        }
    });
    addEvent(page_Log[1],'click',function () {
        if(pageNum>9){
            pageNum=pageNum/10
        }
        console.log(pageNum);
        if(pageNum<8){
            console.log(pageNum);
            pageNum++;
            if(aH2[1].getAttribute('class','left4_title_current')){
                typenum=20;
            }
            if((aH2[0].getAttribute('class','left4_title_current'))){
                typenum=10;
            }
            leftajax(pageNum,playNum,typenum,evelNum);
            PaCur=getByclass(document,'page_current')[0];
            PaCur.setAttribute('class','');
            aLi[pageNum-1].setAttribute('class','page_current');
        }
    });

}
//选择课程
function tab4(tag,evelNum) {
    chosePag(tag,10,evelNum);
    var oL4_title=getByclass(document,'left4_title')[0];
    var aH2=oL4_title.getElementsByTagName('h2');
    var oPgcur=null;
    addEvent(aH2[0],"click",function () {
        removeAllChild();
        oPgcur=getByclass(document,'left4_title_current')[0];
        oPgcur.setAttribute('class','');
        aH2[0].setAttribute('class','left4_title_current');
        chosePag(tag,10,evelNum);
    });
    addEvent(aH2[1],"click",function () {
        removeAllChild();
        oPgcur=getByclass(document,'left4_title_current')[0];
        oPgcur.setAttribute('class','');
        aH2[1].setAttribute('class','left4_title_current');
        chosePag(tag,20,evelNum);
    });
}
//窗口大小变化
function changeNum() {
    var tag=null;
    var oLef4=getByclass(document,'left4')[0];
    var oLef4Con=getByclass(document,'left4_content')[0];
    if(document.body.clientWidth>=1205){
        tag=20;
        tab4(tag,4);
    }
    else{
        tag=15;
        tab4(tag,3);
        oLef4.style.width=735+'px';
        oLef4Con.style.width=737+'px';
        oLef4.style.marginLeft=240+'px';
    }
    addEvent(window,'resize',function () {
        if(tag==15){
            if(document.body.clientWidth>=1205){
                tag=20;
                tab4(tag,4);
                oLef4.style.width=958+'px';
                oLef4Con.style.width=960+'px';
                oLef4.style.marginLeft=0+'px';

            }
        }
        else{
            if(document.body.clientWidth<1205){
                tag=15;
                tab4(tag,3);
                oLef4.style.width=735+'px';
                oLef4Con.style.width=737+'px';
                oLef4.style.marginLeft=240+'px';
            }
        }
    })
}
addLoadEvent(changeNum);