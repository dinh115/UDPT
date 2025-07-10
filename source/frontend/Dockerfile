# Use official PHP image with Apache
FROM php:8.2-apache

# Enable mod_rewrite for .htaccess support
RUN a2enmod rewrite

# Install PHP extensions if needed
# RUN docker-php-ext-install pdo pdo_mysql

# Set the document root to public/
ENV APACHE_DOCUMENT_ROOT /var/www/html/public

# Configure Apache to use public/ as document root and enable .htaccess
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/000-default.conf \
    && sed -ri -e 's!AllowOverride None!AllowOverride All!g' /etc/apache2/apache2.conf

# Create the directory structure (files will come from volume mount)
RUN mkdir -p /var/www/html/public /var/www/html/app

# Set proper permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html

# Expose port 80
EXPOSE 80

# Start Apache
CMD ["apache2-foreground"]