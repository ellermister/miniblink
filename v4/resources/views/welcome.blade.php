<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <title>Bootstrap 4 project documentation theme for developers</title>
    <!-- Meta -->
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="">
    <link rel="shortcut icon" href="favicon.ico">
    <link href='https://fonts.googleapis.com/css?family=Open+Sans:300italic,400italic,600italic,700italic,800italic,400,300,600,700,800' rel='stylesheet' type='text/css'>
    <!-- FontAwesome JS -->
    <script defer src="https://use.fontawesome.com/releases/v5.8.2/js/all.js" integrity="sha384-DJ25uNYET2XCl5ZF++U8eNxPWqcKohUUBUpKGlNLMchM7q4Wjg2CUpjHLaL8yYPH" crossorigin="anonymous"></script>
    <!-- Global CSS -->
    <link rel="stylesheet" href="/assets/plugins/bootstrap/css/bootstrap.min.css">
    <!-- Plugins CSS -->
    <link rel="stylesheet" href="/assets/plugins/elegant_font/css/style.css">
    <!-- Theme CSS -->
    <link id="theme-style" rel="stylesheet" href="/assets/css/styles.css">

</head>

<body class="landing-page">

<!-- GITHUB BUTTON JS -->
<script async defer src="https://buttons.github.io/buttons.js"></script>

