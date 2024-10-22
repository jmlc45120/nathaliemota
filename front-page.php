<?php get_template_part('template-parts/header'); ?>

<!-- Section Hero -->
<section class="hero-section">
<div class="hero-image">
        <?php
            // Récupérer toutes les images WebP au format paysage
            $args = array(
                'post_type' => 'attachment',
                'post_mime_type' => 'image/webp',
                'post_status' => 'inherit',
                'posts_per_page' => -1,
            );
            $images = get_posts($args);
            $landscape_images = array();

            // Filtrer les images au format paysage
            if ($images) {
                foreach ($images as $image) {
                    $image_meta = wp_get_attachment_metadata($image->ID);
                    if (isset($image_meta['width']) && isset($image_meta['height']) && $image_meta['width'] > $image_meta['height']) {
                        $landscape_images[] = $image;
                    }
                }
            }

            // Sélectionner une image aléatoire parmi les images paysage
            if ($landscape_images) {
                $random_image = $landscape_images[array_rand($landscape_images)];
                $random_image_url = wp_get_attachment_url($random_image->ID);
                echo '<img src="' . esc_url($random_image_url) . '" alt="Hero Image">';
            }
        ?>
        <h1 class="hero-title">PHOTOGRAPHE EVENT</h1>
    </div>
</section>

<!-- Section Filtres et Tri -->
<section class="filters-section">
    <div class="filters">
        <select id="category-filter">
            <option value="">CATÉGORIES</option>
            <?php
            $categories = get_terms(array(
                'taxonomy' => 'categorie-photo',
                'hide_empty' => false,
            ));
            foreach ($categories as $category) {
                echo '<option value="' . esc_attr($category->slug) . '">' . esc_html($category->name) . '</option>';
            }
            ?>
        </select>
        <select id="format-filter">
            <option value="">FORMATS</option>
            <?php
            $formats = get_terms(array(
                'taxonomy' => 'format-photo',
                'hide_empty' => false,
            ));
            foreach ($formats as $format) {
                echo '<option value="' . esc_attr($format->slug) . '">' . esc_html($format->name) . '</option>';
            }
            ?>
        </select>
        <select id="sort-filter">
            <option value="">TRIER PAR DATE</option>
            <option value="date_desc">Plus récente</option>
            <option value="date_asc">Plus ancienne</option>
        </select>
    </div>
</section>

<main>
    <?php
    $args = array(
        'post_type' => 'photo',
        'posts_per_page' => 8, // Nombre de photos à afficher
        'paged' => 1,
    );
    $photo_query = new WP_Query($args);
    ?>
    <?php if ($photo_query->have_posts()) : ?>
        <div class="photo-archive">
            <div class="photo-grid">             
                <?php while ($photo_query->have_posts()) : $photo_query->the_post(); ?>
                    <?php get_template_part('template-parts/photo_block'); // Inclure le bloc photo ?>
                <?php endwhile; ?>
            </div>
        </div>
        <div class="load-more-container">
            <button id="load-more" class="load-more-button">Charger plus</button>
        </div>
    <?php endif; ?>
</main>
<?php get_template_part('template-parts/footer'); ?>