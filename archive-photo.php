<?php get_template_part('template-parts/header'); ?>

<main>
    <h1>Photos</h1>
    <?php if (have_posts()) : ?>
        <div class="photo-archive">
        <div class="photo-grid">
            <?php while (have_posts()) : the_post(); ?>
                <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
                    <a href="<?php the_permalink(); ?>">
                        <?php if (has_post_thumbnail()) : ?>
                            <div class="photo-thumbnail">
                                <?php the_post_thumbnail('photo-custom-size'); ?>
                            </div>
                        <?php endif; ?>
                        <h2><?php the_title(); ?></h2>
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
</main>

<?php get_template_part('template-parts/footer'); ?>