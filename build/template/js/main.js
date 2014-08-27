require.config({
    waitSeconds: 60,
    baseUrl: "js",
    paths: {
        //athena框架配置地址
        "text": "libs/require/requirePlugin/text",
        "css": "libs/require/requirePlugin/css",
        "jquery": "libs/jquery/jquery-1.11.1.min",
        "underscore": "libs/backbone/underscore-1.7.0.min",
        "backbone": "libs/backbone/backbone-1.1.2.min",
        "tweenmax": "libs/greensock/TweenMax-1.13.2.min",
        "timelinemax": "libs/greensock/TimelineMax-1.13.2.min",
        "athena": "libs/athena/Athena",
        //辅助类
        "jquery.cookie": "libs/jquery/jquery.cookie-min",
        "jquery.md5": "libs/jquery/jquery.md5-min",
        "jquery.mousewheel": "libs/jquery/jquery.mousewheel-min",
        "jquery.validate": "libs/jquery/jquery.validate-min",
        "jquery.validate-additional-methods": "libs/jquery/validatePlugin/additional-methods",
        "jquery.qrcode": "libs/jquery/jquery.qrcode.min",
        "jquery.zclip": "libs/jquery/jquery.zclip.min",
        "jquery-ui": "libs/jquery-ui/jquery-ui-1.9.2.custom.min",
        "video": "libs/videojs/video-4.7.3.min",
        "json2": "libs/json2.min",
        "easel": "libs/createjs/easeljs-0.7.1.min",
        "three": "libs/threejs/three-r64.min",
        "hammer": "libs/hammer/hammer-2.0.2.min",
        //app配置地址
        "easyBtn": "libs/athena/ui/EasyBtn",
        "scroller": "libs/athena/ui/Scroller",
        "im20": "libs/im20/im20.common",
        "siteMap": "app/SiteMap",
        "siteModel": "app/model/SiteModel",
        "siteRouter": "app/router/SiteRouter",
        "tracker": "app/model/Tracker",
        "basePop": "app/view/pops/BasePop"
    },
    shim: {
        "jquery": {
            exports: "$"
        },
        "jquery.cookie": ["jquery"],
        "jquery.easie": ["jquery"],
        "jquery.md5": ["jquery"],
        "jquery.mousewheel": ["jquery"],
        "jquery.qrcode": ["jquery"],
        "jquery.jscrollpane": ["jquery"],
        "jquery.validate": ["jquery"],
        "jquery.validate-additional-methods": ["jquery.validate"],
        "jquery-ui": ["jquery"],
        "jquery.zclip": ["jquery"],
        "im20": ["jquery"],
        "underscore": {
            exports: "_"
        },
        "backbone": {
            deps: ["underscore", "jquery"],
            exports: "Backbone"
        },
        "tweenmax": {
            exports: "TweenMax"
        },
        "timelinemax": {
            deps: ["tweenmax"],
            exports: "TimelineMax"
        },
        "athena": {
            deps: ["underscore", "backbone", "jquery", "tweenmax"],
            exports: "Athena"
        },
        "easel": {
            exports: "createjs"
        },
        "video": {
            exports: "videojs"
        },
        "three": {
            exports: "THREE"
        },
        "hammer": {
            exports: "Hammer"
        }
    }
});

require(["jquery", "athena", "siteMap", "siteRouter", "siteModel", "im20"], function($, Athena, SiteMap, SiteRouter, SiteModel) {
    $(function() {
        Athena.api.init();
        Athena.api.fullScreen(true);
        Athena.api.windowRectMin({width: 1000, height: 600});
        Athena.api.flow(Athena.NORMAL);
        //Athena.api.preloadFast(true);
        if (SiteMap.preloader) {
            Athena.api.once(Athena.PRELOAD_PREPARE, init);
            Athena.api.preloader(SiteMap.preloader);
        } else {
            init();
        }
    });

    function init() {
        mouseEventOff();

        Backbone.history.start({pushState: false});

        //Communication.init(SiteModel.url);

    }

    function mouseEventOff() {
        $("body").on("mousedown", function(event) {
            var _tag = ["TEXTAREA", "INPUT", "P", "SPAN", "H1", "H2", "H3", "H4", "H5", "H6", "A", "SELECT"];
            var _len = _tag.length;
            for (var i = 0; i < _len; i++) {
                if (event.target.tagName == _tag[i])
                    return true;
            }
            return false;
        });
    }
});
