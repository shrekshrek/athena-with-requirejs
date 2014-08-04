define({
    preloader: {title: "preloader", view: "app/view/Preloader", tpl: "app/tpl/preloader.html", css: "app/tpl/preloader", depth: "preload"},
    header: {title: "header", view: "app/view/Header", tpl: "app/tpl/header.html", css: "app/tpl/header", depth: "top-1"},
    footer: {title: "footer", view: "app/view/Footer", tpl: "app/tpl/footer.html", css: "app/tpl/footer", depth: "top-2"},
    //pages
    home: {title: "home", view: "app/view/pages/HomePage", tpl: "app/tpl/pages/home.html", css: "app/tpl/pages/home"},
    works: {title: "works", view: "app/view/pages/WorksPage", tpl: "app/tpl/pages/works.html", css: "app/tpl/pages/works"},
    //pops
    tips: {title: "tips", view: "app/view/pops/TipsPop", tpl: "app/tpl/pops/tips.html", css: "app/tpl/pops/tips", depth: "top", fast: "true"}
});
