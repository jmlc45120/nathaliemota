<?php
function theme_nathaliemota_enqueue_styles() {
    wp_enqueue_style('main-style', get_stylesheet_uri());
}
add_action('wp_enqueue_scripts', 'theme_nathaliemota_enqueue_styles');