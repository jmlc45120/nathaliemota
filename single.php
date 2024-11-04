<?php get_template_part( 'template-parts/header' ); ?>

<main>
    <?php
    if (have_posts()) :
        while (have_posts()) : the_post();
    ?>
            <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
                <div>
                    <?php the_content(); ?>
                </div>
            </article>
        <?php
        endwhile;
    else :
        ?>
        <p>Aucun article trouvé.</p>
    <?php
    endif;
    ?>
</main>

<?php get_template_part( 'template-parts/footer' ); ?>