{
    optimize:'uglify2',
    optimizeCss:'standard',
    fileExclusionRegExp:/^((r|build)\.js)|(\.svn)$/,

    siteRoot: './',
    paths: {
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
    modules:[{
        name : 'main',
        include : ['text', 'css', 'underscore', 'backbone', 'jquery', 'tweenmax', 'athena', 'map', 'model', 'router', 'pop', 'tracker'],
        exclude : ['normalize']
    }, {
        name : 'app/preloader/preloader0',
        exclude : ['main', 'normalize']
    }, {
        name : 'app/preloader/preloader',
        exclude : ['main', 'normalize']
    }, {
        name : 'app/headfoot/header',
        exclude : ['main', 'normalize']
    }, {
        name : 'app/headfoot/footer',
        exclude : ['main', 'normalize']
    }, {
        name : 'app/pages/home',
        exclude : ['main', 'normalize']
    }, {
        name : 'app/pages/work',
        exclude : ['main', 'normalize']
    }, {
        name : 'app/pops/tip1',
        exclude : ['main', 'normalize']
    }]
}
