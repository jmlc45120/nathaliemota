<?php get_template_part('template-parts/header'); ?>

<!-- Section Hero -->
<section class="hero-section">
    <div class="hero-image">
        <?php
            echo '<img src="' . home_url('/wp-content/uploads/2024/10/nathalie-1.webp') . '" alt="Hero Image">';
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
                    <article id="post-<?php the_ID(); ?>" <?php post_class('photo-item'); ?>>
                        <a href="<?php the_permalink(); ?>">
                            <?php if (has_post_thumbnail()) : ?>
                                <div class="photo-thumbnail">
                                    <?php the_post_thumbnail('large'); ?>
                                </div>
                            <?php endif; ?>
                            <div class="photo-excerpt">
                                <?php the_excerpt(); ?>
                            </div>
                        </a>
                    </article>
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
    <?php else : ?>
        <p>Aucune photo trouvée.</p>
    <?php endif; ?>
    <?php wp_reset_postdata(); ?>
</main>

<?php get_template_part('template-parts/footer'); ?>