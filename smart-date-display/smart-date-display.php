<?php
/**
 * Plugin Name: Smart Date Display
 * Description: A flexible WordPress plugin that displays dates in relative or absolute format
 * Version: 1.0.0
 * Author: Niklas Johansson
 * Author URI: https://github.com/niklas-joh
 * Text Domain: smart-date-display
 * Domain Path: /languages
 * License: GPL-2.0+
 * License URI: http://www.gnu.org/licenses/gpl-2.0.txt
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Main plugin class
 */
class Smart_Date_Display {

    /**
     * Plugin instance
     *
     * @var Smart_Date_Display
     */
    private static $instance = null;

    /**
     * Get plugin instance
     *
     * @return Smart_Date_Display
     */
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * Constructor
     */
    private function __construct() {
        // Define constants
        $this->define_constants();

        // Initialize hooks
        $this->init_hooks();

        // Load textdomain
        add_action('plugins_loaded', array($this, 'load_textdomain'));
    }

    /**
     * Define plugin constants
     */
    private function define_constants() {
        define('SMART_DATE_DISPLAY_VERSION', '1.0.0');
        define('SMART_DATE_DISPLAY_PATH', plugin_dir_path(__FILE__));
        define('SMART_DATE_DISPLAY_URL', plugin_dir_url(__FILE__));
        define('SMART_DATE_DISPLAY_FILE', __FILE__);
    }

    /**
     * Initialize hooks
     */
    private function init_hooks() {
        // Register shortcode
        add_shortcode('relative_date', array($this, 'relative_date_shortcode'));

        // Register block
        add_action('init', array($this, 'register_block'));

        // Register frontend script
        add_action('wp_enqueue_scripts', array($this, 'register_frontend_script'));
    }

    /**
     * Load plugin textdomain
     */
    public function load_textdomain() {
        load_plugin_textdomain(
            'smart-date-display',
            false,
            dirname(plugin_basename(__FILE__)) . '/languages'
        );
    }

    /**
     * Register frontend script
     */
    public function register_frontend_script() {
        wp_register_script(
            'smart-date-frontend',
            SMART_DATE_DISPLAY_URL . 'assets/js/smart-date.js',
            array('jquery'),
            SMART_DATE_DISPLAY_VERSION,
            true
        );
    }

    /**
     * Register block
     */
    public function register_block() {
        // Register block script
        wp_register_script(
            'smart-date-block-editor',
            SMART_DATE_DISPLAY_URL . 'assets/js/smart-date-admin.js',
            array(
                'wp-blocks',
                'wp-element',
                'wp-i18n',
                'wp-block-editor',
                'wp-components'
            ),
            SMART_DATE_DISPLAY_VERSION,
            true
        );
        
        // Register block style
        wp_register_style(
            'smart-date-editor-style',
            SMART_DATE_DISPLAY_URL . 'assets/css/editor-style.css',
            array(),
            SMART_DATE_DISPLAY_VERSION
        );

        // Set translation for block script
        if (function_exists('wp_set_script_translations')) {
            wp_set_script_translations(
                'smart-date-block-editor',
                'smart-date-display',
                SMART_DATE_DISPLAY_PATH . '/languages'
            );
        }

        // Register block type
        if (function_exists('register_block_type_from_metadata')) {
            // WP 5.5+ method
            register_block_type_from_metadata(
                SMART_DATE_DISPLAY_PATH,
                array(
                    'render_callback' => array($this, 'render_block')
                )
            );
        } else {
            // Fallback for older WP versions
            register_block_type('smart-date-display/date-block', array(
                'editor_script' => 'smart-date-block-editor',
                'editor_style' => 'smart-date-editor-style',
                'render_callback' => array($this, 'render_block'),
                'attributes' => array(
                    'date' => array(
                        'type' => 'string',
                        'default' => ''
                    ),
                    'displayType' => array(
                        'type' => 'string',
                        'default' => 'relative'
                    ),
                    'format' => array(
                        'type' => 'string',
                        'default' => 'F j, Y'
                    ),
                    'prefix' => array(
                        'type' => 'string',
                        'default' => ''
                    ),
                    'suffix' => array(
                        'type' => 'string',
                        'default' => 'ago'
                    ),
                    'locale' => array(
                        'type' => 'string',
                        'default' => 'en'
                    ),
                    'className' => array(
                        'type' => 'string',
                        'default' => ''
                    )
                )
            ));
        }
    }

    /**
     * Render block
     *
     * @param array $attributes Block attributes
     * @return string Rendered block
     */
    public function render_block($attributes) {
        // Enqueue frontend script
        wp_enqueue_script('smart-date-frontend');
        
        // Set default values
        $date = isset($attributes['date']) ? $attributes['date'] : current_time('mysql');
        $display_type = isset($attributes['displayType']) ? $attributes['displayType'] : 'relative';
        $format = isset($attributes['format']) ? $attributes['format'] : 'F j, Y';
        $prefix = isset($attributes['prefix']) ? $attributes['prefix'] : '';
        $suffix = isset($attributes['suffix']) ? $attributes['suffix'] : 'ago';
        $locale = isset($attributes['locale']) ? $attributes['locale'] : 'en';
        $class_name = isset($attributes['className']) ? $attributes['className'] : '';
        
        // Convert the date to a timestamp
        $timestamp = strtotime($date);
        
        // Form the shortcode attributes
        $shortcode_atts = array(
            'timestamp' => $timestamp,
            'display_type' => $display_type,
            'format' => $format,
            'prefix' => $prefix,
            'suffix' => $suffix,
            'locale' => $locale
        );
        
        // Get formatted date from shortcode
        $date_content = $this->relative_date_shortcode($shortcode_atts);
        
        // Add any additional classes
        $classes = 'smart-date-display';
        if (!empty($class_name)) {
            $classes .= ' ' . $class_name;
        }
        
        // Return formatted date with data attributes
        return sprintf(
            '<span class="%s" data-timestamp="%d" data-display-type="%s" data-prefix="%s" data-suffix="%s" data-locale="%s">%s</span>',
            esc_attr($classes),
            esc_attr($timestamp),
            esc_attr($display_type),
            esc_attr($prefix),
            esc_attr($suffix),
            esc_attr($locale),
            $date_content
        );
    }

