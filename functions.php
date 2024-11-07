<?php

// Fonction pour enqueuee les styles et scripts
function theme_nathaliemota_enqueue_styles()
{
    // Chargement des polices Google Fonts
    wp_enqueue_style('google-fonts', 'https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Poppins:wght@300;500&display=swap', false);

    // Chargement du fichier CSS généré à partir du SCSS
    wp_enqueue_style('main-style', get_template_directory_uri() . '/assets/css/style.css');

    // Chargement du script JavaScript pour la modale
    wp_enqueue_script('main-scripts', get_template_directory_uri() . '/assets/js/scripts.js', array('jquery', 'custom-lightbox'), null, true);

    // Récupérer la valeur ACF "Référence" de la photo pour affichage dans la modale
    $reference_value = get_field('reference');

    // Passer la valeur "Référence" à JavaScript
    wp_localize_script('main-scripts', 'acfData', array(
        'reference' => $reference_value,
    ));
}
add_action('wp_enqueue_scripts', 'theme_nathaliemota_enqueue_styles');

// Fonction pour enqueuer les scripts pour la lightbox
function custom_lightbox_scripts() {
    wp_enqueue_script('custom-lightbox', get_template_directory_uri() . '/assets/js/lightbox.js', array(), '1.0', true);
}

add_action('wp_enqueue_scripts', 'custom_lightbox_scripts');

function exclude_media_from_editor($query) {
    // Vérifie que l'utilisateur n'est pas un administrateur
    if (!current_user_can('administrator')) {
        // Vérifie si la requête concerne les médias (attachments)
        if (is_admin() && $query->is_main_query() && 'attachment' === $query->get('post_type')) {
            // Exclure les médias par leurs IDs
            $query->set('post__not_in', array(151, 150, 149, 148, 147, 140, 142, 136, 53));
        }
    }
}
add_action('pre_get_posts', 'exclude_media_from_editor');

function custom_admin_css() {
    if (!current_user_can('administrator')) {
    echo '<style>
        #dashboard_right_now,
        #menu-posts,
        #menu-dashboard,
        #menu-tools,
        #toplevel_page_wpcf7,
        ul.wp-submenu.wp-submenu-wrap li:nth-child(4),
        #post-6,
        #post-113,
        #post-48,
        #post-50
        #post-166,
        #post-167, {
            display: none;
            }
    </style>';
    }
}
add_action('admin_head', 'custom_admin_css');

// Chargement des scripts de manière asynchrone
function add_defer_attribute($tag, $handle) {
    if ('main-scripts' === $handle || 'custom-lightbox' === $handle) {
        return str_replace(' src', ' defer="defer" src', $tag);
    }
    return $tag;
}
add_filter('script_loader_tag', 'add_defer_attribute', 10, 2);

// Ajout du support du logo personnalisé
function theme_setup() {
    add_theme_support('custom-logo', array(
        'height'      => 100,
        'width'       => 400,
        'flex-height' => true,
        'flex-width'  => true,
    ));
}
add_action('after_setup_theme', 'theme_setup');

// Enregistrement du menu de navigation
function register_my_menus()
{
    register_nav_menus(array(
        'main-menu' => __('Menu Principal'),
    ));
}
add_action('init', 'register_my_menus');

function custom_image_sizes() {
    add_image_size('photo-custom-size', 564, 495, true); // Taille personnalisée pour les photos
}
add_action('after_setup_theme', 'custom_image_sizes');

function create_photo_post_type() {
    register_post_type('photo',
        array(
            'labels' => array(
                'name' => __('Photos'),
                'singular_name' => __('Photo')
            ),
            'public' => true,
            'has_archive' => true,
            'rewrite' => array('slug' => 'photos'),
            'supports' => array('title', 'editor', 'thumbnail', 'excerpt', 'custom-fields'),
            'taxonomies' => array('category'), // Ajoute la taxonomie de catégorie par défaut
        )
    );
}
add_action('init', 'create_photo_post_type');

// Fonction pour charger plus de photos via AJAX
function load_more_photos() {
    $paged = isset($_GET['page']) ? intval($_GET['page']) : 1; // Numéro de la page
    $category = isset($_GET['category']) ? sanitize_text_field($_GET['category']) : '';
    $format = isset($_GET['format']) ? sanitize_text_field($_GET['format']) : '';
    $sort = isset($_GET['sort']) ? sanitize_text_field($_GET['sort']) : '';

    $args = array(
        'post_type' => 'photo',
        'posts_per_page' => 8,
        'paged' => $paged, // Ajoute le paramètre de pagination
    );

    $tax_query = array('relation' => 'AND');

    if ($category) {
        $tax_query[] = array(
            'taxonomy' => 'categorie-photo',
            'field' => 'slug',
            'terms' => $category,
        );
    }

    if ($format) {
        $tax_query[] = array(
            'taxonomy' => 'format-photo',
            'field' => 'slug',
            'terms' => $format,
        );
    }

    if (!empty($tax_query)) {
        $args['tax_query'] = $tax_query;
    }

    if ($sort) {
        if ($sort === 'date_asc') {
            $args['orderby'] = 'date';
            $args['order'] = 'ASC';
        } elseif ($sort === 'date_desc') {
            $args['orderby'] = 'date';
            $args['order'] = 'DESC';
        }
    }

    $photo_query = new WP_Query($args);

    if ($photo_query->have_posts()) :
        echo '<div class="photo-grid">'; // Conteneur de la grille de photos
        while ($photo_query->have_posts()) : $photo_query->the_post();
            get_template_part('template-parts/photo_block'); // Inclure le bloc photo
        endwhile;
        echo '</div>';
        wp_reset_postdata();
    else :
        echo '<p>Aucune autre photo trouvée.</p>';
    endif;

    wp_die();
}
add_action('wp_ajax_load_more_photos', 'load_more_photos');
add_action('wp_ajax_nopriv_load_more_photos', 'load_more_photos');

// Fonction pour filtrer les photos via AJAX
function filter_photos() {
    $category = isset($_GET['category']) ? sanitize_text_field($_GET['category']) : '';
    $format = isset($_GET['format']) ? sanitize_text_field($_GET['format']) : '';
    $sort = isset($_GET['sort']) ? sanitize_text_field($_GET['sort']) : '';

    $args = array(
        'post_type' => 'photo',
        'posts_per_page' => 8,
    );

    $tax_query = array('relation' => 'AND');

    if ($category) {
        $tax_query[] = array(
            'taxonomy' => 'categorie-photo',
            'field' => 'slug',
            'terms' => $category,
        );
    }

    if ($format) {
        $tax_query[] = array(
            'taxonomy' => 'format-photo',
            'field' => 'slug',
            'terms' => $format,
        );
    }

    if (!empty($tax_query)) {
        $args['tax_query'] = $tax_query;
    }

    if ($sort) {
        if ($sort === 'date_asc') {
            $args['orderby'] = 'date';
            $args['order'] = 'ASC';
        } elseif ($sort === 'date_desc') {
            $args['orderby'] = 'date';
            $args['order'] = 'DESC';
        }
    }

    $photo_query = new WP_Query($args);

    if ($photo_query->have_posts()) :
        echo '<div class="photo-grid">';
        while ($photo_query->have_posts()) : $photo_query->the_post();
            get_template_part('template-parts/photo_block');
        endwhile;
        echo '</div>';
        wp_reset_postdata();
    else :
        echo '<p>Aucune photo trouvée.</p>';
    endif;

    wp_die();
}
add_action('wp_ajax_filter_photos', 'filter_photos');
add_action('wp_ajax_nopriv_filter_photos', 'filter_photos');
