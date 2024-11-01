<?php get_template_part('template-parts/header'); ?>

<main>
    <?php
    if (have_posts()) :
        while (have_posts()) : the_post();
            $reference = get_field('reference');
            ?>
            <script>
            var currentPhotoReference = "<?php echo esc_attr($reference); ?>"; // Stocke la référence
            </script>
            <?php
            $categories = get_the_terms(get_the_ID(), 'categorie-photo');
            $category_names = !empty($categories) && !is_wp_error($categories) ? wp_list_pluck($categories, 'name') : ['Non spécifié'];
            $category_name = implode(', ', $category_names);
    ?>
        <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
            <div class="photo-single">
                <div class="photo-info">
                    <h2 class="photo-title">
                        <?php
                        $title = get_the_title();
                        $words = explode(' ', $title);
                        if (count($words) > 2) {
                            echo implode(' ', array_slice($words, 0, 2)) . '<br>' . implode(' ', array_slice($words, 2));
                        } else {
                            echo $title;
                        }
                        ?>
                    </h2>
                    <!-- Informations supplémentaires avec les champs personnalisés ACF -->
                    <div class="photo-meta">
                        <p>RÉFÉRENCE : <?php echo esc_html($reference); ?></p>
                        <p>CATÉGORIE : <?php echo esc_html($category_name); ?></p>
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
                        echo '<img src="' . get_the_post_thumbnail_url(get_the_ID(), 'full-size') . '" alt="' . get_the_title() . '" >';
                    } ?>
                </div>
            </div>
            <div class="photo-navigation">
                <div class="single-cta">
                    <p> Cette photo vous intéresse ? </p>
                    <button class="open-contact-modal" data-reference="<?php echo esc_attr($reference); ?>">Contact</button>
                </div>
                <div class="card-nav">
                    <div class="card-img">
                        <img id="thumbnail" src="<?php echo get_the_post_thumbnail_url(get_the_ID(), 'thumbnail'); ?>" data-current-thumbnail="<?php echo get_the_post_thumbnail_url(get_the_ID(), 'thumbnail'); ?>" alt="Miniature">
                    </div>
                    <div class="arrow-nav">
                        <div class="prev-photo">
                            <?php
                            $prev_post = get_previous_post();
                            if (!empty($prev_post)) {
                                $prev_thumbnail = get_the_post_thumbnail_url($prev_post->ID, 'thumbnail');
                                $prev_link = get_permalink($prev_post->ID);
                                echo '<a href="' . $prev_link . '" data-thumbnail="' . $prev_thumbnail . '"><img class="arrow-prev" src="' . home_url('/wp-content/uploads/2024/10/arrow-prev.png') . '" alt="Photo précédente"></a>';
                            }
                            ?>
                        </div>
                        <div class="next-photo">
                            <?php
                            $next_post = get_next_post();
                            if (!empty($next_post)) {
                                $next_thumbnail = get_the_post_thumbnail_url($next_post->ID, 'thumbnail');
                                $next_link = get_permalink($next_post->ID);
                                echo '<a href="' . $next_link . '" data-thumbnail="' . $next_thumbnail . '"><img class="arrow-next" src="' . home_url('/wp-content/uploads/2024/10/arrow-next.png') . '" alt="Photo suivante"></a>';
                            }
                            ?>
                        </div>
                    </div> 
                </div>
            </div>
            <div class="related-photos">
                <h3>VOUS AIMEREZ AUSSI</h3>
                <div class="photo-list">
                    <?php
                    $categories = wp_get_post_terms(get_the_ID(), 'categorie-photo');
                    if ($categories) {
                        $category_ids = wp_list_pluck($categories, 'term_id');
                        $related_photos = new WP_Query(array(
                            'post_type' => 'photo',
                            'posts_per_page' => 2,
                            'post__not_in' => array(get_the_ID()), // Exclure la photo actuelle
                            'tax_query' => array(
                                array(
                                    'taxonomy' => 'categorie-photo',
                                    'field' => 'term_id',
                                    'terms' => $category_ids,
                                ),
                            ),
                        ));?>
                        <?php if ($related_photos->have_posts()) :?>
                            <div class="photo-archive">
                                <div class="photo-grid">  
                                <?php while ($related_photos->have_posts()) : $related_photos->the_post();
                                        get_template_part('template-parts/photo_block');
                                    endwhile;?>
                                </div>
                            </div>            
                        <?php wp_reset_postdata();
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