<!--FACEBOOK LIKE BUTTON JAVASCRIPT SDK-->
<div id="fb-root"></div>
<script>(function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.5";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));</script>

<div class="page-wrapper">

    <!-- ******Header****** -->
    <header class="header text-center">
        <div class="container">
            <div class="branding">
                <h1 class="logo">
                    <span aria-hidden="true" class="icon_documents_alt icon"></span>
                    <span class="text-highlight">Pretty</span><span class="text-bold">Docs</span>
                </h1>
            </div><!--//branding-->
            <div class="tagline">
                <p>Free Bootstrap 4 theme for your project documentation</p>
                <p>Designed with <i class="fas fa-heart"></i> for developers</p>
            </div><!--//tagline-->

            <div class="main-search-box pt-3 pb-4 d-inline-block">
                <form class="form-inline search-form justify-content-center" action="" method="get">

                    <input type="text" placeholder="Enter search terms..." name="search" class="form-control search-input">

                    <button type="submit" class="btn search-btn" value="Search"><i class="fas fa-search"></i></button>

                </form>
            </div>

            <div class="social-container">
                <!-- Replace with your Github Button -->
                <div class="github-btn mb-2">
                    <a class="github-button" href="https://github.com/xriley/PrettyDocs-Theme" data-size="large" aria-label="Star xriley/PrettyDocs-Theme on GitHub">Star</a>
                    <a class="github-button" href="https://github.com/xriley" data-size="large" aria-label="Follow @xriley on GitHub">Follow @xriley</a>
                </div>
                <!-- Replace with your Twitter Button -->
                <div class="twitter-tweet">
                    <a href="https://twitter.com/share" class="twitter-share-button" data-text="PrettyDocs - A FREE #Bootstrap theme for project documentations #Responsive" data-via="3rdwave_themes">Tweet</a>
                    <script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');</script>
                </div><!--//tweet-->
                <!-- Replace with your Facebook Button -->
                <div class="fb-like" data-href="https://themes.3rdwavemedia.com" data-layout="button_count" data-action="like" data-show-faces="false" data-share="false"></div>
            </div><!--//social-container-->


        </div><!--//container-->
    </header><!--//header-->

    <section class="cards-section text-center">
        <div class="container">
            <h2 class="title">Getting started is easy!</h2>
            <div class="intro">
                <p>Welcome to prettyDocs. This landing page is an example of how you can use a card view to present segments of your documentation. You can customise the icon fonts based on your needs.</p>
                <div class="cta-container">
                    <a class="btn btn-primary btn-cta" href="https://themes.3rdwavemedia.com/bootstrap-templates/startup/prettydocs-free-bootstrap-theme-for-developers-and-startups/" target="_blank"><i class="fas fa-cloud-download-alt"></i> Download Now</a>
                </div><!--//cta-container-->
            </div><!--//intro-->
            <div id="cards-wrapper" class="cards-wrapper row">
                <div class="item item-green col-lg-4 col-6">
                    <div class="item-inner">
                        <div class="icon-holder">
                            <i class="icon fa fa-paper-plane"></i>
                        </div><!--//icon-holder-->
                        <h3 class="title">Quick Start</h3>
                        <p class="intro">Demo example, consectetuer adipiscing elit</p>
                        <a class="link" href="start.html"><span></span></a>
                    </div><!--//item-inner-->
                </div><!--//item-->
                <div class="item item-pink item-2 col-lg-4 col-6">
                    <div class="item-inner">
                        <div class="icon-holder">
                            <span aria-hidden="true" class="icon icon_puzzle_alt"></span>
                        </div><!--//icon-holder-->
                        <h3 class="title">Components</h3>
                        <p class="intro">Lorem ipsum dolor sit amet, consectetuer adipiscing elit</p>
                        <a class="link" href="components.html"><span></span></a>
                    </div><!--//item-inner-->
                </div><!--//item-->
                <div class="item item-blue col-lg-4 col-6">
                    <div class="item-inner">
                        <div class="icon-holder">
                            <span aria-hidden="true" class="icon icon_datareport_alt"></span>
                        </div><!--//icon-holder-->
                        <h3 class="title">Charts</h3>
                        <p class="intro">Lorem ipsum dolor sit amet, consectetuer adipiscing elit</p>
                        <a class="link" href="charts.html"><span></span></a>
                    </div><!--//item-inner-->
                </div><!--//item-->
                <div class="item item-purple col-lg-4 col-6">
                    <div class="item-inner">
                        <div class="icon-holder">
                            <span aria-hidden="true" class="icon icon_lifesaver"></span>
                        </div><!--//icon-holder-->
                        <h3 class="title">FAQs</h3>
                        <p class="intro">Layout for FAQ page. Lorem ipsum dolor sit amet, consectetuer adipiscing elit</p>
                        <a class="link" href="faqs.html"><span></span></a>
                    </div><!--//item-inner-->
                </div><!--//item-->
                <div class="item item-primary col-lg-4 col-6">
                    <div class="item-inner">
                        <div class="icon-holder">
                            <span aria-hidden="true" class="icon icon_genius"></span>
                        </div><!--//icon-holder-->
                        <h3 class="title">Showcase</h3>
                        <p class="intro">Layout for showcase page. Lorem ipsum dolor sit amet, consectetuer adipiscing elit </p>
                        <a class="link" href="showcase.html"><span></span></a>
                    </div><!--//item-inner-->
                </div><!--//item-->
                <div class="item item-orange col-lg-4 col-6">
                    <div class="item-inner">
                        <div class="icon-holder">
                            <span aria-hidden="true" class="icon icon_gift"></span>
                        </div><!--//icon-holder-->
                        <h3 class="title">License &amp; Credits</h3>
                        <p class="intro">Layout for license &amp; credits page. Consectetuer adipiscing elit.</p>
                        <a class="link" href="license.html"><span></span></a>
                    </div><!--//item-inner-->
                </div><!--//item-->
            </div><!--//cards-->

        </div><!--//container-->
    </section><!--//cards-section-->
</div><!--//page-wrapper-->

<footer class="footer text-center">
    <div class="container">
        <!--/* This template is released under the Creative Commons Attribution 3.0 License. Please keep the attribution link below when using for your own project. Thank you for your support. :) If you'd like to use the template without the attribution, you can buy the commercial license via our website: themes.3rdwavemedia.com */-->
        <small class="copyright">Designed with <i class="fas fa-heart"></i> by <a href="https://themes.3rdwavemedia.com/" target="_blank">Xiaoying Riley</a> for developers</small>

    </div><!--//container-->
</footer><!--//footer-->


<!-- Main Javascript -->
<script type="text/javascript" src="/assets/plugins/jquery-3.3.1.min.js"></script>
<script type="text/javascript" src="/assets/plugins/bootstrap/js/bootstrap.min.js"></script>
<script type="text/javascript" src="/assets/plugins/stickyfill/dist/stickyfill.min.js"></script>
<script type="text/javascript" src="/assets/js/main.js"></script>

</body>
</html>

