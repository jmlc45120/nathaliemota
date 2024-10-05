<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<header class="header__container">
    <div class="logo">
        <a href="<?php echo home_url(); ?>">
            <img src="<?php echo get_template_directory_uri(); ?>/assets/images/logo.png" alt="Logo du site">
        </a>
    </div>
    <nav class ="header__nav">
        <?php
        wp_nav_menu( array(
            'theme_location' => 'main-menu',
            'container'      => false,
            'menu_class'     => 'navigation'
        ) );
        ?>
    </nav>
    
</header>