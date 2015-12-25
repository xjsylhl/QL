<%@page import="com.ql.wechat.WechatCommons"%>
<%@page import="com.ql.wechat.WechatUtils"%>
<%@page import="com.ql.party.web.PartyAction"%>
<%@page import="com.ql.party.ivalues.ISocialCircleValue"%>
<%@page import="com.ai.appframe2.web.HttpUtil"%>
<%@ page contentType="text/html;charset=UTF-8"%>
<!DOCTYPE html>
<html>
  <head>
    <title>我的圈子</title>
	
    <meta http-equiv="keywords" content="聚会助手  社交圈">
    <meta http-equiv="content-type" content="text/html; charset=UTF-8">
    
    <%@ include file="/CommonHead.jsp"%>
  </head>

<%
String[] s = WechatUtils.getJsSignature(request);
long cId = HttpUtil.getAsLong(request, "cId");
ISocialCircleValue sc = PartyAction.getSocialCircle(cId);
%>  
  <body>
    <div class="container">
      <%if(sc == null){ %>
        <h3>此圈不存在，可能已经被删除</h3>
      <%}else{ %>
		<div class="page-header">
		  	<h3><%=sc.getCname() %>&nbsp;&nbsp;&nbsp;&nbsp;<small><%=sc.getExtAttr("TypeName") %>圈</small></h3>
		</div>
		<div class="center-block">
		  <button type="button" class="btn btn-link text-left" id="btnShare">分享</button>
		  <button type="button" class="btn btn-link text-center" >创建聚会</button>
		  <button type="button" class="btn btn-link text-right" >编辑我的圈信息</button>
		</div>
		<div class="panel-group" id="accordion">
		  <div class="panel panel-info" id="divMember">
		    <div class="panel-heading">
		      <a data-toggle="collapse" data-parent="#accordion" href="#cMember"><h4 class="panel-title">圈友</h4></a>
		    </div>
		    <div id="cMember" class="panel-collapse collapse">
		      成员。。。
		    </div>
		  </div>
		  <div class="panel panel-info" id="divParty">
		    <div class="panel-heading">
		      <a data-toggle="collapse" data-parent="#accordion" href="#cParty"><h4 class="panel-title">聚会</h4></a>
		    </div>
		    <div id="cParty" class="panel-collapse collapse">
		      聚会。。。
		    </div>
		  </div>
		</div>
	  <%} %>
	</div>
  </body>
</html>
<script language="javascript">

wx.config({
      debug: false,
      appId: '<%=WechatCommons.AppId%>',
      timestamp: <%=s[0] %>,
      nonceStr: '<%=s[1] %>',
      signature: '<%=s[2] %>',
      jsApiList: [
        'onMenuShareAppMessage'
      ]
  });
  
  
$(document).ready(function(){
  $("#btnShare").click(function(){
    wx.onMenuShareAppMessage({
    title: '邀您加入', // 分享标题
    desc: '加入圈子，参与聚会，分享照片', // 分享描述
    link: 'http://<%=WechatCommons.ServerIp%>/circle/CircleQR.jsp', // 分享链接
    imgUrl: '', // 分享图标
    type: 'link', // 分享类型,music、video或link，不填默认为link
    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
    success: function () { 
        // 用户确认分享后执行的回调函数
    },
    cancel: function () { 
        // 用户取消分享后执行的回调函数
    }
});
  }); 
});
</script>