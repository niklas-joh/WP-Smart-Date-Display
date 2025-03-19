=== Smart Date Display ===
Contributors: niklasjoh
Tags: date, relative date, time, date format, gutenberg, block
Requires at least: 5.0
Tested up to: 6.5
Stable tag: 1.0.0
Requires PHP: 7.0
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Display dates in relative ("2 days ago") or absolute format with customizable options and multilingual support.

== Description ==

Smart Date Display is a flexible WordPress plugin that allows you to display dates in either relative ("2 days ago") or absolute (custom date format) display. It works both as a Gutenberg block and a shortcode, making it versatile for different use cases.

= Key Features =

* **Dual Implementation**: Works as both a shortcode and a Gutenberg block
* **Display Options**: Choose between relative ("2 days ago") or absolute (custom date format) display
* **Live Updates**: Relative dates automatically update without page refresh
* **Multilingual Support**: Built-in support for English and Swedish, easily extendable
* **Customizable**: Add prefixes and suffixes to dates, choose your own format
* **Easy to Use**: Simple interface in the block editor

= Usage =

**Shortcode Example:**

`[relative_date date="2023-01-01" display_type="relative" prefix="Posted" suffix="ago" locale="en"]`

**Block Editor:**

1. Insert the "Smart Date Display" block
2. Configure settings in the block sidebar:
   * Select date and time
   * Choose display type (relative/absolute)
   * Set date format for absolute display
   * Add prefix and suffix
   * Select language

= Developer-friendly =

The plugin code is built with WordPress best practices:

* Clean, well-documented code
* Full internationalization support
* Singleton pattern for efficient memory usage
* Proper escaping for security

== Installation ==

1. Upload the `smart-date-display` folder to the `/wp-content/plugins/` directory
2. Activate the plugin through the 'Plugins' menu in WordPress
3. Use the Smart Date Display block in the editor or the shortcode in your content

== Frequently Asked Questions ==

= Can I use this for post publication dates? =

Yes! If you don't specify a date in the shortcode, it will use the post's publication date by default.

= How do I format dates in absolute mode? =

Use standard PHP date format codes. For example:
* `Y-m-d` for 2023-01-31
* `F j, Y` for January 31, 2023
* `d/m/Y` for 31/01/2023

= Can I add my own language? =

Yes! The plugin is built to be easily extendable. To add support for additional languages, you can create a translation file or extend the code.

== Screenshots ==

1. Block editor interface showing the Smart Date Display block
2. Block settings panel showing configuration options
3. Frontend display of relative dates
4. Frontend display of absolute dates

== Changelog ==

= 1.0.0 =
* Initial release

== Upgrade Notice ==

= 1.0.0 =
Initial release