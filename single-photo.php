<?php get_template_part('template-parts/header'); ?>

<main>
    <?php
    if (have_posts()) :
        while (have_posts()) : the_post();
    ?>
            <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
            <div class="photo-single">
                <div class="photo-info">
                    <h2 class="photo-title">
                        <?php
                        $title = get_the_title();
                        $words = explode(' ', $title);
                        if (count($words) > 1) {
                            echo $words[0] . '<br>' . implode(' ', array_slice($words, 1));
                        } else {
                            echo $title;
                        }
                        ?>
                    </h2>
                    <!-- Informations supplémentaires avec les champs personnalisés (ACF) -->
                    <div class="photo-meta">
                        <p>RÉFÉRENCE : <?php the_field('reference'); ?></p>
                        <p>CATÉGORIE : 
                            <?php
                            $categories = get_the_terms(get_the_ID(), 'categorie-photo');
                            if ($categories && !is_wp_error($categories)) {
                                $category_names = wp_list_pluck($categories, 'name');
                                echo implode(', ', $category_names);
                            } else {
                                echo 'Non spécifié';
                            }
                            ?>
                        </p>
                        <p>FORMAT : 
                            <?php
                            $formats = get_the_terms(get_the_ID(), 'format-photo');
                            if ($formats && !is_wp_error($formats)) {
                                $format_names = wp_list_pluck($formats, 'name');
                                echo implode(', ', $format_names);
                            } else {
                                echo 'Non spécifié';
                            }
                            ?>
                        </p>
                        <p>TYPE : <?php the_field('type'); ?></p>
                        <p>ANNÉE : <?php echo get_the_date('Y'); ?></p>
                    </div>
                </div>
                <!-- Image mise en avant de la photo -->
                <div class="thumbnail-photo">
                    <?php if (has_post_thumbnail()) {
                        the_post_thumbnail('full-size'); // Taille personnalisée de l'image
                    } ?>
                </div>
            </div>
                <!-- Navigation entre les photos (précédent / suivant) -->
                <div class="photo-navigation">
                    <div class="prev-photo">
                        <?php previous_post_link('%link', '← Photo précédente'); ?>
                    </div>
                    <div class="next-photo">
                        <?php next_post_link('%link', 'Photo suivante →'); ?>
                    </div>
                </div>

                <!-- Photos apparentées (basées sur la même catégorie) -->
                <div class="related-photos">
                    <h3>VOUS AIMEREZ AUSSI</h3>
                    <div class="photo-list">
                        <?php
                        $categories = wp_get_post_terms(get_the_ID(), 'categorie-photo'); // Obtenir les catégories
                        if ($categories) {
                            $category_ids = wp_list_pluck($categories, 'term_id');

                            $related_photos = new WP_Query(array(
                                'post_type' => 'photo',
                                'posts_per_page' => 4,
                                'post__not_in' => array(get_the_ID()), // Exclure la photo actuelle
                                'tax_query' => array(
                                    array(
                                        'taxonomy' => 'categorie-photo',
                                        'field' => 'term_id',
                                        'terms' => $category_ids,
                                    ),
                                ),
                            ));

                            if ($related_photos->have_posts()) :
                                while ($related_photos->have_posts()) : $related_photos->the_post();
                                    get_template_part('templates_parts/photo_block'); // Appel du template photo_block
                                endwhile;
                                wp_reset_postdata();
                            endif;
                        }
                        ?>
                    </div>
                </div>

            </article>
    <?php
        endwhile;
    else :
    ?>
        <p>Aucune photo trouvée.</p>
    <?php
    endif;
    ?>
</main>

<?php get_template_part( 'template-parts/footer' ); ?>