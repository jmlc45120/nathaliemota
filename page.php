<?php get_template_part( 'template-parts/header' ); ?>

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
        <p>Aucune page trouvée.</p>
    <?php
    endif;
    ?>
</main>

<?php get_template_part( 'template-parts/footer' ); ?>