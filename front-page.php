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
<main>
    <?php
    $args = array(
        'post_type' => 'photo',
        'posts_per_page' => 8, // Nombre de photos à afficher
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
        <div class="pagination">
            <?php
            // Pagination
            the_posts_pagination(array(
                'mid_size' => 2,
                'prev_text' => __('« Précédent', 'textdomain'),
                'next_text' => __('Suivant »', 'textdomain'),
            ));
            ?>
        </div>
    <?php endif; ?>
</main>
<?php get_template_part('template-parts/footer'); ?>