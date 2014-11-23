require.config({
    waitSeconds : 0,
    baseUrl : './js',
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
        'athena' : 'libs/athena/Athena',
        // app基本类地址
        'map' : 'app/map',
        'model' : 'app/model',
        'router' : 'app/router',
        'tracker' : 'app/tracker',
        // lib辅助类
        "easyBtn" : "libs/athena/ui/EasyBtn",
        "scroller" : "libs/athena/ui/Scroller",
        'timelinemax' : 'libs/greensock/TimelineMax.min',
        'jquery.cookie' : 'libs/jquery/jquery.cookie-min',
        'jquery.md5' : 'libs/jquery/jquery.md5-min',
        'jquery.mousewheel' : 'libs/jquery/jquery.mousewheel',
        'jquery.validate' : 'libs/jquery/jquery.validate-min',
        'jquery.validate-additional-methods' : 'libs/jquery/validatePlugin/additional-methods',
        'jquery.qrcode' : 'libs/jquery/jquery.qrcode.min',
        'jquery.zclip' : 'libs/jquery/jquery.zclip.min',
        'json2' : 'libs/json2.min',
        'css3d' : 'libs/css3d/css3d'
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
            deps : ['underscore', 'jquery', 'backbone', 'tweenmax'],
            exports : 'Athena'
        },
        'timelinemax' : {
            deps : ['tweenmax'],
            exports : 'TimelineMax'
        },
        'css3d' : {
            deps : ['underscore'],
            exports : 'Css3D'
        }
        
    }
});

require(['backbone', 'athena', 'map', 'router', 'model'], function(Backbone, Athena, SiteMap, SiteRouter, SiteModel) {
    $(function() {
        Athena.api.init();
        Athena.api.fullScreen(true);
        Athena.api.windowRectMin({
            width : 1000,
            height : 600
        });
        Athena.api.flow(Athena.NORMAL);
//         Athena.api.preloadFast(true);
//         if (SiteMap.preloader) {
//         Athena.api.once(Athena.PRELOAD_PREPARE, init);
//         Athena.api.preloader(SiteMap.preloader);
//         } else {
//         init();
//         }

        Athena.api.once(Athena.PRELOAD_PREPARE, init);
        Athena.api.preloader({
            data : SiteMap.preloader0,
            el : $("#preloader0")
        });
    });

    function init() {
        mouseEventOff();

        Backbone.history.start({
            pushState : false
        });

    }

    function mouseEventOff() {
        $('body').on('mousedown', function(event) {
            var _tag = ['TEXTAREA', 'INPUT', 'P', 'SPAN', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'A', 'SELECT'];
            var _len = _tag.length;
            for ( var i = 0; i < _len; i++) {
                if (event.target.tagName == _tag[i])
                    return true;
            }
            return false;
        });
    }
});
