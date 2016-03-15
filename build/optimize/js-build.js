{
    optimize:'uglify2',
    optimizeCss:'standard',
    fileExclusionRegExp:/^((r|build)\.js)|(\.svn)$/,

    siteRoot: './',
    paths: {
        // athena框架配置地址
        'text' : 'libs/require/requirePlugin/text.min',
        'css' : 'libs/require/requirePlugin/css.min',
        'css-builder' : 'libs/require/requirePlugin/css-builder',
        'normalize' : 'libs/require/requirePlugin/normalize',
        'jquery' : 'libs/jquery/jquery-2.1.3.min',
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
        'scroller' : 'libs/athena/ui/scroller',
        'json2' : 'libs/json2.min',
        'css3d' : 'libs/css3d/css3d.min',
        // app其他辅助类
        'imgslter' : 'libs/imgslter/imgslter.min',
        'exif' : 'libs/imgslter/exif.min'
    },
    modules:[{
        name : 'main',
        include : ['text', 'css', 'jquery', 'bone', 'jstween', 'athena', 'map', 'model', 'router', 'pop', 'tracker'],
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
