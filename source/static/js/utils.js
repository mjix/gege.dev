export function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

export function cache(key, val){
  var l = localStorage;
  if(typeof key == 'string'){
    if(typeof val == 'undefined'){
      return l.getItem(key);
    }else{
      return l.setItem(key, val);
    }
  }
  for(var k in key){
    l.setItem(k, key[k]);
  }
}

function fixnum(num){
  return num<10 ? '0'+num : num;
}

export function getToday(){
  var day = new Date();
  return day.getFullYear()+'-'+fixnum(day.getMonth()+1)+'-'+fixnum(day.getDate());
}

export function isFullScreen(){
  return window.innerWidth == screen.width && window.innerHeight == screen.height;
}