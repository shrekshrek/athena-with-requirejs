require.config({
    waitSeconds : 0,
    baseUrl : '@path@js/',
    paths : {
        // athena框架配置地址
        'text' : 'libs/require/requirePlugin/text.min',
        'css' : 'libs/require/requirePlugin/css.min',
        'css-builder' : 'libs/require/requirePlugin/css-builder',
        'normalize' : 'libs/require/requirePlugin/normalize',
        'jquery' : 'libs/jquery/jquery-2.1.3.min',
        //'jquery' : 'libs/jquery/jquery-1.11.2.min',
        //'jquery' : 'libs/zepto/zepto.min',
        'bone' : 'libs/bone/bone.min',
        'jstween' : 'libs/jstween/jstween.min',
        'csstween' : 'libs/csstween/csstween.min',
        'athena' : 'libs/athena/athena.min',
        // app基本类地址
        'map' : 'app/base/map',
        'model' : 'app/base/model',
        'router' : 'app/base/router',
        'tracker' : 'app/base/tracker',
        'pop' : 'app/pops/basePop',
        // lib辅助类
        'scroller' : 'libs/athena/ui/Scroller',
        'json' : 'libs/json/json2.min',
        'css3d' : 'libs/css3d/css3d.min',
        // app其他辅助类
        'imgslter' : 'libs/imgslter/imgslter.min',
        'exif' : 'libs/imgslter/exif.min'
    },
    shim : {
        'jquery' : {
            exports : '$'
        },
        'jquery.cookie' : ['jquery'],
        'jquery.md5' : ['jquery'],
        'jquery.qrcode' : ['jquery'],
        'jquery.validate' : ['jquery'],
        'jquery.validate-additional-methods' : ['jquery.validate'],
        'bone' : {
            deps : ['jquery'],
            exports : 'Bone'
        },
        'csstween' : {
            exports : 'CT'
        },
        'athena' : {
            deps : ['jquery', 'bone'],
            exports : 'Athena'
        },
        'css3d' : {
            exports : 'Css3D'
        },
        'easeljs' : {
            exports : 'createjs'
        },
        'preloadjs' : {
            exports : 'createjs'
        },
        'tweenjs' : {
            exports : 'createjs'
        },
        'movieclip' : {
            deps : ['easeljs','tweenjs'],
            exports : 'createjs'
        },
        'exif' : {
            exports : 'EXIF'
        },
        'imgslter' : {
            deps : ['exif'],
            exports : 'ImgSlter'
        }

    }
});

require(['bone', 'athena', 'map', 'router', 'model', 'jstween'], function(Bone, Athena, SiteMap, SiteRouter, SiteModel) {
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

        Bone.history.start({});
    }

});
