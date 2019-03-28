import * as mUtils from "./utils";

require("../css/style.css");

var $ = document.querySelector.bind(document),
  _g_today = mUtils.getToday();

function renderContent(jinfo){
  var bg = $('#J_bg'),
    box = $('#J_bodycontent');

  box.style.backgroundColor = jinfo.bg;
  bg.style.backgroundImage = "url('//cn.bing.com"+jinfo.bgs[jinfo.cbg]+"')";
  bg.style.filter ='blur(5px)';
  box.style.color = jinfo.co;

  $("h1").textContent = jinfo.ct.yinli;
  $('#J_item-yi').textContent = "宜: "+jinfo.ct.yi;
  $('#J_item-ji').textContent = "忌: "+jinfo.ct.ji;
  $('#J_item-wuxing span').textContent = jinfo.ct.wuxing;
  $('#J_item-chongsha span').textContent = jinfo.ct.chongsha;
  $('#J_item-baiji span').textContent = jinfo.ct.baiji;

  $('#J_content').style.opacity = 1;
  console.log(jinfo.ct);
}

function queryContent(){
  var api = "//service-dil3qmg6-1252745718.gz.apigw.tencentcs.com/release/get";
  fetch(api).then(function(response) {
    return response.json();
  }).then(function(jdata) {
    var ccode = jdata.color.code;
    var c1 = ccode.substring(0, 6);
    var c2 = ccode.substring(6, 12);
    var c3 = ccode.substring(12, 18);
    var c4 = ccode.substring(18, 24);

    c1 = mUtils.hexToRgb(c1);
    var bgcolor = 'rgba('+c1.r+','+c1.g+','+c1.b+', 0.8)',
      color = jdata.color.colorbr<100 ? '#ffffff' : '#'+c4;

    var jcontent = {bg:bgcolor, co: color, ct: jdata.result, cbg:0, bgs: jdata.bglist};

    renderContent(jcontent);
    mUtils.cache("colorcache", JSON.stringify(jcontent));
  }).catch(function(e){

  });
}

function initContent(refresh){
  var cachecl = mUtils.cache("colorcache");
  if(cachecl){
    cachecl = JSON.parse(cachecl);
    if(_g_today == cachecl.ct.yangli){
      if(refresh){
        cachecl.cbg += 1;
        cachecl.cbg = cachecl.cbg % cachecl.bgs.length;
        mUtils.cache("colorcache", JSON.stringify(cachecl));
      }

      return renderContent(cachecl);
    }
  }
  queryContent();
}

function initEvent(){
  $('#J_btn-refresh').addEventListener("click", function(e){
    initContent(true);
    e.preventDefault();
  });

  var btnfull = $('#J_btn-fullscreen');
  btnfull.addEventListener("click", function(e){
    e.preventDefault();
    if(btnfull.className.indexOf("btn-fullscreened")<0){
      document.body.requestFullscreen();
      btnfull.classList.add("btn-fullscreened");
    }else{
      document.exitFullscreen();
      btnfull.classList.remove("btn-fullscreened");
    }
  });

  if(mUtils.isFullScreen()){
    btnfull.classList.add("btn-fullscreened");
  }

  var _silenttimer = 0;

  var timesilent = function(micsec){
    micsec = micsec || 5000;
    _silenttimer = setTimeout(function(){
      document.body.classList.add("silent");
    }, micsec);
  };

  document.body.addEventListener('mousemove', function(){
    document.body.classList.remove("silent");
    clearTimeout(_silenttimer);
    timesilent();
  });

  timesilent(500);
}

initContent();
initEvent();

