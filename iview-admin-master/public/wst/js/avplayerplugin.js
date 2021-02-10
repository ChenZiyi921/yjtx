/*
 * Name: AvPlayerPlugin
 * Description: PlayBack by IE/Chrome Plugin for audio/video collected form GSM/WCDMA/LTE/IMS 
 * author guolin@easytel.com.cn
 * date: 2020-03-04
*/
	
function IEVersion() {
  var userAgent = navigator.userAgent;			 //Read userAgent string of IE	
  var isIE	 = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //if IE with versio<11  
  var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; 							   //If Edge IE
  var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1; //if IE with versio>=11
  if(isIE) {
    var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
    reIE.test(userAgent);
    var fIEVersion = parseFloat(RegExp["$1"]);
    if(fIEVersion == 7) return 7;
    else if(fIEVersion == 8) return 8;
    else if(fIEVersion == 9) return 9;
    else if(fIEVersion == 10) return 10;
    else return 6;                 //IE version <= 7
  }else if(isEdge) return 'edge';  //edge
  else if(isIE11) return 11;       //IE11
  else return -1;                  //no IE
}

var  ietype = IEVersion();
switch(ietype) {
  case -1:
  	console.log("AvPlayer running by no-IE, Chrome likely");
  	break;
  case 8:
  case 9:
//	  document.write('<script type="text/javascript" src="js/swfobject.js"><\/script>');
//	  document.write('<script type="text/javascript" src="js/web_socket.js"><\/script>');
//	  WEB_SOCKET_SWF_LOCATION = "js/WebSocketMain.swf";
  case 10:
  case 7:
  case 6:
	console.log("AvPlayer running by IE", ietype, ",and need to change brower");
    break;
  default:
    console.log("AvPlayer running by IE", ietype);
}

if(!String.prototype.repeat) {
  String.prototype.repeat = function(num)  {
	return new Array(num + 1).join(this);
  };
}

function S2time(s){
  var h = parseFloat(s/3600) | 0;
  var m = parseFloat((s/60)%60) | 0;
  s = parseFloat(s%60) | 0;
  return (h==0?"":(h<10? '0'+h+':':h+':')) + (m<10? "0"+m:m)+":"+(s<10?"0"+s:s);
}

