<?php get_header(); ?>

<main>
    <?php
    if (have_posts()) :
        while (have_posts()) : the_post();
    ?>
            <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
                <h1><?php the_title(); ?></h1>
                <div><?php the_content(); ?></div>
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

<?php get_footer(); ?>