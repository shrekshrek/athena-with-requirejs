require.config({
	waitSeconds:60,
	baseUrl:"js",
    paths:{
    	//athena框架配置地址
		'text':'libs/require/requirePlugin/text-min',
        'jquery':'libs/jquery/jquery-1.9.1.min',
        'underscore':'libs/backbone/underscore-min',
		'backbone':'libs/backbone/backbone-min',
        'tweenMax':'libs/greensock/TweenMax.min',
    	'athena':'athenaframework/Athena',
		'baseView':'athenaframework/base/BaseView',
		'basePage':'athenaframework/base/BasePage',
		'basePageConst':'athenaframework/base/BasePageConst',
		'siteRouter':'app/router/SiteRouter',
		'siteModel':'app/model/SiteModel',
    	'siteMap':'app/SiteMap',
		//其他辅助类
		'jquery.cookie':'libs/jquery/jquery.cookie-min',
        'jquery.md5':'libs/jquery/jquery.md5-min',
        'jquery.mousewheel':'libs/jquery/jquery.mousewheel-min',
        'jquery.qrcode':'libs/jquery/jquery.qrcode.min',
        'jquery.jscrollpane':'libs/jquery/jquery.jscrollpane.min',
        'jquery.validate':'libs/jquery/jquery.validate-min',
        'jquery.validate-additional-methods':'libs/jquery/validatePlugin/additional-methods',
		'video':'libs/video-4.1.0.min',
		//app配置地址
        'tracker':'app/model/Tracker',
		'baseBtn':'athenaframework/base/BaseBtn',
		'easyBtn':'athenaframework/ui/EasyBtn',
		'easyBtn2':'athenaframework/ui/EasyBtn2',
		'basePop':'app/base/BasePop',
		'headerNav':'app/base/HeaderNav',
		'leftBtn':'app/base/LeftBtn',
		'rightBtn':'app/base/RightBtn',
		'journeyNav':'app/base/JourneyNav',
		'journeySide':'app/base/JourneySide',
		'shareItem':'app/base/ShareItem',
		'goBtn':'app/base/GoBtn',
		'reviewImgItem':'app/base/ReviewImgItem',
		'imgListItem':'app/base/ImgListItem',
		'qrView':'app/base/QrView'
    },
    shim:{
		'jquery':{
			exports:'$'
		},
        'jquery.cookie':['jquery'],
        'jquery.easie':['jquery'],
        'jquery.md5':['jquery'],
        'jquery.mousewheel':['jquery'],
        'jquery.qrcode':['jquery'],
        'jquery.jscrollpane':['jquery'],
        'jquery.validate':['jquery'],
        'jquery.validate-additional-methods':['jquery.validate'],
		'underscore':{
			exports:'_'
		},
		'backbone': {
			deps:['underscore','jquery'],
			exports:'Backbone'
		},
		'tweenMax':{
			exports:'TweenMax'
		},
		'preload': {
			exports:'createjs'
		},
		'video': {
			exports:'_V_'
		}
	}
});

require(['jquery','athena','siteMap','siteRouter'],function($,Athena,SiteMap,SiteRouter){
	$(function(){
		Athena.init();
		Athena.fullScreen(true);
		//Athena.windowRectMin({width:1000,height:600});
		Athena.windowRectMin({width:1,height:1});
		Athena.flow(Athena.NORMAL);
		if(SiteMap.preloader){
			Athena.preloader(SiteMap.preloader,{complete:function(){
				init();
			}});
		}else{
			init();
		}
	});
	
	function init(){
		Athena.pageTo(SiteMap.header);
		Athena.pageTo(SiteMap.footer);
		Backbone.history.start({pushState:false});
		
		$("body").on("mousedown",function(event){
			var _tag = ["TEXTAREA","INPUT","P","SPAN","H1","H2","H3","H4","H5","H6","A","SELECT"];
			var _len = _tag.length;
			for(var i=0; i<_len; i++){
				if(event.target.tagName==_tag[i]) return true;
			}
			return false;
		});
	}
	
});