function Base64ToUint8Array(base64String) {
  padding = '='.repeat((4 - base64String.length % 4) % 4);
  base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');

  rawData = window.atob(base64);
  outputArray = new Uint8Array(rawData.length);

  for (i=0; i<rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

var Event = {};
Event.addEvents = function(target,eventType,handle){
  if(document.addEventListener){
	Event.addEvents = function(target,eventType,handle){
	  target.addEventListener(eventType,handle,false);
	};
  }else{
	Event.addEvents = function(target,eventType,handle){
	  target.attachEvent('on'+eventType,function(){
		handle.call(target,arguments);
	  });
	};
  };
  Event.addEvents(target,eventType,handle);
};

Event.removeEvents = function(target,eventType,handle){
  if(target.removeEventListener){
	  target.removeEventListener(eventType,handle);
  }else if(target.detachEvent) {
	  target.detachEvent('on'+eventType,handle);
  }else target['on' + eventType] = null;
};

function TskList() {
	this.TskArray = new Array([], [], []);
}

TskList.prototype = {
  /***  Allocate a New Button Object ***/
  _pushTsk: function(cb, para, ifgoon) {
    this.TskArray[0].unshift(cb);       //execute function
	this.TskArray[1].unshift(para);     //para data
	this.TskArray[2].unshift(ifgoon);   //if cycle to execute when finished, true:continue
  },

  _popTsk: function(obj) {
    var fn = obj.TskArray[0].pop();
	if(!!fn) {
	  var pa= obj.TskArray[1].pop();
	  if(!!pa) fn(pa);
	  else fn();
	  return obj.TskArray[2].pop();
	}else return false;
  },

  _getLength: function(obj) {
    return obj.TskArray[0].length;
  },
}

function CtxDrawRect(obj, s, e) {
  if(s == e) return;
  obj.fillStyle = 'rgba(255, 255, 255, 0.4)';
  obj.globalCompositeOperation="lighter";
  obj.fillRect(s, 0, e-s, 60);
}

function CtxClrRect(obj, s, e) {
  if(s == e) return;
  obj.clearRect(s, 0, e-s, 60);
}

function ShadowDsp(sdid) {

  this.e_sdcvs = document.getElementById(sdid);

  this.cvsheight = this.e_sdcvs.offsetHeight;
  this.cvswidth = this.e_sdcvs.offsetWidth;

  this.e_sdcvs.setAttribute("height",this.cvsheight);
  this.e_sdcvs.setAttribute("width",this.cvswidth);
  this.sdctx = this.e_sdcvs.getContext("2d");
  this.sdctx.globalCompositeOperation="lighter";

  this.start = 0;
  this.end = 0;
  this.sdctx.fillStyle = 'rgba(255, 255, 255, 0)';

}

ShadowDsp.prototype = {
  _paintShd: function(sp, ep) {
    if(this.e_sdcvs.offsetWidth != this.cvswidth) {
      this.cvswidth = this.e_sdcvs.offsetWidth;
	  this.e_sdcvs.setAttribute("width",this.cvswidth);
	  this.e_sdcvs.setAttribute("height",60);
    }

	var ss = parseInt(this.cvswidth * sp / 100);
	var ee = parseInt(this.cvswidth * ep / 100);
	if(ss == this.cvswidth) ss = this.cvswidth - 1;
	if(ee == this.cvswidth) ee = this.cvswidth - 1;

	this.sdctx.fillStyle = 'rgba(255, 255, 255, 0.8)';

	var s = (ss > this.start) ? 1 : ((ss == this.start) ? 0 : -1);
	var e = (ee > this.end) ? 1 : ((ee == this.end) ? 0 : -1);
	var m = s + e;
	switch(m) {
      case -2:
	  	if(ee > this.start) {
		  CtxClrRect(this.sdctx, ee, this.end);
		  CtxDrawRect(this.sdctx, ss, this.start);
 	  	}else {
 	  	  CtxClrRect(this.sdctx, this.start, this.end);
		  CtxDrawRect(this.sdctx, ss, ee);
 	  	}
        break;
	  case -1:
        if(ss == this.start) CtxClrRect(this.sdctx, ee, this.end);
		else CtxDrawRect(this.sdctx, ss, this.start);
		break;
	  case 0:
        if(ss == this.start) break;
		else if(ss < this.start) {
			CtxDrawRect(this.sdctx, ss, this.start);
			CtxDrawRect(this.sdctx, this.end, ee);
		}else {
			CtxClrRect(this.sdctx, this.start, ss);
			CtxClrRect(this.sdctx, ee, this.end);
		}
		break;
	  case 1:
	  	if(ss == this.start) CtxDrawRect(this.sdctx, this.end, ee);
		else CtxClrRect(this.sdctx, this.start, ss);
		break;
	  case 2:
	  	if(ss > this.end) {
		  CtxClrRect(this.sdctx, this.start, this.end);
		  CtxDrawRect(this.sdctx, ss, ee);
	  	}else {
		  CtxClrRect(this.sdctx, this.start, ss);
		  CtxDrawRect(this.sdctx, this.end, ee);
	  	}
		break;
	}
	this.start = ss;
	this.end = ee;
  },

  _paintImg: function(imgdata) {
	if(this.e_sdcvs.offsetWidth != this.cvswidth) {
	  this.cvswidth = this.e_sdcvs.offsetWidth;
	  this.e_sdcvs.setAttribute("width",this.cvswidth);
	}
    if(!imgdata) return;
    this._clear();
    this.sdctx.putImageData(imgdata, 0, 0);
  },

  _clear: function() {
    CtxClrRect(this.sdctx, 0, this.cvswidth-1);
	this.start = 0;
	this.end = 0;
  },
}

function GetBit(val,bit){
  /*1 return true; 0 return false*/
  return ((val & (0x1 << bit)) >> bit)==1;
}

function imgXextend(oldimg, w) {
  if(oldimg.width == w) return;
  var canvas = document.createElement('canvas');
  var newimg = canvas.getContext('2d').createImageData(w, oldimg.height);
  canvas = null;

  wr = w / oldimg.width;
  if(wr < 1) {
  	wr = oldimg.width / w;
    var wi = parseInt(oldimg.width / w);
  }
  var k = 0;
  for(var i=0; i<oldimg.height; i++) {
    for(var j=0; j<w; j++) {
	  if(!wi) {   //short to long
	    if(k == parseInt(j/wr)) {
	      newimg.data[i*w*4+j*4] = oldimg.data[i*oldimg.width*4+parseInt(j/wr)*4];
		  newimg.data[i*w*4+j*4 + 1] = oldimg.data[i*oldimg.width*4+parseInt(j/wr)*4 + 1];
		  newimg.data[i*w*4+j*4 + 2] = oldimg.data[i*oldimg.width*4+parseInt(j/wr)*4 + 2];
		  newimg.data[i*w*4+j*4 + 3] = oldimg.data[i*oldimg.width*4+parseInt(j/wr)*4 + 3];
	    }else {
          lp = j/wr - parseInt(j/wr);
		  ln = 1- lp;
          newimg.data[i*w*4+j*4] = parseInt(oldimg.data[i*oldimg.width*4+(parseInt(j/wr)-1)*4]*lp + oldimg.data[i*oldimg.width*4+parseInt(j/wr)*4]*ln);
          newimg.data[i*w*4+j*4 + 1] = parseInt(oldimg.data[i*oldimg.width*4+(parseInt(j/wr)-1)*4 + 1]*lp + oldimg.data[i*oldimg.width*4+parseInt(j/wr)*4 + 1]*ln);
          newimg.data[i*w*4+j*4 + 2] = parseInt(oldimg.data[i*oldimg.width*4+(parseInt(j/wr)-1)*4 + 2]*lp + oldimg.data[i*oldimg.width*4+parseInt(j/wr)*4 + 2]*ln);
          newimg.data[i*w*4+j*4 + 3] = parseInt(oldimg.data[i*oldimg.width*4+(parseInt(j/wr)-1)*4 + 3]*lp + oldimg.data[i*oldimg.width*4+parseInt(j/wr)*4 + 3]*ln);
          k = parseInt(j/wr);
        }
	  }else {  //long to short
        if(k) {
		  newimg.data[i*w*4+j*4] = oldimg.data[i*oldimg.width*4+parseInt(j*wr)*4] * (1-k);
		  newimg.data[i*w*4+j*4+1] = oldimg.data[i*oldimg.width*4+parseInt(j*wr)*4+1] * (1-k);
		  newimg.data[i*w*4+j*4+2] = oldimg.data[i*oldimg.width*4+parseInt(j*wr)*4+2] * (1-k);
		  newimg.data[i*w*4+j*4+3] = oldimg.data[i*oldimg.width*4+parseInt(j*wr)*4+3] * (1-k);
		  var x = ((wr-parseInt(wr)+k)>1) ? 1 : 0;
		  for(var l=1; l<wi+x; l++) {
			newimg.data[i*w*4+j*4] += oldimg.data[i*oldimg.width*4+(parseInt(j*wr)+l)*4];
			newimg.data[i*w*4+j*4+1] += oldimg.data[i*oldimg.width*4+(parseInt(j*wr)+l)*4+1];
			newimg.data[i*w*4+j*4+2] += oldimg.data[i*oldimg.width*4+(parseInt(j*wr)+l)*4+2];
			newimg.data[i*w*4+j*4+3] += oldimg.data[i*oldimg.width*4+(parseInt(j*wr)+l)*4+3];
		  }
		}else {
		  newimg.data[i*w*4+j*4] = 0;
		  newimg.data[i*w*4+j*4+1] = 0;
		  newimg.data[i*w*4+j*4+2] = 0;
		  newimg.data[i*w*4+j*4+3] = 0;
		  for(var l=0; l<wi; l++) {
			newimg.data[i*w*4+j*4] += oldimg.data[i*oldimg.width*4+(parseInt(j*wr)+l)*4];
			newimg.data[i*w*4+j*4+1] += oldimg.data[i*oldimg.width*4+(parseInt(j*wr)+l)*4+1];
			newimg.data[i*w*4+j*4+2] += oldimg.data[i*oldimg.width*4+(parseInt(j*wr)+l)*4+2];
			newimg.data[i*w*4+j*4+3] += oldimg.data[i*oldimg.width*4+(parseInt(j*wr)+l)*4+3];
		  }
		}
		k = (j+1)*wr - parseInt((j+1)*wr);
		if(k) {
		  newimg.data[i*w*4+j*4] += oldimg.data[i*oldimg.width*4+(parseInt(j*wr)+l)*4] * k;
		  newimg.data[i*w*4+j*4+1] += oldimg.data[i*oldimg.width*4+(parseInt(j*wr)+l)*4+1] * k;
		  newimg.data[i*w*4+j*4+2] += oldimg.data[i*oldimg.width*4+(parseInt(j*wr)+l)*4+2] * k;
		  newimg.data[i*w*4+j*4+3] += oldimg.data[i*oldimg.width*4+(parseInt(j*wr)+l)*4+3] * k;
		}
		newimg.data[i*w*4+j*4] = parseInt(newimg.data[i*w*4+j*4] / wr);
		newimg.data[i*w*4+j*4] = (newimg.data[i*w*4+j*4]>125) ? 255 : 0;
		newimg.data[i*w*4+j*4+1] = parseInt(newimg.data[i*w*4+j*4+1] / wr);
		newimg.data[i*w*4+j*4+1] = (newimg.data[i*w*4+j*4+1]>125) ? 255 : 0;
		newimg.data[i*w*4+j*4+2] = parseInt(newimg.data[i*w*4+j*4+2] / wr);
		newimg.data[i*w*4+j*4+2] = (newimg.data[i*w*4+j*4+2]>125) ? 255 : 0;
		newimg.data[i*w*4+j*4+3] = parseInt(newimg.data[i*w*4+j*4+3] / wr);
		newimg.data[i*w*4+j*4+3] = (newimg.data[i*w*4+j*4+3]>125) ? 255 : 0;
	  }
    }
  }

  return newimg;
}

function RtWaveDsp(sdid) {
  this.e_wvcvs = document.createElement("canvas");

  this.e_refcvs = document.getElementById(sdid);
  this.cvsheight = this.e_refcvs.offsetHeight;
  this.cvswidth = this.e_refcvs.offsetWidth * 2;
  this.cxtprogress = 0;
  this.cxtheader = 0;
  this.cxtstep = 0;

  this.rdStart = 0;
  this.rdEnd = 0;

  this.e_wvcvs.setAttribute("height",this.cvsheight);
  this.e_wvcvs.setAttribute("width",this.cvswidth);
  this.cxtstep = parseInt(this.cvswidth / 960) + 1;
  this.wvctx = this.e_wvcvs.getContext("2d");
  this.wvctx.globalCompositeOperation="lighter";
  this.wvctx.strokeStyle = "#00FF00";
  this.wvctx.lineWidth = this.cxtstep;

}

RtWaveDsp.prototype = {
  _drawwave: function(bmhex, tm){
	if(this.e_refcvs.offsetWidth * 2 != this.cvswidth) {
	  var oldimg = this.wvctx.getImageData(0, 0, this.cvswidth, 60);
	  this.cvswidth = this.e_refcvs.offsetWidth * 2;
	  this.cxtstep = parseInt(this.cvswidth / 960) + 1;
	  this.e_wvcvs.setAttribute("width",this.cvswidth);
	  this.e_wvcvs.setAttribute("height",this.cvsheight);
	  this.wvctx = this.e_wvcvs.getContext("2d");
	  this.wvctx.globalCompositeOperation="lighter";
	  this.wvctx.strokeStyle = "#00FF00";
	  this.wvctx.lineWidth = this.cxtstep;
          this.cxtheader = this.cvswidth * this.cxtprogress / 960;
          this.wvctx.putImageData(imgXextend(oldimg, this.cvswidth), 0, 0);
	  oldimg = null;
	}

	var val;
    var  l = bmhex.length/8;

	this.wvctx.beginPath();
    CtxClrRect(this.wvctx, this.cxtheader, this.cxtheader+this.cvswidth *(l+1)/960);

	var pre, now;
	for(var i=0; i<l; i++) {
	  for(var j=0; j<60; j++) {
		if((j&0x7) == 0) val = bmhex.shift();
		if(j == 0) {
		  pre = GetBit(val, 7);
		  if(pre) this.wvctx.moveTo(this.cxtheader,0);
		  continue;
		}else now = GetBit(val, 7-(j&0x7));
		if(pre != now) {
		  if(now) this.wvctx.moveTo(this.cxtheader,j);
		  else this.wvctx.lineTo(this.cxtheader,j);
		  pre = now;
		}else if((j==59) && now) this.wvctx.lineTo(this.cxtheader,j);
	  }
	  this.cxtprogress ++;
	  if(this.cxtprogress >= 960)  this.cxtprogress = 0;
	  this.cxtheader = this.cvswidth * this.cxtprogress / 960;
	}
	this.wvctx.closePath();
	this.wvctx.stroke();

  },

  _getimgdata: function(tc, obj) {
	if(obj.cxtprogress == obj.rdEnd) return null;

	var dif;
	if(obj.cxtprogress > obj.rdEnd) dif = obj.cxtprogress - obj.rdEnd;
	else dif = 960 - obj.rdEnd + obj.cxtprogress;

	if(dif<4) {
	  if((tc%2) == 1) return null;
	  return RtWaveDsp.getImgData(1, obj);
	}else if(dif<7) RtWaveDsp.getImgData(1, obj);
	else return RtWaveDsp.getImgData(parseInt(dif/3), obj);
  },

  _clear: function() {
    CtxClrRect(this.wvctx, 0, this.cvswidth-1);
	this.cxtprogress = 0;
	this.cxtheader = 0;
	this.rdStart = 0;
	this.rdEnd = 0;
  },
}

RtWaveDsp.getImgData = function(ofst, obj) {

  if(ofst>1) console.log("RealTime Wave Display Go Ahead:", ofst);

  var dif;

  if(obj.cxtprogress > obj.rdStart) dif = obj.cxtprogress - obj.rdStart;
  else dif = 960 - obj.rdStart + obj.cxtprogress;

  if(dif < 480) obj.rdEnd = obj.cxtprogress;
  else {
  	obj.rdStart += ofst;
  	obj.rdEnd = obj.rdStart + 480;
	if(obj.rdEnd > 960) obj.rdEnd -= 960;
  }
  if(obj.rdStart > 960) obj.rdStart -= 960;

  if(obj.rdStart > obj.rdEnd) {
	if(960 != obj.rdStart) 
	  imgdd1 = obj.wvctx.getImageData(obj.cvswidth * obj.rdStart / 960, 0, obj.cvswidth * (960-obj.rdStart)/960, 60);
	if(!!obj.rdEnd) imgdd2 = obj.wvctx.getImageData(0, 0, obj.cvswidth * obj.rdEnd / 960, 60);

    if((!!imgdd1) && (!!imgdd2)) {
//	  imgdata = new ImageData(imgdd1.width + imgdd2.width, 60);
	  var canvas = document.createElement('canvas');
	  var imgdata = canvas.getContext('2d').createImageData(imgdd1.width + imgdd2.width, 60);
	  canvas = null;

	  for(var i=0; i<60; i++) {
	    for(var j=0; j<imgdata.width*4; j++) {
		  if(j<imgdd1.width*4) imgdata.data[i*imgdata.width*4+j] = imgdd1.data[i*imgdd1.width*4+j];
		  else imgdata.data[i*imgdata.width*4+j] = imgdd2.data[i*imgdd2.width*4+j-imgdd1.width*4];
	    }
	  }
    }else if(!!imgdd1) var imgdata = imgdd1;
	else if(!!imgdd2) var imgdata = imgdd2;
  }else imgdata = obj.wvctx.getImageData(obj.cvswidth * obj.rdStart / 960, 0, obj.cvswidth * (obj.rdEnd-obj.rdStart)/960, 60);

  return imgdata;
}

function BtnSwitch() {
	this.BtnArray = new Array([], [], [], [], [], []);
}

BtnSwitch.prototype = {
	/***  Allocate a New Button Object ***/
  _newBtn: function(btnindex, btnid, initsts, cb) {
    if(this.BtnArray[0].some(function(value) {
	  return value == btnindex;
	})) return;
	inx = this.BtnArray[0].length; 
	this.BtnArray[0].push(btnindex);                       //0:index
	this.BtnArray[1].push(btnid);                          //1:DOM Id of Button
	this.BtnArray[2].push(initsts);                        //2:Current Status
	this.BtnArray[3].push(cb);                             //3:Function for Status Changing
	this.BtnArray[4][inx] = new Array();
	this.BtnArray[4][inx].push({sts: 0, icon: ''});        //4:Icon for every status
  },

  /***	Enable Button Object ***/
  _initBtn: function() {
    var dombtn;
    for(var i=0; i<this.BtnArray[0].length; i++) {
	  dombtn = document.getElementById(this.BtnArray[1][i]);
      Event.addEvents(dombtn, "click", this._BtnListener);
	  dombtn.btobj = {index: i, dom: this};
	  this.BtnArray[5].push(dombtn);
    }
  },

	/***  Add Button Status and Display Icon ***/
  _addIcon: function(btnindex, stsv, icon) {
 	var inx = this.BtnArray[0].indexOf(btnindex);
	if(inx == -1) return;
    this.BtnArray[4][inx].push({sts: stsv, icon: icon});
  },

  _BtnListener: function(eve) {
    switch(eve.target.btobj.dom.BtnArray[2][eve.target.btobj.index]) {
      case 0:
	  case 1:
	  	break;
	  default:
	  	eve.target.btobj.dom.BtnArray[3][eve.target.btobj.index](eve);
		break;
    }
  },

  /***  Change Button Status and Display Icon ***/
  _ChageSts: function(btnindex, stsv) {
 	var inx = this.BtnArray[0].indexOf(btnindex);
	if(inx == -1) return;
	var iny;
	for(iny=0; iny<this.BtnArray[4][inx].length; iny++) {
		if(this.BtnArray[4][inx][iny].sts == stsv) break;
	}
	if(iny == this.BtnArray[4][inx].length) return;
	var inz;
	for(inz=0; inz<this.BtnArray[4][inx].length; inz++) {
	  if(this.BtnArray[4][inx][inz].sts == this.BtnArray[2][inx]) break;
	}
	if(stsv == 0)
		this.BtnArray[5][inx].style.display = 'none';
	else if(this.BtnArray[4][inx][iny].icon != this.BtnArray[4][inx][inz].icon)
	  this.BtnArray[5][inx].style.background="url("+this.BtnArray[4][inx][iny].icon+")";
	if(this.BtnArray[2][inx] == 0) this.BtnArray[5][inx].style.display = 'block';
    this.BtnArray[2][inx] = stsv;
  },

  /***  Get Button Status ***/
  _GetSts: function(btnindex, stsv) {
 	var inx = this.BtnArray[0].indexOf(btnindex);
	if(inx == -1) return -1;
	return this.BtnArray[2][inx];
  },

};

function FileFetch(fileurl, cb, ed) {
  if(arguments.length != 3) {
  	console.log("File Operation need URL!")
  	return;
  }else console.log("File Fetching:", fileurl);

  this.FileName = fileurl;
  this.FileLength = 0;
  this.FileTailTimer = 0;
  this.FileTailWait = 20;
  this.FileGetFirst = true;
  this.FileLengthOver = false;

  this.FetchStart = 0;
  this.FetchBytes = 0;
  this.FetchTail = false;
  this.FetchOver = false;
  this.FetchPush = cb;
  this.FetchEnd = ed;

  FileFetch.GetData(this, 0);

}

FileFetch.prototype = {
  _GetGoOn: function(obj) {
    if(obj.FetchOver) return;
    console.log("FileFetch exit Break and Going On");

	obj.FetchStart += 8192;
	FileFetch.GetData(obj, obj.FetchStart);
  },

};

FileFetch.GetData = function(obj, start) {
  var xhr2fetch;
  var end;
  if(obj.FetchTail) end = obj.FileLength - 1;
  else end = start + 8191;

  xhr2fetch = new XMLHttpRequest;
  xhr2fetch.open('get', obj.FileName);
  xhr2fetch.responseType = 'arraybuffer';
  xhr2fetch.setRequestHeader('Range', 'bytes=' + start + '-' + end);
  xhr2fetch.setRequestHeader('Content-Type', 'video/mp4');
  xhr2fetch.obj = obj;
  xhr2fetch.onload = FileFetch.cbk4get;
  xhr2fetch.send();
  xhr2fetch = null;
}

FileFetch.cbk4get = function() {
//console.log("File GetCbk ", this.response.byteLength,"HttpStatus:",this.status);
  if(this.status == 206) {
    if(this.obj.FetchTail) {
	  this.obj.FetchOver = true;
	  this.obj.FetchStart += this.response.byteLength;
	  this.obj.FetchBytes += this.response.byteLength;
	  if(!this.obj.FetchPush(this.response, this.obj._GetGoOn))  return;
	  this.obj.FetchEnd();
      console.log("FileFetch Completed with total", this.obj.FetchBytes+" bytes");
	  return;
    }

	if(this.obj.FileGetFirst) {
		this.obj.FileGetFirst = false;
		if(this.response.byteLength == 1212) this.obj.FileTailWait = 20;
	}else this.obj.FileTailWait = 5;

//	if(this.response.byteLength == 8192) {
	  if(!this.obj.FetchPush(this.response, this.obj._GetGoOn)) {
	  	return;
	  }
	  this.obj.FetchStart += this.response.byteLength; //8192;
	  this.obj.FetchBytes += this.response.byteLength; //8192;
	  if(this.response.byteLength == 8192) FileFetch.GetData(this.obj, this.obj.FetchStart);
	  else setTimeout(FileFetch.GetLen(this.obj), 300);
//	}else setTimeout(FileFetch.GetLen(this.obj), 300);
  }else if(this.status == 404) {
  	if(!this.obj.FileGetFirst) {
		var pathoft = this.obj.FileName.lastIndexOf("/");
		this.obj.FileName = this.obj.FileName.substring(0, pathoft) + "/"+ this.obj.tmpmp4 + ".mp4";
//		console.log("FileFetch switch tmp file from getting");
	}
	setTimeout(FileFetch.GetData(this.obj, this.obj.FetchStart), 500);

  }else FileFetch.GetLen(this.obj);
}

FileFetch.GetLen = function(obj) {
  var xhr2length;

  xhr2length = new XMLHttpRequest;
  xhr2length.open('head', obj.FileName);
  xhr2length.obj = obj;
  xhr2length.onload = FileFetch.cbk4len;
  xhr2length.onreadystatechange = FileFetch.cbk4abt;
  xhr2length.send();
  xhr2length = null;
}

FileFetch.GetLen4Tmr = function(obj) {
  return function() {
    FileFetch.GetLen(obj);
  }
}

FileFetch.cbk4abt = function() {
  if((this.status == 404) && (this.readyState == 4)) {
  	var pathoft = this.obj.FileName.lastIndexOf("/");
  	this.obj.FileName = this.obj.FileName.substring(0, pathoft) + "/"+this.obj.tmpmp4+".mp4";
//    console.log("FileFetch switch tmp file from lengthing.abt");
  }
}

FileFetch.cbk4len = function() {
  var flength = this.getResponseHeader('content-length');
//console.log("FileFetch length of HttpSts:",this.status);

  if(this.status == 404) {
  	var pathoft = this.obj.FileName.lastIndexOf("/");
  	this.obj.FileName = this.obj.FileName.substring(0, pathoft) + "/"+this.obj.tmpmp4+".mp4";
//    console.log("FileFetch switch tmp file from lengthing.cbk");
	FileFetch.GetData(this.obj, this.obj.FetchStart);
	return;
  }

  if(flength != this.obj.FileLength) {
    this.obj.FileLength = flength;
    this.obj.FileTailTimer = 0;
  }

  if((flength-this.obj.FetchStart) > 8191) {
	this.obj.FileTailTimer = 0;
    FileFetch.GetData(this.obj, this.obj.FetchStart);
	return;
  }

  this.obj.FileTailTimer ++;

  if(this.obj.FileTailTimer > this.obj.FileTailWait) {
  	if((flength-this.obj.FetchStart) > 0) {
      this.obj.FetchTail = true;
      FileFetch.GetData(this.obj, this.obj.FetchStart);
	  return;
  	}else {
	  this.obj.FetchOver = true;
	  this.obj.FetchEnd();
      console.log("FileFetch Completed with total", flength+" bytes");
  	}
  }else  setTimeout(FileFetch.GetLen4Tmr(this.obj), this.obj.FileTailTimer*50);
}

function AvMSE(avid) {
  if (!('MediaSource' in window && MediaSource.isTypeSupported('video/mp4; codecs="avc1.42E01E, mp4a.40.2"'))) {
    console.error('Unsupported MIME type or codec: ', mimeCodec);
    return;
  }

  this.tskOpenList = new TskList();
  this.tskOpenList._pushTsk(AvMSE._firstOpen, this, false);
  this.tskUpdList = new TskList();
  this.tskEndList = new TskList();
  this.tskPlayList = new TskList();
  this.e_media = document.getElementById(avid);
  this.mediaSource = new MediaSource;
  this.e_media.src = URL.createObjectURL(this.mediaSource);
  this.mediaSource.obj = this;
  this.e_media.obj = this;
  Event.addEvents(this.mediaSource, 'sourceopen', AvMSE._Open);
  Event.addEvents(this.mediaSource, 'sourceended', AvMSE._End);
  Event.addEvents(this.e_media, 'canplay', AvMSE._CanPlay);

  this.sourceBuffer = null;
  this.sbStart = 0;
  this.sbEnd = 0;
  this.duration = 0;

  var fmp4Headerstr = 'AAAAGGZ0eXBpc281AAACAGlzbzZtcDQxAAAEpG1vb3YAAABsbXZoZAAAAAAAAAAAAAAAAAAAA+gAAAAAAAEAAAEAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAHbdHJhawAAAFx0a2hkAAAAAwAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAQAAAAABkAAAAZAAAAAABd21kaWEAAAAgbWRoZAAAAAAAAAAAAAAAAAAAQAAAAAAAVcQAAAAAAC1oZGxyAAAAAAAAAAB2aWRlAAAAAAAAAAAAAAAAVmlkZW9IYW5kbGVyAAAAASJtaW5mAAAAFHZtaGQAAAABAAAAAAAAAAAAAAAkZGluZgAAABxkcmVmAAAAAAAAAAEAAAAMdXJsIAAAAAEAAADic3RibAAAAJZzdHNkAAAAAAAAAAEAAACGYXZjMQAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAABkAGQASAAAAEgAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABj//wAAADBhdmNDAWQIDf/hABhnZAgNrNlHP554QAAAAwBAAAAQA8UKZYABAAVo6+yyLAAAABBzdHRzAAAAAAAAAAAAAAAQc3RzYwAAAAAAAAAAAAAAFHN0c3oAAAAAAAAAAAAAAAAAAAAQc3RjbwAAAAAAAAAAAAABq3RyYWsAAABcdGtoZAAAAAMAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAQEAAAAAAQAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAUdtZGlhAAAAIG1kaGQAAAAAAAAAAAAAAAAAAD6AAAAAAFXEAAAAAAAtaGRscgAAAAAAAAAAc291bgAAAAAAAAAAAAAAAFNvdW5kSGFuZGxlcgAAAADybWluZgAAABBzbWhkAAAAAAAAAAAAAAAkZGluZgAAABxkcmVmAAAAAAAAAAEAAAAMdXJsIAAAAAEAAAC2c3RibAAAAGpzdHNkAAAAAAAAAAEAAABabXA0YQAAAAAAAAABAAAAAAAAAAAAAgAQAAAAAD6AAAAAAAA2ZXNkcwAAAAADgICAJQACAASAgIAXQBUAAAAAAPoAAAAAAAWAgIAFFBBW5QAGgICAAQIAAAAQc3R0cwAAAAAAAAAAAAAAEHN0c2MAAAAAAAAAAAAAABRzdHN6AAAAAAAAAAAAAAAAAAAAEHN0Y28AAAAAAAAAAAAAAEhtdmV4AAAAIHRyZXgAAAAAAAAAAQAAAAEAAAAAAAAAAAAAAAAAAAAgdHJleAAAAAAAAAACAAAAAQAAAAAAAAAAAAAAAAAAAGJ1ZHRhAAAAWm1ldGEAAAAAAAAAIWhkbHIAAAAAAAAAAG1kaXJhcHBsAAAAAAAAAAAAAAAALWlsc3QAAAAlqXRvbwAAAB1kYXRhAAAAAQAAAABMYXZmNTguMjkuMTAw';
  this.fmp4Headerbin = Base64ToUint8Array(fmp4Headerstr);
  fmp4Headerstr = null;
}

AvMSE._CanPlay = function() {
  console.log('mediaDom Canplay');
  while(this.obj.tskPlayList._popTsk(this.obj.tskPlayList)) var i=0;
}

AvMSE._End = function() {
  console.log('mediaSourece EndOfStream');
  while(this.obj.tskEndList._popTsk(this.obj.tskEndList)) var i=0;
}

AvMSE._Open = function() {
  while(this.obj.tskOpenList._popTsk(this.obj.tskOpenList)) var i=0;
}

AvMSE._firstOpen = function(obj) {
  console.log('mediaSourece Opened');
  URL.revokeObjectURL(obj.e_media.src);
  localStorage.clear();

  obj.sourceBuffer = obj.mediaSource.addSourceBuffer('video/mp4; codecs="avc1.42E01E, mp4a.40.2"');
  obj.sourceBuffer.obj = obj;
  obj.sourceBuffer.mode = 'segments';
  Event.addEvents(obj.sourceBuffer, 'updateend', AvMSE._Update);
}

AvMSE._Update = function() {
  if(this.obj.sourceBuffer.buffered.length>0) {
  	this.obj.sbStart = this.obj.sourceBuffer.buffered.start(0);
    if(!!(this.obj.sourceBuffer.buffered.end(this.obj.sourceBuffer.buffered.length-1)))
	  this.obj.sbEnd  = this.obj.sourceBuffer.buffered.end(this.obj.sourceBuffer.buffered.length-1);
    this.obj.duration = this.obj.sbEnd - this.obj.sbStart;
  }
  if(this.obj.tmOfst != this.obj.sourceBuffer.timestampOffset) {
    console.log('sourceBuffer Updated','mode:'+this.obj.sourceBuffer.mode, 'bufStart/End:('+this.obj.sourceBuffer.buffered.length+')'+this.obj.sbStart+'-'+ this.obj.sbEnd, 'timeOffset:'+this.obj.sourceBuffer.timestampOffset);
    this.obj.tmOfst = this.obj.sourceBuffer.timestampOffset;
    if(this.obj.tmOfst > this.obj.e_media.currentTime) {
      this.obj.e_media.currentTime = this.obj.tmOfst;
    }
  }//else console.log('sourceBuffer Updated','mode:'+this.obj.sourceBuffer.mode);

  while(this.obj.tskUpdList._popTsk(this.obj.tskUpdList)) var i=0;
}

AvMSE._SetTmOft = function(obj) {
  obj.sourceBuffer.timestampOffset = 0;
}

AvMSE._SetMode2Smt = function(obj) {
  obj.sourceBuffer.mode = 'segments';
}

AvMSE._SetMode2Sqs = function(obj) {
  obj.sourceBuffer.mode = 'sequence';
}

AvMSE._SetHeader = function(obj) {
  obj.sourceBuffer.appendBuffer(obj.fmp4Headerbin);
}

AvMSE.prototype = {
  _appendData: function(mediachunk) {
//  console.log("Appending Media chunk");
	if(this.sourceBuffer.updating) return false;

	this.sourceBuffer.appendBuffer(mediachunk);
	return true;
  },

  _infoFetchEnd: function() {
	if(this.sourceBuffer.updating)  return false;

    this.mediaSource.endOfStream();
	return true;
  },

  _chgMode2Rt: function() {
    if(this.sourceBuffer.mode == 'sequence') return true;
	if(this.sourceBuffer.updating)  return false;

    var buftimend=0;
    if(this.sourceBuffer.buffered.length>0) {
      for(i=0; i<this.sourceBuffer.buffered.length; i++) 
	  	if(this.sourceBuffer.buffered.end(i) > buftimend) buftimend = this.sourceBuffer.buffered.end(i);
    }
	if(buftimend !=0 ) {
	  this.sourceBuffer.remove(0, buftimend);
	  if(this.sourceBuffer.timestampOffset != 0)  this.tskUpdList._pushTsk(AvMSE._SetTmOft, this, true);
	  this.tskUpdList._pushTsk(AvMSE._SetMode2Sqs, this, true);
	  this.tskUpdList._pushTsk(AvMSE._SetHeader, this, false);
	}else  {
	  this.sourceBuffer.mode = 'sequence';
	  this.sourceBuffer.appendBuffer(this.fmp4Headerbin);
	}

	return true;
  },

  _chgMode2Fl: function() {
	if(this.sourceBuffer.mode == 'segments') return true;
	if(this.sourceBuffer.updating)	return false;

    this.e_media.currentTime = 0;
	var buftimend=0;
	if(this.sourceBuffer.buffered.length>0) {
	  for(i=0; i<this.sourceBuffer.buffered.length; i++) 
	    if(this.sourceBuffer.buffered.end(i) > buftimend) buftimend = this.sourceBuffer.buffered.end(i);
	}

	if(buftimend !=0 ) {
	  this.sourceBuffer.remove(0, buftimend);
	  if(this.sourceBuffer.timestampOffset != 0)  this.tskUpdList._pushTsk(AvMSE._SetTmOft, this, true);
	  this.tskUpdList._pushTsk(AvMSE._SetMode2Smt, this, false);
	}else  this.sourceBuffer.mode = 'segments';

	return true;
  },

  
  _chgFiles: function() {
	if(this.sourceBuffer.updating)	return false;
    try{
      this.e_media.currentTime = 0;
    }catch(err) {
      console.log("ChangeFile with currentTime=0");
    }
	var buftimend=0;
	if(this.sourceBuffer.buffered.length>0) {
	  for(var i=0; i<this.sourceBuffer.buffered.length; i++) 
	    if(this.sourceBuffer.buffered.end(i) > buftimend) buftimend = this.sourceBuffer.buffered.end(i);
	}
	if(buftimend !=0 ) {
	  this.sourceBuffer.remove(0, buftimend);
	  if(this.sourceBuffer.timestampOffset != 0)  this.tskUpdList._pushTsk(AvMSE._SetTmOft, this, false);
	  return false;
	}

	return true;
  },

  _ifCanplay: function(tm) {
    if(this.sourceBuffer.buffered.length>0) {
	  for(i=0; i<this.sourceBuffer.buffered.length; i++) {
	    if(tm < this.sourceBuffer.buffered.start(i)) return this.sourceBuffer.buffered.start(i);
		else if(tm > this.sourceBuffer.buffered.end(i)) continue;
        else return 0;
	  }
	  return this.sourceBuffer.buffered.end(i-1);
    }else return -1;
  },

}

var AvPlayerPlugin = (function(){
  var img_btn_download = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3FpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo4MzY0NDU4Yi1mOGEyLTAxNGQtOGZmYS0yMWU3OGU3OWIwZTQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6Q0ZFNTk5QTQ1RjgxMTFFOTg4QjlBMDgyMjhCREZDREEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6Q0ZFNTk5QTM1RjgxMTFFOTg4QjlBMDgyMjhCREZDREEiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjgzNjQ0NThiLWY4YTItMDE0ZC04ZmZhLTIxZTc4ZTc5YjBlNCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo4MzY0NDU4Yi1mOGEyLTAxNGQtOGZmYS0yMWU3OGU3OWIwZTQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6T6jwYAAABIElEQVR42mL8//8/AzUBEwOVAdUNZCEgzwzEzkAsAuW/AeK9QPwXpw5QGOLBiv8h4C8Ug4ACPj2EXMgKpT2h9E4gZqPEy3+g9FssYmQZyI9FHT+xscwNxJFAzAPlJwPxHlAwQ10Fc9keqBwDVG0kVC9GpBhDA90YytcH4h9AfBOIWaD4JlRMH4ceFK8worn+IhDHAPFqKA1yqRoQh0LlGLDpRTYQWx5cA8SdQDwfyu+CimGkPnyR8g+NXwXExlB2JQG1KAa+htIaQHweTZMrjkjVQNPLwIhW2uwAYgMg9gPiu0jif5GyIgwoA/EmIL4AxB64sp40EJ+BxtxPAvg/VK00shmMWMpDUHazB2JxAon+JRAfBOLfKNE98gpYgAADAAxO/Bpf3bvNAAAAAElFTkSuQmCC';
  var img_btn_loop_off = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3FpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpkMzNhNzA2NC1hOTViLTkwNGUtYmM4Ny1hN2I3NWFhNDU1ZmIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NjA1RkI1RTA1RUIzMTFFOUEzRTVDOEEzODhBNDJFNUQiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NjA1RkI1REY1RUIzMTFFOUEzRTVDOEEzODhBNDJFNUQiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOmQzM2E3MDY0LWE5NWItOTA0ZS1iYzg3LWE3Yjc1YWE0NTVmYiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpkMzNhNzA2NC1hOTViLTkwNGUtYmM4Ny1hN2I3NWFhNDU1ZmIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6xfJoZAAAArklEQVR42mL8//8/AzUBEwOVwaiBOEEMEKsTo5AFjS8LxBFoYtxAXA/Ev4D4LBDvAuKdQHweiH9gmAhKNkjY9T/x4B4QlwExN7IZ6C58A8THke2D+sIMyv8DxBeBeA8Q7wPiy0D8HdkARiISNg8QTwbiw0B8EIjvUjOWCdqO7kJDIJ5KopdfAvE/mkUKugsJJZtz0CSDM9kwElnagBL2aSC+SWoYjhYOg8BAgAADAG6Cw0xl9FFSAAAAAElFTkSuQmCC';
  var img_btn_loop_on = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3FpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDozNTgwNGIzNC04ZDY4LTU2NGYtOWU2NS1jNWJiYzYxMGE3MzEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MTEzMDlBMTI1RTlFMTFFOTk5NkNGRjFCRUJEODM2MTAiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MTEzMDlBMTE1RTlFMTFFOTk5NkNGRjFCRUJEODM2MTAiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjM1ODA0YjM0LThkNjgtNTY0Zi05ZTY1LWM1YmJjNjEwYTczMSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDozNTgwNGIzNC04ZDY4LTU2NGYtOWU2NS1jNWJiYzYxMGE3MzEiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5t9y+KAAABB0lEQVR42mL8//8/AzUBEwOVwQg0kAWHuA4QvwXiICBmBOJnaPJ/gfgOEF/F0AmKZSQsAsQb/0NADhB/+Y8fbIDqgZvBiJRsWIF4PxDrAXEmEK8BYjMg/gPET6EuBbsBiJmB2AqIpwPxJSB2AuJf6C4Mgdpqi+ZqfNgWqicEJoYcKS5AfA+ID5MQB4ehelywxfJfqFdIBcxQvRgGbgdieSD2IsEwL6ie7TAB5EgB2bQZiN2AuASIDwDxbzQDpKDqjgBxChD3APEuIPaFuxItkHmBeC4Q/8WTVH4AcT5UzTyoHqzJBhnIALEiNCn9hyYZNiCWhboQlKQ4gfgxukbG0eJr8BkIEGAAw4H6GPsVGNgAAAAASUVORK5CYII=';
  var img_btn_mute_off = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3FpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDozNTFhYjg2YS1iZTJjLTBiNGUtYmVmNy1iODljNzRkM2Q0MWQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NzMwQjdDNUM1RTgzMTFFOThDM0VDMTQ2MTg5QjQyNzMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NzMwQjdDNUI1RTgzMTFFOThDM0VDMTQ2MTg5QjQyNzMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjM1MWFiODZhLWJlMmMtMGI0ZS1iZWY3LWI4OWM3NGQzZDQxZCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDozNTFhYjg2YS1iZTJjLTBiNGUtYmVmNy1iODljNzRkM2Q0MWQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7THC3VAAAA8UlEQVR42uTUzQoBURTA8RmUorAhxQtIWUjZyFso2VnxApYWtnZWJOU5FCs2NsPGE7CxtBwN4z+5aprmQ81g4dSvaebOPbe558yVdV2XgoyQFHD8LGEBHVQ93zT20EMLGq64o+H2vleynv6MKdJYYo0UNmIx14RJZMV1JJL1TeMTKIhjJcabTgkrOOGCo/i8tmXBGXam+wHOiL2emYtSQg4J5LHA3GbbNWQwxhAqanZV1iwTVac64oYuytii+JU+jFjGog5zZIQxgSJ682DXh4EUxU/bLL3a5iON7fvXk988D43DoY69aBPHkP/vgH0IMABt7SIOBK+d0wAAAABJRU5ErkJggg==';
  var img_btn_mute_on = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3FpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDoyZmEzODllNy04YjczLWMyNGUtODJiOC0wYTZjMzVkNzlhYmUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RjhCNzM3Mzk1RTg0MTFFOTgzOTZGNkExMzBBOEUzNkIiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RjhCNzM3Mzg1RTg0MTFFOTgzOTZGNkExMzBBOEUzNkIiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjJmYTM4OWU3LThiNzMtYzI0ZS04MmI4LTBhNmMzNWQ3OWFiZSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoyZmEzODllNy04YjczLWMyNGUtODJiOC0wYTZjMzVkNzlhYmUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4l8qkgAAAB+UlEQVR42uSUPUgjQRiGd/2JiL9XKBLhEIlFGgNy2IQQ4RA8tBJEUbAQkVyIjSBWghxapJNDRItYXxMjQQ7xr9EcHAeKPyFBC+UOTgIaiQkqMfH13dlVFBOTQrBw4GFn5n3325lvvh0ZgPSaLUd65fZmAT+SDmLM6FRymIE2EiIXJEpaX/KnDxSPS3C7HejvB9rbgaGhOWxvH1H7SUqIl3zJFLCAlCEUqoTFsiDkqqpdGI3r7J+L8ezsCj35ZAtqa00X0ESC5ARdXSdCslp/IZFQ9ePjCnR2rnH+Gh5Pk/bOJPmnLeRZwK/ie34/IMvKFjdRW+uD3T75yDPF1QL19ftIJr9xXET+E2uqgAMioMulTofDP3B4+AHl5Qew2b5rnmmMjgI6HRCJKO5PZIEM3sfJe3bssqw+Y7FCyWA4l3w+i2Q2b9A9Ls3MJDQdfCodHbkhuanKxi5WGAioK3Q6Fx+0YLASev1vpuEMJqa6oUHZskvbsnLyLam2bCZhEkdPzwWlBE+0F9FovtA9HhPnYuQKXu99zobJGSlOVzZ6UofT0xo0N88LubQ0gOpqHw8qwv4tc7xMTy5xa2XTl11hKywtTcDhALq7bzEyMsYK2OH8qqhVYI/Ysv9TnpbTJflLkqSXyOn8cpb3YSP5TP6Q1ZeM8vu7YO8EGAA/RasoBvfEQgAAAABJRU5ErkJggg==';
  var img_btn_next = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3FpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo2YzFlMzViNS02N2NmLWQwNDUtOGY2OS0yNzYwNDI3NmRjYjMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NEFENDk1MUU1RTVCMTFFOTlFMzVCMTBGNEQwQ0U3QTQiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NEFENDk1MUQ1RTVCMTFFOTlFMzVCMTBGNEQwQ0U3QTQiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjZjMWUzNWI1LTY3Y2YtZDA0NS04ZjY5LTI3NjA0Mjc2ZGNiMyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo2YzFlMzViNS02N2NmLWQwNDUtOGY2OS0yNzYwNDI3NmRjYjMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4zN/nIAAABGklEQVR42uTUsUpCURzHcY86SASGg0tgg3HfoSeInqClRR0adFEQdIiG2oW2EHEp36DBJ1AENydxEYLEULBBRLDb99BfyIse7w1z6cBnOuf87uXe3znKtm3fLofft+Ox18AjXCDqKVF/wzUUXuzvMcENIhvWrjBNjlDCPeYYo4Cwm0D99DKaaKAlb3cp8yd4wALvyOLQFJiRgBqeRREhx4Y4HmXtG9I4WBd4i1c330hYqEpwH0n49dzyLy+gPNSoiwROUUcFV3/aw4BuED5d7rNQRQ/nSOFJTwRlwQjHqEmwHh2UMPsRFEce1xggI8FTZ7G31SbmqE1uW21Mxb77TbFNR+/Dy9FThvtQXw5naGPo9i+r/3fBfgkwAJG8JTfKTCQsAAAAAElFTkSuQmCC';
  var img_btn_prev = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3FpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo5ZDE1YTUzNi0xNjBjLTFhNDQtODcwMS0wYTBmNTI1MTQ2NmMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NTdCMjY3Mjc1RTVCMTFFOUE3NTM5QjY2RjMyQkFGRTMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NTdCMjY3MjY1RTVCMTFFOUE3NTM5QjY2RjMyQkFGRTMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjlkMTVhNTM2LTE2MGMtMWE0NC04NzAxLTBhMGY1MjUxNDY2YyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo5ZDE1YTUzNi0xNjBjLTFhNDQtODcwMS0wYTBmNTI1MTQ2NmMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5TtELNAAAA6UlEQVR42uTUsQ7BUBTGcW0jEmEymSw2A4kwSaxGrBaTgd2DGDwBIiTiFQzCIohNxGDgGQxV/8axUNErFYOb/JLm9vRrc8/t1SzL8nk5dJ/H4+eBIRQQfVlhr6ELQTRwsm5jJXNPte+CAqjhIEFtNHFBRCXQjyr2EtRBQu5lZG6JGeboI+YUqKOCrTw0RNKhpi4v6YozWo+BJWwkaIy0y/W1TdGzr+9dzmOEHVIoYqHQfQPmV/fhBGXEscIYaYUcU77ybVMGDk0x3DbF7bbJqmybr23sj389TfE8DCOHNY5OBdr/HbBXAQYA/l5d6skWvz4AAAAASUVORK5CYII=';
  var img_btn_pause = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3FpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo5Y2M2YThjMS01YmU4LTA1NDctOWYzYy0yOTE3NmYyYWNjYWMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MTlDQTU0NkY1RTVCMTFFOUFDMTNCRTk1QjcxQ0I0NEMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MTlDQTU0NkU1RTVCMTFFOUFDMTNCRTk1QjcxQ0I0NEMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjljYzZhOGMxLTViZTgtMDU0Ny05ZjNjLTI5MTc2ZjJhY2NhYyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo5Y2M2YThjMS01YmU4LTA1NDctOWYzYy0yOTE3NmYyYWNjYWMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7kSYaxAAAAq0lEQVR42uyVMQ6DMAxFnbByBeZeIQun4EDsHKxST1CGbFyAC1DXIEdNwieq2jVfeou//x9tYmZSrDAJq/AU+sjL2b1ZdyfNHl68NHCqPdCCsla9WEPwLX3kKNVN6OisTj1C2bhwA2ELZgbMtlIgiJUrD6pU+JNqYS2shf8WmotDQIV5UtgA//XlYWhQ4SNb8sICwot6BLPZCxgFL9wFV3gBTne8Zkzw3gIMAOPf0rUhSLI9AAAAAElFTkSuQmCC';
  var img_btn_play = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3FpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpjMzFkMmJiNy0xM2U0LTQ5NDUtYjgzOS1kYmFjZTJjMGNjZTciIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QzQ4RTZBMjg1RTVBMTFFOUE3MkI5RkFDMzg4NkIxODIiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QzQ4RTZBMjc1RTVBMTFFOUE3MkI5RkFDMzg4NkIxODIiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOmMzMWQyYmI3LTEzZTQtNDk0NS1iODM5LWRiYWNlMmMwY2NlNyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpjMzFkMmJiNy0xM2U0LTQ5NDUtYjgzOS1kYmFjZTJjMGNjZTciLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6MyCKnAAABY0lEQVR42mL8//8/AxycPKnJ8Pq1IIOh4XUGaen3DOQAkIH/Hz0S/O/quuw/O/snoPG//0tI3P2fn1/7//ZtcbA8CZjh/69fjP+dnJaDmBiYh+fF/5ychv+3bokTb+DJkxr/mZi+YzUQ2eDs7AagiyUIG7hunQOQ+ofXQBJczPB/wwZ7IPWXKAOJcDF2A11clv53cFhLtIvv3hXFb2BDQx5YwerVTv8tLLYRNFhI6MH/3buNcRtYXl4O98a/f8QZrKh47v+nT+xMBBMqIyMDQ0jIPobjx70Ytm+3YLCy2gRKvhjq7t83ZDh7VouJgcqAhYisxMCwdq0TQ29vCcOJE5441SkqnmcwNr6G3UBOzu9ges0awgaBgJDQQ4ZZs9IYeHl/0inZUJSwqZ71qF44UL34ghWwzs4r/rOwfAF7X1T0wf/c3DpiXISOGVGqgHPn1BjevuVn0NG5zSAp+YGchA0QYADKj9WxWKS4ygAAAABJRU5ErkJggg==';
  var img_btn_preplay = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo3Qjg0QUI3RDVEQUYxMUVBODc2MEMxNkNBQzNCM0Q4QyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo3Qjg0QUI3RTVEQUYxMUVBODc2MEMxNkNBQzNCM0Q4QyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjdCODRBQjdCNURBRjExRUE4NzYwQzE2Q0FDM0IzRDhDIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjdCODRBQjdDNURBRjExRUE4NzYwQzE2Q0FDM0IzRDhDIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+Hi5k6gAAACpQTFRF9PT09vb29/f3+fn58/Pz/Pz8+vr69fX1+/v7/v7++Pj4////8vLy////qLSNpAAAAA50Uk5T/////////////////wBFwNzIAAAAcklEQVR42mzRWQ6AMAgEULqoXeD+11Xs4pTK50taJgPJz5BILq5kgznyMwuTBG4DTFKYLSNObhgSITdMUlMcXCfKxyeg8vsJ1QWPDetYps9dX0S4SDEcg3yL5CC8H+GdJSzEYyHZUi/52krWiOYctwADAKOmEb39sor9AAAAAElFTkSuQmCC';
  var img_frequency = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54\
bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1\
wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3Ln\
czLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xL\
jAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNv\
dXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDowMUUzM0E1NTY3NTcxMUU5OTR\
FMEI4RkY0NTlCNzVFOSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDowMUUzM0E1NjY3NTcxMUU5OTRFMEI4RkY0NTlCNzVFOSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZ\
jppbnN0YW5jZUlEPSJ4bXAuaWlkOjAxRTMzQTUzNjc1NzExRTk5NEUwQjhGRjQ1OUI3NUU5IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjAxRTMzQTU0Njc1NzExRTk5NEU\
wQjhGRjQ1OUI3NUU5Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+I3LXbQAAGXNJREFUeNrsXQmYHVWVv\
req3v5er0mnkw4hIQuJhKACCiYKA7iBThBFEVzHZUAd0dHBTxn1YwQGGFFGHZVxh5lxX0AlqCzKFjACUTQQEsnaSSfd6fXttdz5T9V53dVFve6GVKdbfTffSXfXq6pbdf571nv\
ufVIpJRpt9jStwYIGII3WAKQBSKM1AGkA0mgNQP76m/GDrdeIFZm1ot/sFv3VPUKT+iSXKGHIJCgmLFXFX46IaxmhlCMyRqvoq+wSUgoRk2n3M10aouIUpuHR5RlJLbsHfWyL+\
v6a0PF+CTy/Aj80kdHbhY13H\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';

  var avbtn = new BtnSwitch;
  avbtn._newBtn('Play', 'btn_play', 1, _Play);
  avbtn._addIcon('Play', 1, img_btn_preplay);
  avbtn._addIcon('Play', 2, img_btn_play);
  avbtn._addIcon('Play', 3, img_btn_pause);
  avbtn._newBtn('Prev', 'btn_prev', 1, _Prev);
  avbtn._addIcon('Prev', 1, img_btn_prev);
  avbtn._addIcon('Prev', 2, img_btn_prev);
  avbtn._newBtn('Next', 'btn_next', 1, _Next);
  avbtn._addIcon('Next', 1, img_btn_next);
  avbtn._addIcon('Next', 2, img_btn_next);
  avbtn._newBtn('Loop', 'btn_loop', 1, _Loop);
  avbtn._addIcon('Loop', 1, img_btn_loop_off);
  avbtn._addIcon('Loop', 2, img_btn_loop_off);
  avbtn._addIcon('Loop', 3, img_btn_loop_on);
  avbtn._newBtn('Mute', 'btn_mute', 1, _Muted);
  avbtn._addIcon('Mute', 1, img_btn_mute_off);
  avbtn._addIcon('Mute', 2, img_btn_mute_off);
  avbtn._addIcon('Mute', 3, img_btn_mute_on);
  avbtn._newBtn('Down', 'btn_download', 1, _Export);
  avbtn._addIcon('Down', 1, img_btn_download);
  avbtn._addIcon('Down', 2, img_btn_download);

  var avmse, ffetech=null;
  var shd, rtwav;

  var div_id;
  var mediasrc;
  var wsUri = null;
  var workmode = null;
  var revMsgFunc = null;
  wskobj = {
    ws: null,
    wsState : null,
    cacheurl : null
  }
  this.debugDisplay = null;
  this.debugCMD = null;

 /***** ³õÊŒ»¯ *****/
  var e_rate = null;
  var e_speedratetop = null;
  var e_currentTime = null;
  var e_progressbar = null;
  var e_exporturl = null;
  
  var that;

  var timerc = 0;

  var mimeCodec = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';
  MseObj = {
    totalduration : 0,
	isCanPlayComing: false,
	fileAborted: false,
	bufend: 0,
  };

  function _sysTimer(avobj, mseobj, shad){
    return function(){
      timerc ++;
      if(timerc > 7) timerc = 0;
      if(workmode != "FlowMode") {
        if((mseobj.bufend != avobj.sbEnd) && (mseobj.totalduration != 0)) {
          var ss = avobj.sbEnd*100/mseobj.totalduration;
          if(ss > 100) ss = 100;
          shad._paintShd(ss, 100);
	      mseobj.bufend = avobj.sbEnd;
        }
      }else {
        document.getElementById("Mediaduration").innerHTML = S2time(avmse.sbEnd-avmse.tmOfst);
        if((timerc == 0) && (avobj.duration>130))
          avobj.tskUpdList._pushTsk(_rmSB, null, false);
        shad._paintImg(rtwav._getimgdata(timerc, rtwav));
        if(avobj.e_media.paused) {
	      var curtm;
	      if((avobj.sbEnd-avobj.sbStart) > 120) {
	        curtm = 120 - avobj.sbEnd + avobj.e_media.currentTime;
	        if(curtm < 0) curtm = 0;
	      }else curtm = avobj.e_media.currentTime - avobj.tmOfst;
	      e_progressbar.value = curtm * 100 / 120;
        }
      }
    }
  }

  function _MediaInit(){

    avmse = new AvMSE("mainmedia");
    avmse.e_media.loop = false;
    document.getElementById("volumebar").value = avmse.e_media.volume;
    Event.addEvents(avmse.e_media,"timeupdate",_Progress);

    e_rate = document.getElementById("initrate");
    e_currentTime = document.getElementById("currentTime");
    e_progressbar = document.getElementById("progressbar");
    e_speedratetop = document.getElementById("speedratetop");
    Event.addEvents(document.getElementById("progressdiv"),"mouseup", _RangeChange);
    Event.addEvents(document.getElementById("speedselector"),"click", _SpeedRate);
    Event.addEvents(document.getElementById("volumebar"),"change", _Volume);
    avbtn._initBtn();

    if(wsUri) {
      wskobj.cacheurl = wsUri.slice(5);
      if(wskobj.cacheurl.indexOf(':') >= 0) wskobj.cacheurl = wskobj.cacheurl.slice(0, wskobj.cacheurl.indexOf(':'));
      if(wsUri.indexOf('/',5) == -1) wskobj.cacheurl = "http://" + wskobj.cacheurl + '/';
      else wskobj.cacheurl = "http://" + wskobj.cacheurl;
      _wsConnect(wsUri, wskobj);
    }

	rtwav = new RtWaveDsp("RtCanvas")
    shd = new ShadowDsp("SdCanvas");

    setInterval(_sysTimer(avmse, MseObj, shd), 125);
  }

  function _wsConnect(urlstr, obj){
    obj.ws = new WebSocket(urlstr);
    obj.ws.onerror = _wsError;
    obj.ws.onopen = _wsOpen;
    obj.ws.onclose = _wsClose;
    obj.ws.onmessage = _wsRecv;
  }

  function _wsCnt(url,obj){
    return function(){
      _wsConnect(url,obj);
    }
  }

  function _wsOpen(event){
    wskobj.wsState = 'OK';
    document.getElementById("commentdiv").innerHTML = '<span style="color:white;">Server Connection Ready</span>';
  }

  function _wsError(event){
    document.getElementById("commentdiv").innerHTML = '<span style="color:white">Server Connection error:'+event.data+'</span>';
  }

  function _wsClose(event){
    wskobj.ws = null;
    wskobj.wsState = null;
    document.getElementById("commentdiv").innerHTML = '<span style="color:white">Server Connection Closed</span>';
    setTimeout(_wsCnt(wsUri,wskobj), 1000);
  }

  function _wsSend(wkmode, strCMD){
    var strtosend;
    if(wkmode == 'F') strtosend = 'f,' + strCMD;
    else if(wkmode == 'R') strtosend = 'r,' + strCMD;
	else strtosend = wkmode.toLowerCase()  + ',' + strCMD;

    wskobj.ws.send(strtosend);

    if(that.debugCMD != null) {
    	document.getElementById(that.debugCMD).value = strtosend;
    }
  }

  var wsrcvtype = -1;
  var diroftmp;
  function _wsRecv(evt){
    var str = String(evt.data);

    if(str.indexOf("M:{", 0) >= 0)  wsrcvtype = 0;
    else if(str.indexOf("A:{", 0) >= 0)  wsrcvtype = 1;
    else if(str.indexOf("I:{", 0) >= 0)  wsrcvtype = 2;
	else if(str.indexOf("R:{", 0) >= 0)  wsrcvtype = 98;
	else if(str.indexOf("E:{", 0) >= 0)  wsrcvtype = 99;
    else if(str.indexOf("}", 0) >= 0) {
      if((that.debugDisplay != null) && (wsrcvtype > 0)) document.getElementById(that.debugDisplay).innerHTML += evt.data + '\n';
	  wsrcvtype = -1;
	  return;
    }

    if((that.debugDisplay != null) && (wsrcvtype > 0)) document.getElementById(that.debugDisplay).innerHTML += evt.data + '\n';

    if(wsrcvtype == 1) {
      var m, v, p, s;
      m = str.indexOf("m>", 0);  //mp4,for play
      v = str.indexOf("v>", 0);  //wav,for export
      p = str.indexOf("p>", 0);  //png,for painting
      s = str.indexOf("s>", 0);  //duration para 
      if(s >= 0) {
        MseObj.totalduration = Number(str.slice(s+3, -1));
        document.getElementById("Mediaduration").innerHTML = S2time(MseObj.totalduration);
      }
      if(m >= 0) preNtPlay(wskobj.cacheurl + str.slice(m+2)); 

      if(p >= 0) document.getElementById("progressdiv").style.cssText = 'background:black url(' + wskobj.cacheurl + 
                                                       str.slice(p+2) + ') center no-repeat;background-size:100% 100%';
      if(v >= 0) e_exporturl = wskobj.cacheurl + str.slice(v+2);
    }else if(wsrcvtype == 0) {
	  if(MseObj.fileAborted) return;
      var a, l, r;
      a = str.indexOf("a>", 0);  //vidio
      l = str.indexOf("l>", 0);  //length
      r = str.indexOf("r>", 0);  //

      if(a >= 0) {
        var tm, bmstr, bmhex=[];
        var aa = str.slice(a+2).split(";");
        tm = aa[0].split(":")[1];
		tm = tm.slice(0, -2);
        bmstr = aa[1].split(":")[1];
        for(var i=0; i<bmstr.length; i+=2)  {
			var strr = bmstr.slice(i, i+2);
			bmhex.push(parseInt(strr,16));
        	}
        if(!!bmstr.length) {
		  rtwav._drawwave(bmhex, tm);    //paint wave
		  bmhex = null;
        }
        var mp4datastr = aa[2].split(":")[1];
        var mp4data = Base64ToUint8Array(mp4datastr);   //append mp4data
        if(!!mp4data.length) appMedia(mp4data, null);
//        if(that.debugDisplay != null) {
//          document.getElementById(that.debugDisplay).innerHTML = "a:png("+bmstr.length+"),mp4("+mp4data.length+")";
//        }
      }
    }else if(wsrcvtype == 2) {
		revMsgFunc(str.slice(2));
    }else if(wsrcvtype == 98) {
		var i = str.indexOf("i>:", 0);
		if(i >= 0) {
			diroftmp = str.slice(i + 3);
		}
    }
  }

  function appMedia(chunk, cb) {
    if(avmse._appendData(chunk)) return true;

	avmse.tskUpdList._pushTsk(appMedia, chunk, false);
	if(!!cb)   avmse.tskUpdList._pushTsk(cb, ffetech, false);
    console.log("appendMedia suspended No.", avmse.tskUpdList._getLength(avmse.tskUpdList));

	return false;
  }

  function infoFetchEnd() {
    console.log("Trying to end FileFetchd");
	if(!avmse._infoFetchEnd()) 
	  avmse.tskUpdList._pushTsk(infoFetchEnd, null, false);
	else {
      if(-1 == ffetech.FileName.indexOf(diroftmp+".mp4")) MseObj.totalduration = avmse.sbEnd - avmse.sbStart;
      ffetech = null;
	}
  }

  function curTime2zero() {
    avmse.e_media.currentTime = avmse.sbStart;
    MseObj.isCanPlayComing = true;
  }

  function btn4FileBegin() {
    avbtn._ChageSts('Prev', 2);
    avbtn._ChageSts('Next', 2);
    avbtn._ChageSts('Loop', 2);
    avbtn._ChageSts('Mute', 2);
    avbtn._ChageSts('Down', 2);
    e_progressbar.value = 0;
    avmse.sbStart = 0;
    e_currentTime.innerHTML = S2time(0);
    try{
      avmse.e_media.currentTime = 0;
    }catch(err) {
      avmse.tskPlayList._pushTsk(curTime2zero, null, true);
      console.log("Playing First Media by IE");
    }
  }

  function btn4FileCbk() {
    avbtn._ChageSts('Play', 3);
    avmse.e_media.currentTime = avmse.sbStart;
    avmse.e_media.play();
    e_progressbar.value = 0;
  }

  function preNtPlay(url) {
    if((!!ffetech) && (!ffetech.FetchOver)) {
	  avmse.tskEndList._pushTsk(preNtPlay, url, false);
    }else if(!avmse._chgFiles()) avmse.tskUpdList._pushTsk(preNtPlay, url, false);
    else {
	  MseObj.bufend = 0;
      shd._clear();
      ffetech = new FileFetch(url, appMedia, infoFetchEnd);
	  ffetech.tmpmp4 = diroftmp;
      btn4FileBegin();
      if(MseObj.isCanPlayComing) avmse.tskUpdList._pushTsk(btn4FileCbk, null, false);
      else avmse.tskPlayList._pushTsk(btn4FileCbk, null, false);
    }
  }

  function swtFilPlay() {
    avmse._chgMode2Fl();
  }

  function preRtPlay() {
    avbtn._ChageSts('Prev', 2);
    avbtn._ChageSts('Next', 2);
    avbtn._ChageSts('Loop', 0);
    avbtn._ChageSts('Mute', 2);
    avbtn._ChageSts('Down', 0);
    avmse.e_media.currentTime = 0;
    e_progressbar.value = 0;
  }

  function swtRtlPlay() {
	if((!!ffetech) && (!ffetech.FetchOver)) {
	  MseObj.fileAborted = true;
	  avmse.tskEndList._pushTsk(swtRtlPlay, null, false);
	}else {
	  MseObj.fileAborted = false;
	  avmse._chgMode2Rt();
	  avmse.e_media.loop = false;
	  avmse.tskUpdList._pushTsk(preRtPlay, null, true);
	  avmse.tskPlayList._pushTsk(btn4FileCbk, null, false);
	  rtwav._clear();
	  shd._clear();
	  document.getElementById("progressdiv").style.cssText = 'background:black;';
	}
  }

  function _RangeChange(e1) {
    _StepTo(e1.offsetX * 100 / document.getElementById("progressdiv").clientWidth);
  }

  function _RangeInput(e) {
    var node=document.createElement("style");
    var textstyle=document.createTextNode('');
    node.appendChild(textstyle);
    document.getElementById(div_id).appendChild(node);
    node.sheet.insertRule('#progressbar::-webkit-slider-runnable-track{background-size:' + e.value + '% 100%;}', 0);
  }

  /***** Go Ahead *****/
  function _Next() {
    var newLoc = avmse._ifCanplay(avmse.e_media.currentTime + 10);
    switch(newLoc) {
      case -1:
	  	break;
	  case 0:
	  	avmse.e_media.currentTime += 10;
	    break;
	  default:
	  	avmse.e_media.currentTime = newLoc;
		break;
    }
  }

  /***** Go Back *****/
  function _Prev() {
    var newLoc = avmse._ifCanplay(avmse.e_media.currentTime - 10);
    switch(newLoc) {
      case -1:
	  	break;
	  case 0:
	  	avmse.e_media.currentTime -= 10;
	    break;
	  default:
	  	avmse.e_media.currentTime = newLoc;
		break;
    }
  }

/***** Go to exact location *****/
  function _StepTo(loc) {
    var exactloc;
	if(workmode != "FlowMode") exactloc = avmse.e_media.duration * loc / 100;
	else {
	  if(avmse.sbEnd < 120) exactloc = 120 * loc / 100;
	  else exactloc = avmse.sbEnd - 120 * (100 - loc) / 100;
	}

    var newLoc = avmse._ifCanplay(exactloc);
    switch(newLoc) {
	  case -1:
	    break;
	  case 0:
	    avmse.e_media.currentTime = exactloc;
	    break;
	  default:
	    avmse.e_media.currentTime = newLoc;
	    break;
    }
  }

 	/***** ²¥·Å/ÔÝÍ£ *****/
  function _Play() {
    if(avmse.e_media.paused){
      avmse.e_media.play();
      avmse.e_media.playbackRate = parseFloat(e_speedratetop.innerText);
	  avbtn._ChageSts('Play', 3);
    }else{
      avmse.e_media.pause();
	  avbtn._ChageSts('Play', 2);
    }
  }

  function _rmSB() {
    if(avmse.sourceBuffer.updating) avmse.tskUpdList._pushTsk(_rmSB, null, false);
	else {
	  if(avmse.sourceBuffer.buffered.length>0) {
        avmse.sbStart = avmse.sourceBuffer.buffered.start(0);
        if(!!(avmse.sourceBuffer.buffered.end(avmse.sourceBuffer.buffered.length-1)))
          avmse.sbEnd	= avmse.sourceBuffer.buffered.end(avmse.sourceBuffer.buffered.length-1);
		avmse.duration = avmse.sbEnd - avmse.sbStart;
	  }

      if(avmse.sbStart >= (avmse.sbEnd - 125)) return;
//    console.log("removeSB:", avmse.sbStart, avmse.sbEnd - 125);
	  avmse.sourceBuffer.remove(avmse.sbStart, avmse.sbEnd - 125);
	  if(avmse.e_media.currentTime < (avmse.sbEnd - 118)) avmse.e_media.currentTime = avmse.sbEnd - 118;
	}
  }
  
 /* periodic while playing */
  function _Progress(){
    var curtimtext = avmse.e_media.currentTime-avmse.tmOfst;
	if(curtimtext < 0) curtimtext = 0;
	e_currentTime.innerHTML=S2time(curtimtext);
    if(workmode == "FlowMode") {
	  var curtm;
	  if((avmse.sbEnd-avmse.sbStart) > 120) {
	  	curtm = 120 - avmse.sbEnd + avmse.e_media.currentTime;
		if(curtm < 0) curtm = 0;
	  }else curtm = avmse.e_media.currentTime - avmse.tmOfst;
	  e_progressbar.value = curtm * 100 / 120;
    }else {
      if(MseObj.totalduration == 0) return;
      e_progressbar.value = avmse.e_media.currentTime * 100 / MseObj.totalduration;
      if(e_progressbar.value >= 100){
        e_progressbar.value = 0;
        e_currentTime.innerHTML = S2time(0);
        avmse.e_media.currentTime = 0;
        if(!avmse.e_media.loop){
          avmse.e_media.pause();
	    avbtn._ChageSts('Play', 2);
        }
      }
    }
//    if(window.navigator.userAgent.indexOf("Chrome") >= 0) {
//      if(window.navigator.userAgent.indexOf("Edge") < 0) _RangeInput(e_progressbar);
//    }
  }

/***** Adjust Playing Speed Rate *****/
  function _SpeedRate(e){
  	var target = e.target || e.srcElement;
    if(target.tagName.toLowerCase() == "a"){
      avmse.e_media.playbackRate = parseFloat(target.innerText);
      target.style.color = "blue";
      e_rate.style.color = "white";
      e_rate = target;
      e_speedratetop.innerText = target.innerText;
    }
  }

/***** Ñ­»·Ä£ÊœÉèÖÃ *****/
  function _Loop(e){
    if(avmse.e_media.loop){
        avmse.e_media.loop = false;
		avbtn._ChageSts('Loop', 2);
    }else{
        avmse.e_media.loop = true;
		avbtn._ChageSts('Loop', 3);
    }
  }

/***** Mute *****/
  function _Muted(e){
  	var target = e.target || e.srcElement;
    if(avmse.e_media.muted){
        avmse.e_media.muted = false;
		avbtn._ChageSts('Mute', 2);
    }else{
        avmse.e_media.muted = true;
		avbtn._ChageSts('Mute', 3);
    }
  }

  function _Pause() {
    if(!avmse.e_media.paused){
      avmse.e_media.pause();
	  avbtn._ChageSts('Play', 2);
    }
  }

/***** Export Wave File *****/
  function _Export(e){
  	if(e_exporturl != null) {
      var req = {
        method: 'GET',
        mode:   'cors',
        cache:  'no-cache',
        responseType: 'blob',
      };

      if(window.navigator.userAgent.indexOf("Chrome") < 0) {
      	var aTag = document.createElement('a');
        aTag.download = e_exporturl.slice(e_exporturl.lastIndexOf('/')+1);
        aTag.href = e_exporturl;
        aTag.click();
      }else {
        fetch(e_exporturl, req).then(function(response) {
          if (response.ok) {
        	  response.blob().then(function(blob) {
              var url = URL.createObjectURL(blob);
              var vElem = document.createElement('a');
              vElem.href = url;
              vElem.download = e_exporturl.slice(e_exporturl.lastIndexOf('/')+1);
              vElem.click();
              URL.revokeObjectURL(url);
            });
          }
        });
      }
    }
  }

  /***** Adjust Volume *****/
  function _Volume(e){
  	var target = e.target || e.srcElement;
    if(avmse.e_media.muted == true){
        avmse.e_media.muted = false;
	avbtn._ChageSts('Mute', 2);
    }
    avmse.e_media.volume = target.value;
  }

  return{
 	init: function(id, wbs){
 	  that = this;
 	  div_id = id;
 	  wsUri = wbs;
 	  document.getElementById(id).style.display = 'flex';
 	  var mfcss = '<style type="text/css" id="playercss"> .leftinfo{margin:1px 1px 1px 1px; width:100%; height:100px; background:gray; border-radius:3px; font-size: 16px;} .rangebar{margin:0px 0px 0px 0px; width:100%; padding:0 0 0 0; margin:0 0 0 0; position:relative; border:0px; border-radius:5px;} #progressdiv{height:60%; background:black;} .commentstr{margin:0px 0px 0px 0px; padding:0px 0px 0px 3px; width:100%; height:15%; line-height:15px; font-size:60%;} .frequency{margin:1px 1px 1px 3px; width:100px; height:100px; background:black;} .btnstyle{width:20px; height:20px; line-height:25px; padding:2 2 2 2;	margin:0 0 0 0; border:0; background:transparent;} .clearfix:after{content:"."; display:block; height:0; clear:left; visibility:hidden;} .speedmenu ul { margin:0px; padding:0px; height:100%; width:45px;} .speedmenu ul li {float:left; list-style:none; width:100%; height:100%; color:#E8E8E8} .speedmenu ul li a {color:white; text-decoration:none; line-height:20px;	width:100%; margin:0 0 0 0; padding: 0 0 0 0; display:block; border:0; background:#808080; text-align:center;} .speedmenu ul li ul li {height:65%; background:#808080;} .speedmenu ul li ul li a{line-height:16px; background:#808080; font-size:9px; margin:0 0 0 0; padding:0 0 0 0;} .speedmenu ul li a:hover {background:#666;} .speedmenu ul li ul {visibility:hidden; margin-top:-85px; margin-left:100%;} .speedmenu ul li:hover ul {visibility:visible;} input[type=range]{-webkit-appearance:none; width:100%; position:absolute; top:50%; left:0; transform:translateY(-50%); transform:translate(,-50%); padding:0 0 0 0; background:transparent; overflow:visible; font-size:100%;} input[type=range]:focus{outline:none;} input[type=range]::-webkit-slider-runnable-track{width:100%; height:0.25em; cursor:pointer; border:0px solid gray; border-radius:0.25em/50%;} #progressbar::-webkit-slider-runnable-track{border:1px inset white; background:-webkit-linear-gradient(red, red) no-repeat; background-size:0% 100%;} #volumebar::-webkit-slider-runnable-track{background:white;} input[type=range]::-webkit-slider-thumb{height:1em; width:1em; box-shadow:1px 1px 1px #000000, 0px 0px 1px #0d0d0d; border:1px solid white; border-radius:50%; background:white; cursor:pointer; -webkit-appearance:none; margin-top:-0.375em;} input[type=range]::-moz-range-track{width:100%; height:0.25em; cursor:pointer; border:0px; border-radius:0.25em/50%;} #progressbar::-moz-range-track{background:red;} #volumebar::-moz-range-track{background:white;} input[type=range]::-moz-range-thumb{height:1em; width:1em; box-shadow:1px 1px 1px #000000,0px 0px 1px #0d0d0d; border:1px solid #000000; border-radius:50%; background:white; cursor:pointer; margin-top:-0.375em;} input[type=range]::-ms-track{width:100%; height:0.25em; cursor:pointer; border:0px; border-radius:0.25em/50%; background:transparent; color:transparent;} input[type=range]::-ms-fill-lower{border-radius:0.125em/50%;} #progressbar::-ms-fill-lower{background:red;} #volumebar::-ms-fill-lower{background:white;} input[type=range]::-ms-fill-upper{background:white; border-radius:0.125em/50%;} input[type=range]::-ms-thumb{height:0.5em; width:0.5em; box-shadow:1px 1px 1px #000000,0px 0px 1px #0d0d0d; border:1px solid white; background:white; cursor:pointer; margin-top:0.125em;} </style>';
 	  var mfhtml = '<div class="leftinfo"><div class="rangebar" id="progressdiv"; style="z-index:80;"><canvas id="RtCanvas" style="height:100%; position:absolute; top:0; left:0;"></canvas><canvas id="SdCanvas" style="width:100%; height:100%; position:absolute; top:0; left:0;" height="60px"></canvas><input id="progressbar" name="progressbar" type="range" min="0" max="100" step="0.1" value="0"/></div><div class="clearfix"><div style="float:left; font-size:12px; height:22px; padding:0 0 0 0; margin:3px 0 0 0; display:flex; z-index:100;"><button id="btn_play" class="btnstyle" style="background:url('+img_btn_preplay+'); margin-left:16px;"></button><button id="btn_prev" class="btnstyle" style="background:url('+img_btn_prev+'); margin-left:16px;"></button><button id="btn_next" class="btnstyle" style="background:url('+img_btn_next+'); margin-left:6px;"></button><button id="btn_loop" class="btnstyle" style="background:url(' + img_btn_loop_off + '); margin-left:16px;"></button><span class="speedmenu" style="margin:0 0 0 32px; height:100%; padding:0 0 0 0; z-index:200;"><ul><li><a href="javascript:;" id="speedratetop">1.0X</a><ul style="z-index:300;" id="speedselector"><li><a href="javascript:;">3.0X</a></li><li><a href="javascript:;">2.0X</a></li><li><a href="javascript:;">1.5X</a></li><li><a href="javascript:;" id="initrate" style="color:blue;">1.0X</a></li><li><a href="javascript:;">0.75X</a></li><li><a href="javascript:;">0.5X</a></li></ul></li></ul></span><button id="btn_mute" class="btnstyle" style="background:url('+img_btn_mute_off+'); margin-left:32px;"></button><div class="rangebar"; id="volumediv"; style="margin-left:1px; width:80px; height:16px; font-size:6px;"><input id="volumebar" name="volumebar" type="range" min="0" max="1" step="0.1" value="0"/></div><button id="btn_download" class="btnstyle" style="background-image:url(' + img_btn_download + '); margin-left:40px;"></button></div><div style="float:right; width:130px; font-size:12px; color:white; line-height:16px; text-align:right; margin-right:8px;"><span id="currentTime">00:00</span>&nbsp/&nbsp<span id="Mediaduration">00:00</span></div></div><div id="commentdiv" class="commentstr" style="color:white; text-align:left;"></div></div><div class="frequency"><video id="mainmedia" width="100%" height="100%" object-fit="fill" poster="'+img_frequency+'")>Your explorer has not audio support</video></div>';
      document.getElementById(id).innerHTML = mfcss + mfhtml;
      _MediaInit();
    },

    PlayNetFile: function(url){
      if(workmode == "FlowMode") swtFilPlay();
      workmode = "NetMode";
      if(mediasrc != url) {
        mediasrc = url;
        if(wskobj.wsState == 'OK') {
          document.getElementById("commentdiv").innerHTML = url;
          _wsSend('F',url);
		  MseObj.totalduration = 0;
        }
      }
    },

    PlayFlow: function(vrgch, action){
      	if(workmode != "FlowMode") swtRtlPlay();
      	workmode = "FlowMode";
	  	mediasrc = '';
        if(wskobj.wsState == 'OK') {
          if(action) {
            document.getElementById("commentdiv").innerHTML = "Realtime Channel " + vrgch + " Starting";
            _wsSend('R',"b,"+vrgch);
          }else{
            document.getElementById("commentdiv").innerHTML = "Realtime Channel " + vrgch + " Stopping";
            _wsSend('R',"e,"+vrgch);
          }
        }
    },


	PlayPause: function(){
	  if(workmode == "NetMode") _Pause();
	  else {
	  	swtFilPlay();
      	workmode = "NetMode";
	  }
	},


	SendMsg: function(cmdstr){
	  if(wskobj.wsState == 'OK') _wsSend('I', cmdstr);
	},

	RevMsgCbk: function(func){
	  revMsgFunc = func;
	}

  }
})();

