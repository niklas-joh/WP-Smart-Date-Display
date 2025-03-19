<?php
/**
 * Plugin Name: Smart Date Display
 * Description: A flexible WordPress plugin that displays dates in relative or absolute format with customizable prefixes, suffixes, and multilingual support
 * Version: 1.0
 * Author: Niklas Johansson
 * Author URI: https://github.com/niklas-joh
 * Plugin URI: https://github.com/niklas-joh/WP-Smart-Date-Display
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

// Define plugin constants
define('SMART_DATE_DISPLAY_PATH', plugin_dir_path(__FILE__));
define('SMART_DATE_DISPLAY_URL', plugin_dir_url(__FILE__));
define('SMART_DATE_DISPLAY_VERSION', '1.0.0');

class Smart_Date_Display {
    
    /**
     * Constructor - register shortcode and enqueue necessary scripts
     */
    public function __construct() {
        // Register shortcode
        add_shortcode('relative_date', array($this, 'relative_date_shortcode'));
        
        // Init hooks for block registration
        add_action('init', array($this, 'register_block'));
        
        // Frontend scripts
        add_action('wp_enqueue_scripts', array($this, 'enqueue_scripts'));
        
        // Admin scripts
        add_action('enqueue_block_editor_assets', array($this, 'enqueue_block_editor_assets'));
    }

/**
 * Enqueue block editor assets
 */
public function enqueue_block_editor_assets() {
    // Block editor script
    wp_enqueue_script(
        'smart-date-block-editor',
        SMART_DATE_DISPLAY_URL . 'assets/js/smart-date-admin.js',
        array(
            'wp-blocks',
            'wp-element',
            'wp-editor',
            'wp-components',
            'wp-i18n',
            'wp-block-editor'
        ),
        SMART_DATE_DISPLAY_VERSION,
        true
    );

    // Block editor styles
    wp_enqueue_style(
        'smart-date-editor-style',
        SMART_DATE_DISPLAY_URL . 'assets/css/editor-style.css',
        array(),
        SMART_DATE_DISPLAY_VERSION
    );

    // Register translations if available
    if (function_exists('wp_set_script_translations')) {
        wp_set_script_translations(
            'smart-date-block-editor',
            'smart-date-display'
        );
    }
}

/**
 * Register the Gutenberg block
 */