    /**
     * Format relative date string
     *
     * @param int $timestamp Timestamp
     * @param string $prefix Text prefix
     * @param string $suffix Text suffix
     * @param string $locale Locale code
     * @return string Formatted date
     */
    public function format_relative_date($timestamp, $prefix, $suffix, $locale) {
        $time_diff = current_time('timestamp') - $timestamp;
        
        // Basic time units in seconds
        $minute = 60;
        $hour = 60 * $minute;
        $day = 24 * $hour;
        $week = 7 * $day;
        $month = 30 * $day;
        $year = 365 * $day;
        
        // Simple output for demonstration
        $output = $prefix ? esc_html($prefix) . ' ' : '';
        
        if ($time_diff < 0) {
            $output .= __('in the future', 'smart-date-display');
        } elseif ($time_diff < $minute) {
            $output .= __('just now', 'smart-date-display');
        } elseif ($time_diff < $hour) {
            $minutes = floor($time_diff / $minute);
            $output .= sprintf(
                _n('%d minute', '%d minutes', $minutes, 'smart-date-display'),
                $minutes
            );
        } elseif ($time_diff < $day) {
            $hours = floor($time_diff / $hour);
            $output .= sprintf(
                _n('%d hour', '%d hours', $hours, 'smart-date-display'),
                $hours
            );
        } elseif ($time_diff < $week) {
            $days = floor($time_diff / $day);
            $output .= sprintf(
                _n('%d day', '%d days', $days, 'smart-date-display'),
                $days
            );
        } elseif ($time_diff < $month) {
            $weeks = floor($time_diff / $week);
            $output .= sprintf(
                _n('%d week', '%d weeks', $weeks, 'smart-date-display'),
                $weeks
            );
        } elseif ($time_diff < $year) {
            $months = floor($time_diff / $month);
            $output .= sprintf(
                _n('%d month', '%d months', $months, 'smart-date-display'),
                $months
            );
        } else {
            $years = floor($time_diff / $year);
            $output .= sprintf(
                _n('%d year', '%d years', $years, 'smart-date-display'),
                $years
            );
        }
        
        if ($suffix && $time_diff > 0) {
            $output .= ' ' . esc_html($suffix);
        }
        
        return $output;
    }

    /**
     * Format absolute date
     *
     * @param int $timestamp Timestamp
     * @param string $format Date format
     * @param string $prefix Text prefix
     * @param string $suffix Text suffix
     * @return string Formatted date
     */
    public function format_absolute_date($timestamp, $format, $prefix, $suffix) {
        $output = $prefix ? esc_html($prefix) . ' ' : '';
        $output .= date_i18n($format, $timestamp);
        if ($suffix) {
            $output .= ' ' . esc_html($suffix);
        }
        return $output;
    }

    /**
     * Shortcode handler
     *
     * @param array $atts Shortcode attributes
     * @return string Formatted date
     */
    public function relative_date_shortcode($atts) {
        $attributes = shortcode_atts(
            array(
                'timestamp' => '',
                'date' => '',
                'display_type' => 'relative',
                'format' => 'F j, Y',
                'prefix' => '',
                'suffix' => 'ago',
                'locale' => 'en',
            ),
            $atts,
            'relative_date'
        );
        
        // If no timestamp or date, use current post date or current time
        if (empty($attributes['timestamp']) && empty($attributes['date'])) {
            global $post;
            if (isset($post->ID)) {
                $attributes['timestamp'] = get_the_time('U', $post->ID);
            } else {
                $attributes['timestamp'] = current_time('timestamp');
            }
        } elseif (!empty($attributes['date']) && empty($attributes['timestamp'])) {
            $attributes['timestamp'] = strtotime($attributes['date']);
        }
        
        // Validate timestamp
        if (!is_numeric($attributes['timestamp'])) {
            return __('Invalid date', 'smart-date-display');
        }
        
        // Format date based on display type
        if ($attributes['display_type'] === 'relative') {
            return $this->format_relative_date(
                $attributes['timestamp'],
                $attributes['prefix'],
                $attributes['suffix'],
                $attributes['locale']
            );
        } else {
            return $this->format_absolute_date(
                $attributes['timestamp'],
                $attributes['format'],
                $attributes['prefix'],
                $attributes['suffix']
            );
        }
    }
}

// Initialize the plugin
function smart_date_display() {
    return Smart_Date_Display::get_instance();
}

// Start plugin
smart_date_display();