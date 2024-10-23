<div class="related-photo-item">
    <a href="<?php the_permalink(); ?>" class="photo-link">
        <?php if (has_post_thumbnail()) : ?>
            <?php the_post_thumbnail('large'); ?>
        <?php endif; ?>
        <div class="photo-overlay">
            <span class="icon-eye"><i class="fas fa-eye"></i></span>
            <!-- L'icône qui déclenche la lightbox -->
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