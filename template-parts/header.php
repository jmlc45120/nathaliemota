<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
    <div class="container">
        <header class="header__container">
            <div class="logo">
                <a href="<?php echo esc_url(home_url('/')); ?>">
                    <?php if (function_exists('the_custom_logo') && has_custom_logo()): ?>
                        <?php the_custom_logo(); ?>
                    <?php else: ?>
                        <img src="<?php echo esc_url(get_template_directory_uri() . '/assets/images/logo.png'); ?>" alt="<?php esc_attr_e('Site Logo', 'textdomain'); ?>" loading="lazy">
                    <?php endif; ?>
                </a>
            </div>
            <nav class="header__nav">
                <?php
                wp_nav_menu([
                    'theme_location' => 'main-menu',
                    'container'      => false,
                    'menu_class'     => 'navigation'
                ]);
                ?>
            </nav>
            <div class="burger-menu" aria-label="<?php esc_attr_e('Toggle navigation', 'textdomain'); ?>" role="button" tabindex="0">
                <span class="burger-bar"></span>
                <span class="burger-bar"></span>
                <span class="burger-bar"></span>
            </div>
        </header>