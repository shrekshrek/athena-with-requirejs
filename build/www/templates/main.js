require.config({
    waitSeconds : 0,
    baseUrl : '@path@js/',
    paths : {
        // athena框架配置地址
        'text' : 'libs/require/requirePlugin/text',
        'css' : 'libs/require/requirePlugin/css',
        'css-builder' : 'libs/require/requirePlugin/css-builder',
        'normalize' : 'libs/require/requirePlugin/normalize',
        'underscore' : 'libs/backbone/underscore-1.7.0.min',
        'backbone' : 'libs/backbone/backbone-1.1.2.min',
        'jquery' : 'libs/jquery/jquery-1.11.1.min',
        'tweenmax' : 'libs/greensock/TweenMax.min',
        'athena' : 'libs/athena/Athena.min',
        // app基本类地址
        'map' : 'app/base/map',
        'model' : 'app/base/model',
        'router' : 'app/base/router',
        'tracker' : 'app/base/tracker',
        'pop' : 'app/pops/basePop',
        // lib辅助类
        'scroller' : 'libs/athena/ui/Scroller',
        'timelinemax' : 'libs/greensock/TimelineMax.min',
        'jquery.cookie' : 'libs/jquery/jquery.cookie-min',
        'jquery.md5' : 'libs/jquery/jquery.md5-min',
        'jquery.mousewheel' : 'libs/jquery/jquery.mousewheel',
        'jquery.validate' : 'libs/jquery/jquery.validate-min',
        'jquery.validate-additional-methods' : 'libs/jquery/validatePlugin/additional-methods',
        'jquery.qrcode' : 'libs/jquery/jquery.qrcode.min',
        'jquery.zclip' : 'libs/jquery/jquery.zclip.min',
        'json2' : 'libs/json2.min'
        // app其他辅助类
    },
    shim : {
        'jquery' : {
            exports : '$'
        },
        'jquery.cookie' : ['jquery'],
        'jquery.easie' : ['jquery'],
        'jquery.md5' : ['jquery'],
        'jquery.mousewheel' : ['jquery'],
        'jquery.qrcode' : ['jquery'],
        'jquery.jscrollpane' : ['jquery'],
        'jquery.validate' : ['jquery'],
        'jquery.validate-additional-methods' : ['jquery.validate'],
        'jquery.zclip' : ['jquery'],
        'underscore' : {
            exports : '_'
        },
        'backbone' : {
            deps : ['underscore', 'jquery'],
            exports : 'Backbone'
        },
        'tweenmax' : {
            exports : 'TweenMax'
        },
        'athena' : {
            deps : ['jquery', 'backbone'],
            exports : 'Athena'
        },
        'timelinemax' : {
            deps : ['tweenmax'],
            exports : 'TimelineMax'
        }

    }
});

require(['backbone', 'athena', 'map', 'router', 'model', 'tweenmax'], function(Backbone, Athena, SiteMap, SiteRouter, SiteModel) {
    $(function() {
        Athena.init();
        Athena.fullScreen(true);
        Athena.windowRectMin({
            width : 1000,
            height : 600
        });
        Athena.flow(Athena.NORMAL);
        Athena.preloadFast(false);

        //没有默认loading时使用以下代码
        //if (SiteMap.preloader) {
        //    Athena.once(Athena.PRELOAD_PREPARE, init);
        //    Athena.preloader(SiteMap.preloader);
        //} else {
        //    init();
        //}

        //有默认loading时使用一下代码
        Athena.once(Athena.PRELOAD_PREPARE, init);
        Athena.preloader({
            data : SiteMap.preloader0,
            el : $("#preloader0")
        });
    });

    function init() {

        SiteModel.init();

        Backbone.history.start({
            pushState : false
        });
    }

});
