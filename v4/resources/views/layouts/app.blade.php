<!DOCTYPE html>
<html lang="en">
<head>
    <title>docs - @yield('title')</title>
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
    <link rel="stylesheet" href="/assets/plugins/prism/prism.css">
    <link rel="stylesheet" href="/assets/plugins/elegant_font/css/style.css">

    <!-- Theme CSS -->
    <link id="theme-style" rel="stylesheet" href="/assets/css/styles.css">

</head>

<body class="body-green">
<div class="page-wrapper">
    <!-- ******Header****** -->
    <header id="header" class="header">
        <div class="container">
            <div class="branding">
                <h1 class="logo">
                    <a href="index.html">
                        <span aria-hidden="true" class="icon_documents_alt icon"></span>
                        <span class="text-highlight">Pretty</span><span class="text-bold">Docs</span>
                    </a>
                </h1>

            </div><!--//branding-->

            <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="index.html">Home</a></li>
                <li class="breadcrumb-item active">Quick Start</li>
            </ol>

            <div class="top-search-box">
                <form class="form-inline search-form justify-content-center" action="" method="get">

                    <input type="text" placeholder="Search..." name="search" class="form-control search-input">

                    <button type="submit" class="btn search-btn" value="Search"><i class="fas fa-search"></i></button>

                </form>
            </div>

        </div><!--//container-->
    </header><!--//header-->
    <div class="doc-wrapper">
        <div class="container">
            <div id="doc-header" class="doc-header text-center">
                <h1 class="doc-title"><i class="icon fa fa-paper-plane"></i> Quick Start</h1>
                <div class="meta"><i class="far fa-clock"></i> Last updated: July 18th, 2018</div>
            </div><!--//doc-header-->
            <div class="doc-body row">
                <div class="doc-content col-md-9 col-12 order-1">
                    @yield('content')
                </div><!--//doc-content-->
                
                
                <div class="doc-sidebar col-md-3 col-12 order-0 d-none d-md-flex">
                    <div id="doc-nav" class="doc-nav">

                        @yield('nav')

                    </div>
                </div><!--//doc-sidebar-->
            </div><!--//doc-body-->
        </div><!--//container-->
    </div><!--//doc-wrapper-->

    <div id="promo-block" class="promo-block" style="display: none;">
        <div class="container">
            <div class="promo-block-inner">
                <h3 class="promo-title text-center"><i class="fas fa-heart"></i> <a href="https://themes.3rdwavemedia.com/bootstrap-templates/portfolio/instance-bootstrap-portfolio-theme-for-developers/" target="_blank">Are you an ambitious and entrepreneurial developer?</a></h3>
                <div class="row">
                    <div class="figure-holder col-lg-5 col-md-6 col-12">
                        <div class="figure-holder-inner">
                            <a href="https://themes.3rdwavemedia.com/bootstrap-templates/portfolio/instance-bootstrap-portfolio-theme-for-developers/" target="_blank"><img class="img-fluid" src="/assets/images/demo/instance-promo.jpg" alt="Instance Theme" /></a>
                            <a class="mask" href="https://themes.3rdwavemedia.com/bootstrap-templates/portfolio/instance-bootstrap-portfolio-theme-for-developers/"><i class="icon fa fa-heart pink"></i></a>

                        </div>
                    </div><!--//figure-holder-->
                    <div class="content-holder col-lg-7 col-md-6 col-12">
                        <div class="content-holder-inner">
                            <div class="desc">
                                <h4 class="content-title"><strong> Instance - Bootstrap 4 Portfolio Theme for Aspiring Developers</strong></h4>
                                <p>Check out <a href="https://themes.3rdwavemedia.com/bootstrap-templates/portfolio/instance-bootstrap-portfolio-theme-for-developers/" target="_blank">Instance</a> - a Bootstrap personal portfolio theme I created for developers. The UX design is focused on selling a developer’s skills and experience to potential employers or clients, and has <strong class="highlight">all the winning ingredients to get you hired</strong>. It’s not only a HTML site template but also a marketing framework for you to <strong class="highlight">build an impressive online presence with a high conversion rate</strong>. </p>
                                <p><strong class="highlight">[Tip for developers]:</strong> If your project is Open Source, you can use this area to promote your other projects or hold third party adverts like Bootstrap and FontAwesome do!</p>
                                <a class="btn btn-cta" href="https://themes.3rdwavemedia.com/bootstrap-templates/portfolio/instance-bootstrap-portfolio-theme-for-developers/" target="_blank"><i class="fas fa-external-link-alt"></i> View Demo</a>

                            </div><!--//desc-->


                            <div class="author"><a href="https://themes.3rdwavemedia.com">Xiaoying Riley</a></div>
                        </div><!--//content-holder-inner-->
                    </div><!--//content-holder-->
                </div><!--//row-->
            </div><!--//promo-block-inner-->
        </div><!--//container-->
    </div><!--//promo-block-->

</div><!--//page-wrapper-->

<footer id="footer" class="footer text-center">
    <div class="container">
        <!--/* This template is released under the Creative Commons Attribution 3.0 License. Please keep the attribution link below when using for your own project. Thank you for your support. :) If you'd like to use the template without the attribution, you can buy the commercial license via our website: themes.3rdwavemedia.com */-->
        <small class="copyright">Designed with <i class="fas fa-heart"></i> by <a href="https://themes.3rdwavemedia.com/" target="_blank">Xiaoying Riley</a> for developers</small>

    </div><!--//container-->
</footer><!--//footer-->


<!-- Main Javascript -->
<script type="text/javascript" src="/assets/plugins/jquery-3.3.1.min.js"></script>
<script type="text/javascript" src="/assets/plugins/bootstrap/js/bootstrap.min.js"></script>
<script type="text/javascript" src="/assets/plugins/prism/prism.js"></script>
<script type="text/javascript" src="/assets/plugins/jquery-scrollTo/jquery.scrollTo.min.js"></script>
<script type="text/javascript" src="/assets/plugins/stickyfill/dist/stickyfill.min.js"></script>
<script type="text/javascript" src="/assets/js/main.js"></script>
</body>
</html>

