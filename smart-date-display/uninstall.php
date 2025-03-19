<?php
/**
 * Uninstall Smart Date Display
 *
 * Fired when the plugin is uninstalled to clean up any settings or data.
 *
 * @package Smart_Date_Display
 */

// If uninstall not called from WordPress, exit
if (!defined('WP_UNINSTALL_PLUGIN')) {
    exit;
}

/**
 * This plugin doesn't store any data in the database by default,
 * so no cleanup is necessary. If you extend this plugin to store
 * options or other data, add the cleanup code here.
 * 
 * Example:
 * 
 * // Remove options
 * delete_option('smart_date_display_settings');
 * 
 * // Remove user meta
 * $users = get_users();
 * foreach ($users as $user) {
 *     delete_user_meta($user->ID, 'smart_date_display_user_setting');
 * }
 * 
 * // Remove post meta
 * $posts = get_posts(array('post_type' => 'any', 'numberposts' => -1));
 * foreach ($posts as $post) {
 *     delete_post_meta($post->ID, 'smart_date_display_post_setting');
 * }
 */