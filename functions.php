<?php
function theme_nathaliemota_enqueue_styles() {
    // Chargement des polices Google Fonts
    wp_enqueue_style('google-fonts', 'https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Poppins:wght@300&display=swap', false);
    // Chargement du fichier CSS principal
    wp_enqueue_style('main-style', get_stylesheet_uri());
}
add_action('wp_enqueue_scripts', 'theme_nathaliemota_enqueue_styles');

//-----------------------------------------------------------------------

function register_my_menus()
{
    register_nav_menus(array(
        'main-menu' => __('Menu Principal'),
    ));
}
add_action('init', 'register_my_menus');
