<div class="related-photo-item">
    <a href="<?php the_permalink(); ?>" class="photo-link">
        <?php if (has_post_thumbnail()) : ?>
            <?php the_post_thumbnail('large'); ?>
        <?php endif; ?>
        <div class="photo-overlay">
            <!-- Icône de l'œil pour afficher les informations -->
            <span class="icon-eye"><i class="fas fa-eye"></i></span>

            <!-- Informations qui apparaîtront au survol de l'icône œil -->
            <div class="photo-info-ovl" style="display: none;">
                <span class="photo-title-ovl">
                    <?php the_title(); ?>
                </span>
                <span class="photo-category-ovl">
                    <?php
                    $categories = get_the_terms(get_the_ID(), 'categorie-photo');
                    $category_names = !empty($categories) && !is_wp_error($categories) ? wp_list_pluck($categories, 'name') : ['Non spécifié'];
                    echo esc_html(implode(', ', $category_names));
                    ?>
                </span>
            </div>
            <span class="icon-fullscreen"
                data-src="<?php echo wp_get_attachment_image_src(get_post_thumbnail_id(), 'full')[0]; ?>"
                data-reference="<?php echo esc_attr(get_field('reference')); ?>"
                data-category="<?php
                    $categories = get_the_terms(get_the_ID(), 'categorie-photo');
                    $category_names = !empty($categories) && !is_wp_error($categories) ? wp_list_pluck($categories, 'name') : ['Non spécifié'];
                    echo esc_attr(implode(', ', $category_names));
                ?>">
                <i class="fas fa-expand-arrows-alt"></i>
            </span>
        </div>
    </a>
</div>