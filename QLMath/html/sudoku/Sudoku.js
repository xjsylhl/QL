
var intervalId;
var nowTime = 0;
var currentDD;
var level;
var record = 0;
var sdkIndex = 0;
//定义10个，第一个不用
var count = [0,0,0,0,0,0,0,0,0,0];
//记录历史
var hisId = new Array();
var hisValue = new Array();

$(document).ready(function(){
  level = getParam('type');
  if(level == null)
	  level = "1";
  if(level == "1"){
    $("#title").text("简单");
  }
  else if(level == "2"){
    $("#title").text("中级");
  }
  else if(level == "3"){
    $("#title").text("困难");
  }

  $("#btnNext").click(function(){
    if(currentDD != null){
      currentDD.removeClass("current");
      currentDD = null;
    }
    generate();
  });
  
  $("#btnBack").click(function(){
    if(hisId.length == 0)
      return;
	var i = hisId.pop();
	var v = hisValue.pop();
	var dd = $("[i="+i+"]");
	for(var k=hisId.length-1;k>=0;k--){
	  if(hisId[k] == i){
	    dd.text(hisValue[k]);
	    dd.click();
	    statistic(hisValue[k],v);
	    return;
	  }
	}
	dd.text("");
	dd.click();
	statistic(0,v);
  });
  
  $("#btnBlank").click(function(){
	  if(currentDD == null || currentDD.attr("t") == "1")
		  return;
	  var oldi = currentDD.text();
	  currentDD.text("");
      //设置统计值
      statistic(0,oldi);
      //记录历史
      hisId[hisId.length] = currentDD.attr("i");
      hisValue[hisValue.length] = 0;
  });
  
  $("#btnClear").click(function(){
    if(confirm("确定清空？") == false)
      return;
    $("[t=0]").each(function(index,data){ 
	  $(this).text("");
	});
	count = [0,0,0,0,0,0,0,0,0,0];
	$("[t=1]").each(function(index,data){ 
	  count[$(this).text()]++;
	});
	for(var i=1;i<10;i++)
      $("#s"+i).text(count[i]);
	hisId.length = 0;
	hisValue.length = 0;
  });
  
  $("#content dd").click(function(){
    var oldi = 0;
    var newi = $(this).text();
    if(currentDD != null){
      if(currentDD == $(this))
        return;
      oldi = currentDD.text();
      currentDD.removeClass("current");
    }
    currentDD = $(this);
    setSame(newi,oldi);
    currentDD.addClass("current");
  });
  
  $("[xname='btnNum']").click(function(){
    if(currentDD != null && currentDD.attr("t") == "0"){
      var newi = $(this).text();
      var oldi = currentDD.text();
      currentDD.text(newi);
      //设置统计值
      var isOk = statistic(newi,oldi);
      setSame(newi,oldi);
      //记录历史
      hisId[hisId.length] = currentDD.attr("i");
      hisValue[hisValue.length] = newi;
      if(isOk){
    	  if(record == 0 || nowTime < record){
    		  $("#sRecord").text(nowTime+"s");
    		  alert("新纪录哎，太厉害了!");
    		  $.ajax({ 
    			  async: true,
                    cache: false,
	  				type: "get", 
	  				url: _gModuleName+"/business/com.ql.math.web.MathAction?action=setSudokuRecord&level="+level+"&index="+sdkIndex+"&record="+nowTime,
	  				contentType: "text/html; charset=UTF-8",
	  				success: function(data, textStatus){
	  				},
	  				error:function(httpRequest,errType,ex ){
	  					//alert(ex);
	  				}
	  		});
    	  }
    	  else{
    		  alert("顺利完成，给自己一个赞吧!");
    	  }
      }
    }
  });
  
  generate();
});

function generate(){
	$("#content dd").each(function(index,data){ 
		  $(this).removeClass("same");
		  $(this).removeClass("current");
	  });
  $.ajax({ 
                cache: false,
				type: "get", 
				url: _gModuleName+"/business/com.ql.math.web.MathAction?action=getSudoku&level="+level,
				contentType: "text/html; charset=UTF-8",
				success: function(data, textStatus){
				  if(textStatus == "success"){
				    if(data.flag == true){
				    	var datas = data.msg;
				    	genSDK(datas[0]);
				    	genAnswer(datas[1],datas[0]);
				    	if(datas[2] > 0)
				    		$("#sRecord").text(datas[2]+"s");
				    	else
				    		$("#sRecord").text("无");
				    	record = datas[2];
				    	sdkIndex = datas[3];
				    	nowTime = 0;
				    	intervalId = setInterval("timeCountUp()",1000);
				    }
				    else
				      alert(data.msg);
				  }
	      },
	      error:function(httpRequest,errType,ex ){
	        alert(ex);
	      }
		});
}

