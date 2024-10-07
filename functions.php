<?php
// Enqueue styles and scripts
function theme_nathaliemota_enqueue_styles()
{
    // Chargement des polices Google Fonts
    wp_enqueue_style('google-fonts', 'https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Poppins:wght@300&display=swap', false);

    // Chargement du fichier CSS généré à partir du SCSS
    wp_enqueue_style('main-style', get_template_directory_uri() . '/assets/css/style.css');

    // Chargement du script JavaScript pour la modale
    wp_enqueue_script('main-scripts', get_template_directory_uri() . '/assets/js/scripts.js', array('jquery'), null, true);
}
add_action('wp_enqueue_scripts', 'theme_nathaliemota_enqueue_styles');

// Register navigation menus
function register_my_menus()
{
    register_nav_menus(array(
        'main-menu' => __('Menu Principal'),
    ));
}
add_action('init', 'register_my_menus');
