require.config({
    waitSeconds: 0,
    //urlArgs : '',
    baseUrl: '@path@js/',
    paths: {
        // athena框架配置地址
        'text': 'libs/require/requirePlugin/text.min',
        'css': 'libs/require/requirePlugin/css.min',
        'css-builder': 'libs/require/requirePlugin/css-builder',
        'normalize': 'libs/require/requirePlugin/normalize',
        'jquery': 'libs/jquery/jqlite.min',
        // 'jquery': 'libs/jquery/jquery-3.3.1.min',
        'bone': 'libs/bone/bone.min',
        'jstween': 'libs/jstween/jstween.min',
        'athena': 'libs/athena/athena.min',
        // app基本类地址
        'map': 'app/base/map',
        'model': 'app/base/model',
        'router': 'app/base/router',
        'page': 'app/pages/basePage',
        'pop': 'app/pops/basePop',
        // lib辅助类
        'json': 'libs/json/json2.min',
        'css3d': 'libs/css3d/css3d.min',
        // app其他辅助类
        'imgslter': 'libs/imgslter/imgslter.min',
        'exif': 'libs/imgslter/exif.min'
    },
    shim: {
        'jquery': {
            exports: '$'
        },
        'bone': {
            deps: ['jquery'],
            exports: 'Bone'
        },
        'csstween': {
            exports: 'CT'
        },
        'athena': {
            deps: ['jquery', 'bone'],
            exports: 'Athena'
        },
        'css3d': {
            exports: 'Css3D'
        },
        'easeljs': {
            exports: 'createjs'
        },
        'preloadjs': {
            exports: 'createjs'
        },
        'tweenjs': {
            exports: 'createjs'
        },
        'movieclip': {
            deps: ['easeljs', 'tweenjs'],
            exports: 'createjs'
        },
        'exif': {
            exports: 'EXIF'
        },
        'imgslter': {
            deps: ['exif'],
            exports: 'ImgSlter'
        }

    }
});

require(['bone', 'athena', 'jquery', 'map', 'router', 'model', 'jstween'], function (Bone, Athena, $, Map, Router, Model) {
    $(function () {
        Athena.init();
        Athena.fullScreen(true);
        Athena.windowRectMin({
            width: 1000,
            height: 600
        });
        Athena.flow(Athena.NORMAL);
        Athena.preloadFast(false);

        //没有默认loading时使用以下代码
        //if (Map.preloader) {
        //    Athena.once(Athena.PRELOAD_PREPARE, init);
        //    Athena.preloader(Map.preloader);
        //} else {
        //    init();
        //}

        //有默认loading时使用一下代码
        Athena.once(Athena.PRELOAD_PREPARE, function () {
            Bone.history.start({});
        });
        Athena.preloader({
            data: Map.preloader0,
            el: $("#preloader0")
        });
    });

});