function genSDK(datas){
  count = [0,0,0,0,0,0,0,0,0,0];
  for(var i=0;i<datas.length;i++){
    var dd = $("[i="+(i+1)+"]");
    if(datas[i] == 0){
      dd.text("");
      dd.removeClass("c");
      dd.attr("t","0");
    }
    else{
      dd.text(datas[i]);
      dd.addClass("c");
      dd.attr("t","1");
      count[datas[i]]++;
    }
  }
  for(var i=1;i<10;i++)
    $("#s"+i).text(count[i]);
}

function genAnswer(answer,datas){
  for(var i=0;i<answer.length;i++){
    var dd = $("[a="+(i+1)+"]");
    dd.text(answer[i]);
    if(datas[i] > 0){
      dd.addClass("c");
    }
    else{
      dd.removeClass("c");
    }
  }
}

function setSame(newi,oldi){
  if(newi == oldi || newi == 0)
    return;
  $("#content dd").each(function(index,data){ 
	  var i = $(this).text();
	  if(i == newi)
	    $(this).addClass("same");
	  else
	    $(this).removeClass("same");
  });
}

function statistic(newi,oldi){
  if(oldi > 0){
    count[oldi]--;
    $("#s"+oldi).text(count[oldi]);
  }
  if(newi == 0)
    return false;
  count[newi]++;
  $("#s"+newi).text(count[newi]);
  var sum = 0;
  for(var i=1;i<10;i++){
    sum += count[i];
  }  
  if(sum == 81){
    return check();
  }
  return false;
}

function check(){
  var datas = new Array();
  $("#sdk").children().each(function(index,data){
    datas.push($(this).text());
  });
  if(checkRow(datas)
      && checkCol(datas)
      && checkBlock(datas)){
	clearInterval(intervalId);
	intervalId = null;
    return true;
  }
  return false;
}

function checkRow(datas){
  for(var row=0;row<9;row++){
	  var tmp = [0,0,0,0,0,0,0,0,0,0];
	  for(var i=0;i<9;i++){
	    tmp[datas[row*9+i]]++; 
	  }
	  for(var i=1;i<=9;i++){
	    if(tmp[i] != 1){
	      alert("第"+(row+1)+"行有误！");
	      return false;
	    }
	  }
  }
  return true;
}

function checkCol(datas){
  for(var col=0;col<9;col++){
	  var tmp = [0,0,0,0,0,0,0,0,0,0];
	  for(var i=0;i<9;i++){
	    tmp[datas[i*9+col]]++; 
	  }
	  for(var i=1;i<=9;i++){
	    if(tmp[i] != 1){
	      alert("第"+(col+1)+"列有误！");
	      return false;
	    }
	  }
  }
  return true;
}

function checkBlock(datas){
  //每个小宫格的左上角index
  var points = [0,3,6,27,30,33,54,57,60];
  //每个小宫格中小方块对应左上角index的增量
  var steps = [0,1,2,9,10,11,18,19,20];
  for(var i=0;i<points.length;i++){
    var tmp = [0,0,0,0,0,0,0,0,0,0];
    for(var j=0;j<steps.length;j++){
      var index = points[i] + steps[j];
      tmp[datas[index]]++;
    }
	  for(var k=1;k<=9;k++){
	    if(tmp[k] != 1){
	      alert("第"+(k+1)+"个小九宫格有误！");
	      return false;
	    }
	  }
  }
  return true;
}

function checkRowBak(datas){
  for(var row=0;row<9;row++){
	  for(var i=row*9;i<(row+1)*9-1;i++){
	    for(var j=i+1;j<(row+1)*9;j++){
	      if(datas[i] == datas[j])
	        return false;
	    }
	  }
  }
  return true;
}

function checkColBak(datas){
  for(var col=0;col<9;col++){
	  for(var i=0;i<8;i++){
	    for(var j=i+1;j<9;j++){
	      if(datas[i*9+col] == datas[j*9+col])
	        return false;
	    }
	  }
  }
  return true;
}


function timeCountUp(){
  nowTime++;
  $("#sTimeUp").text(nowTime); 
}