public function register_block() {
    // Check if register_block_type_from_metadata is available (WP 5.5+)
    if (function_exists('register_block_type_from_metadata')) {
        // Register from block.json
        register_block_type_from_metadata(
            SMART_DATE_DISPLAY_PATH,
            array(
                'render_callback' => array($this, 'render_block')
            )
        );
    } else {
        // Fallback for older WordPress versions
        register_block_type('smart-date-display/date-block', array(
            'editor_script' => 'smart-date-block-editor',
            'render_callback' => array($this, 'render_block'),
            'attributes' => array(
                // Your attributes array here
                // (This can stay the same as your current attributes)
            )
        ));
    }
}

    /**
     * Render the Gutenberg block
     */
    public function render_block($attributes) {
        // Convert block attributes to shortcode attributes
        $atts = array(
            'date' => isset($attributes['date']) ? $attributes['date'] : '',
            'display_type' => isset($attributes['displayType']) ? $attributes['displayType'] : 'relative',
            'format' => isset($attributes['format']) ? $attributes['format'] : 'Y-m-d H:i',
            'prefix' => isset($attributes['prefix']) ? $attributes['prefix'] : '',
            'suffix' => isset($attributes['suffix']) ? $attributes['suffix'] : 'ago',
            'locale' => isset($attributes['locale']) ? $attributes['locale'] : 'en'
        );

        // Get the formatted date content
        $date_content = $this->relative_date_shortcode($atts);
        
        // Build inline styles from attributes
        $style = '';
        
        // Text formatting
        if (!empty($attributes['textColor'])) {
            $style .= 'color:' . esc_attr($attributes['textColor']) . ';';
        }
        if (!empty($attributes['backgroundColor'])) {
            $style .= 'background-color:' . esc_attr($attributes['backgroundColor']) . ';';
        }
        if (isset($attributes['fontSize'])) {
            $style .= 'font-size:' . esc_attr($attributes['fontSize']) . 'px;';
        }
        if (!empty($attributes['textAlign'])) {
            $style .= 'text-align:' . esc_attr($attributes['textAlign']) . ';';
        }
        
        // Font weight and style
        if (isset($attributes['isBold']) && $attributes['isBold']) {
            $style .= 'font-weight:bold;';
        }
        if (isset($attributes['isItalic']) && $attributes['isItalic']) {
            $style .= 'font-style:italic;';
        }
        
        // Spacing
        if (isset($attributes['padding']) && is_numeric($attributes['padding'])) {
            $style .= 'padding:' . esc_attr($attributes['padding']) . 'px;';
        }
        if (isset($attributes['margin']) && is_numeric($attributes['margin'])) {
            $style .= 'margin:' . esc_attr($attributes['margin']) . 'px;';
        }
        
        // Border
        if (isset($attributes['borderWidth']) && $attributes['borderWidth'] > 0) {
            $style .= 'border-width:' . esc_attr($attributes['borderWidth']) . 'px;';
            $style .= 'border-style:solid;';
            
            if (!empty($attributes['borderColor'])) {
                $style .= 'border-color:' . esc_attr($attributes['borderColor']) . ';';
            } else {
                $style .= 'border-color:#ddd;';
            }
        }
        if (isset($attributes['borderRadius']) && is_numeric($attributes['borderRadius'])) {
            $style .= 'border-radius:' . esc_attr($attributes['borderRadius']) . 'px;';
        }
        
        // Output the styled date display
        if (!empty($style)) {
            return '<span class="smart-date-display" style="' . $style . '" data-timestamp="' . (strtotime($attributes['date']) ?: '') . '">' . $date_content . '</span>';
        } else {
            return '<span class="smart-date-display" data-timestamp="' . (strtotime($attributes['date']) ?: '') . '">' . $date_content . '</span>';
        }
    }

    /**
     * Converts a timestamp into a human-readable relative date string based on locale
     *
     * @param int $timestamp The timestamp to convert
     * @param string $format The date format to use for absolute display
     * @param string $prefix Text to display before the date
     * @param string $suffix Text to display after the date (usually "ago")
     * @param string $locale The locale to use for translations
     * @return string The formatted date string
     */
    public function format_relative_date($timestamp, $format, $prefix, $suffix, $locale) {
        // Time units in English
        $units = array(
            'en' => array(
                'second' => array('second', 'seconds'),
                'minute' => array('minute', 'minutes'),
                'hour' => array('hour', 'hours'),
                'day' => array('day', 'days'),
                'week' => array('week', 'weeks'),
                'month' => array('month', 'months'),
                'year' => array('year', 'years'),
                'future' => 'Date is in the future',
                'today' => 'Today',
                'yesterday' => 'Yesterday'
            ),
            'sv' => array(
                'second' => array('sekund', 'sekunder'),
                'minute' => array('minut', 'minuter'),
                'hour' => array('timme', 'timmar'),
                'day' => array('dag', 'dagar'),
                'week' => array('vecka', 'veckor'),
                'month' => array('månad', 'månader'),
                'year' => array('år', 'år'),
                'future' => 'Datum är i framtiden',
                'today' => 'Idag',
                'yesterday' => 'Igår'
            )
            // Add more languages as needed
        );

        // Default to English if the specified locale isn't available
        if (!isset($units[$locale])) {
            $locale = 'en';
        }

        $time_difference = time() - $timestamp;
        $seconds_in_a_day = 86400; // Number of seconds in a day
        $seconds_in_an_hour = 3600;
        $seconds_in_a_minute = 60;

        // Build the output string
        $output = $prefix ? $prefix . ' ' : '';

        if ($time_difference < 0) {
            return $output . $units[$locale]['future'];
        } elseif ($time_difference < $seconds_in_a_day) {
            if ($time_difference < $seconds_in_an_hour) {
                if ($time_difference < $seconds_in_a_minute) {
                    $seconds = $time_difference;
                    $unit = ($seconds == 1) ? $units[$locale]['second'][0] : $units[$locale]['second'][1];
                    $output .= "$seconds $unit";
                } else {
                    $minutes = floor($time_difference / $seconds_in_a_minute);
                    $unit = ($minutes == 1) ? $units[$locale]['minute'][0] : $units[$locale]['minute'][1];
                    $output .= "$minutes $unit";
                }
            } else {
                $hours = floor($time_difference / $seconds_in_an_hour);
                $unit = ($hours == 1) ? $units[$locale]['hour'][0] : $units[$locale]['hour'][1];
                $output .= "$hours $unit";
            }
        } elseif ($time_difference < 2 * $seconds_in_a_day) {
            $output .= $units[$locale]['yesterday'];
        } elseif ($time_difference < 7 * $seconds_in_a_day) {
            $days = floor($time_difference / $seconds_in_a_day);
            $unit = ($days == 1) ? $units[$locale]['day'][0] : $units[$locale]['day'][1];
            $output .= "$days $unit";
        } elseif ($time_difference < 30 * $seconds_in_a_day) {
            $weeks = floor($time_difference / (7 * $seconds_in_a_day));
            $unit = ($weeks == 1) ? $units[$locale]['week'][0] : $units[$locale]['week'][1];
            $output .= "$weeks $unit";
        } elseif ($time_difference < 365 * $seconds_in_a_day) {
            $months = floor($time_difference / (30 * $seconds_in_a_day));
            $unit = ($months == 1) ? $units[$locale]['month'][0] : $units[$locale]['month'][1];
            $output .= "$months $unit";
        } else {
            $years = floor($time_difference / (365 * $seconds_in_a_day));
            $unit = ($years == 1) ? $units[$locale]['year'][0] : $units[$locale]['year'][1];
            $output .= "$years $unit";
        }

        // Add suffix if provided
        if ($suffix) {
            $output .= " $suffix";
        }

        return $output;
    }

    /**
     * Format date according to the specified format
     *
     * @param int $timestamp The timestamp to format
     * @param string $format The date format to use
     * @param string $prefix Text to display before the date
     * @param string $suffix Text to display after the date
     * @return string The formatted date
     */
    public function format_absolute_date($timestamp, $format, $prefix, $suffix) {
        $output = $prefix ? $prefix . ' ' : '';
        $output .= date_i18n($format, $timestamp);
        if ($suffix) {
            $output .= " $suffix";
        }
        return $output;
    }

    /**
     * Shortcode function to convert a given timestamp or date string
     *
     * @param array $atts Shortcode attributes
     * @return string The formatted date string
     */
    public function relative_date_shortcode($atts) {
        $attributes = shortcode_atts(
            array(
                'timestamp' => '',
                'date' => '',
                'display_type' => 'relative', // relative or absolute
                'format' => 'Y-m-d H:i',      // PHP date format for absolute display
                'prefix' => '',               // Text before the date
                'suffix' => 'ago',            // Text after the date (for relative dates)
                'locale' => 'en',             // Language for translations
            ),
            $atts
        );

        // If no timestamp or date attribute provided, use the post's published date
        if (empty($attributes['timestamp']) && empty($attributes['date'])) {
            global $post;
            if (!is_null($post)) {
                $attributes['timestamp'] = get_the_time('U', $post->ID);
            }
        } elseif (!empty($attributes['date'])) {
            $attributes['timestamp'] = strtotime($attributes['date']);
        }

        // Validate the timestamp
        if (!empty($attributes['timestamp']) && is_numeric($attributes['timestamp'])) {
            if ($attributes['display_type'] === 'relative') {
                return $this->format_relative_date(
                    $attributes['timestamp'],
                    $attributes['format'],
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
        } else {
            return 'Invalid timestamp or date';
        }
    }
}

// Initialize the plugin
$smart_date_display = new Smart_Date_Display();