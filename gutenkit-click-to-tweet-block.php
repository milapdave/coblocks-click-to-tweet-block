<?php
/**
 * Plugin Name: Click to Tweet Block Gutenberg
 * Plugin URI: https://gutenkit.com
 * Description: Easily add a click to tweet block into the upcoming Gutenberg editor. <strong>This is a beta release.</strong>
 * Author: Rich Tabor from GutenKit
 * Author URI: https://richtabor.com
 * Version: @@pkg.version
 * Text Domain: gutenkit
 * Domain Path: languages
 * Requires at least: 4.7
 * Tested up to: 4.9.1
 *
 * The following was made possible in part by the Gutenberg Boilerplate
 * Check it out - https://github.com/ahmadawais/Gutenberg-Boilerplate
 *
 * GutenKit is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * any later version.
 *
 * GutenKit is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with GutenKit. If not, see <http://www.gnu.org/licenses/>.
 *
 * @package   @@pkg.title for Gutenberg
 * @author    @@pkg.author
 * @license   @@pkg.license
 */




function gutenberg_render_block_core_latest_sss( $attributes ) {

	// return print_r( $attributes );

	// $tweet = is_array( $attributes ) && isset( $attributes['tweet'] ) ? $attributes['tweet'] : false;

	// $via   = isset( $attributes['via'] ) ? str_replace( '@', '', $attributes['via'] ) : $attributes['via'];
	// $align = isset( $attributes['align'] ) ? $attributes['align'] : 'left';

	// Markup and styles.
	$class      = 'wp-block-gutenkit-click-to-tweet';
	$text_align = "text-align:{$attributes['align']}";
	$text_color = "color:{$attributes['color__text']}";
	$bg_color   = "background-color:{$attributes['color__background']}";

	// Generate the Twitter URL.
	$url = '
		http://twitter.com/share?
		&url=' . get_the_permalink() . '
		&via=' . $attributes['via'] . '
	';

	// Apply filters, so that it may be modified.
	$url = apply_filters( 'gutenkit_click_to_tweet_url', $url );

	// Output the block if a URL is generated.
	$markup  = '';
	$markup .= sprintf( '<div class="%1$s" style="%2$s">', esc_attr( $class ), esc_attr( $text_align ) );
	$markup .= sprintf( '<div class="gutenkit--click-to-tweet" style="%1$s">', esc_attr( $bg_color ) );
	$markup .= sprintf( '<a class="gutenkit--click-to-tweet__link" target="_blank">%1$s</a>', esc_url( $url ) );
	$markup .= sprintf( '<span class="gutenkit--click-to-tweet__label gutenkit--gray" style="%1$s">Click to Tweet</a>', esc_attr( $text_color ) );
	$markup .= sprintf( '</div>' );
	$markup .= sprintf( '</div>' );


	return $markup;
}

register_block_type( 'gutenkit/click-to-tweet', array(
	'attributes'      => array(
		'via'               => array(
			'type'     => 'string',
			// 'source'   => 'text',
			// 'selector' => '.gutenkit--click-to-tweet__via',
		),
		'tweet'             => array(
			'type'     => 'string',
			// 'source'   => 'text',
			// 'selector' => '.gutenkit--click-to-tweet__text',
		),
		'align'             => array(
			'type'    => 'string',
			'default' => 'left',
		),
		'color__background' => array(
			'type' => 'string',
		),
		'color__text'       => array(
			'type' => 'string',
		),
	),
	 'render_callback' => 'gutenberg_render_block_core_latest_sss',
) );





/**
 * Main GutenKit Lite Click to Tweet Block
 *
 * @since 1.0.0
 */
class Gutenkit_Lite_Click_To_Tweet_Block {

	/**
	 * This plugin's instance.
	 *
	 * @var Gutenkit_Lite_Click_To_Tweet_Block
	 */
	private static $instance;

	/**
	 * Registers the plugin.
	 */
	public static function register() {
		if ( null === self::$instance ) {
			self::$instance = new Gutenkit_Lite_Click_To_Tweet_Block();
		}
	}

	/**
	 * The base directory path (without trailing slash).
	 *
	 * @var string $_url
	 */
	private $_dir;

	/**
	 * The base URL path (without trailing slash).
	 *
	 * @var string $_url
	 */
	private $_url;

	/**
	 * The Plugin version.
	 *
	 * @var string $_version
	 */
	private $_version;

	/**
	 * The Constructor.
	 */
	private function __construct() {

		$this->_version = '@@pkg.version';
		$this->_slug    = 'gutenkit-lite-click-to-tweet-block';
		$this->_dir     = untrailingslashit( plugin_dir_path( __FILE__ ) );
		$this->_url     = untrailingslashit( plugins_url( '/', __FILE__ ) );

		add_action( 'plugins_loaded', array( $this, 'plugins_loaded' ) );
		// add_action( 'init', array( $this, 'register_block' ) );
	}

	/**
	 * Add actions to enqueue assets.
	 *
	 * @access public
	 */
	public function plugins_loaded() {
		add_action( 'enqueue_block_assets', array( $this, 'enqueue_block_assets' ) );
		add_action( 'enqueue_block_editor_assets', array( $this, 'enqueue_block_editor_assets' ) );
	}

	/**
	 * Register the block.
	 *
	 * @access public
	 */
	public function register_block() {
	}

	/**
	 * Renders the `gutenkit/social-sharing` block on server.
	 *
	 * @param array $attributes The block attributes.
	 * @return string Returns click to tweet element.
	 */
	public function render_block( $attributes ) {

		$via   = is_array( $attributes ) && isset( $attributes['via'] ) ? str_replace( '@', '', $attributes['via'] ) : $attributes['via'];
		$tweet = isset( $attributes['tweet'] ) ? $attributes['tweet'] : $attributes['tweet'];
		$align = isset( $attributes['align'] ) ? $attributes['align'] : 'left';

		// Markup and styles.
		$class      = 'wp-block-gutenkit-click-to-tweet';
		$text_align = "text-align:{$attributes['align']}";
		$text_color = "text-color:{$attributes['color__text']}";

		// Generate the Twitter URL.
		$url = '
			http://twitter.com/share?
			text=' . $tweet[0] . '
			&url=' . get_the_permalink() . '
			&via=' . $via . '
		';

		// Apply filters, so that it may be modified.
		$url = apply_filters( 'gutenkit_click_to_tweet_url', $url );

		// Output the block if a URL is generated.
		if ( $tweet ) {

			// Render block content.
			$block = sprintf(
				'<div class="%1$s" style="%2$s">
					<div class="gutenkit--click-to-tweet">
						<span class="gutenkit--click-to-tweet__text gutenkit--header-font" style="%3$s">%4$s</span>
						<a class="gutenkit--click-to-tweet__link" href="%5$s" target="_blank"></a>
						<span class="gutenkit--click-to-tweet__label gutenkit--gray" style="%3$s">Click to Tweet</span>
					</div>
				</div>',
				esc_attr( $class ),
				esc_attr( $text_align ),
				esc_attr( $text_color ),
				esc_html( $tweet[0] ),
				esc_url( $url )
			);

			return $block;

		} else {
			return 'asdfsd' . $attributes['tweet'];
		}
	}

	/**
	 * Enqueue block assets for use within Gutenberg, as well as on the front end.
	 *
	 * @access public
	 */
	public function enqueue_block_assets() {

		// Styles.
		wp_enqueue_style(
			$this->_slug,
			$this->_url . '/block/style.css',
			array( 'wp-blocks' ),
			$this->_version
		);
	}

	/**
	 * Enqueue block assets for use within Gutenberg.
	 *
	 * @access public
	 */
	public function enqueue_block_editor_assets() {

		// Scripts.
		wp_enqueue_script(
			$this->_slug,
			$this->_url . '/block/block.build.js',
			array( 'wp-blocks', 'wp-i18n', 'wp-element' ),
			$this->_version
		);

		// Styles.
		wp_enqueue_style(
			$this->_slug . '-editor',
			$this->_url . '/block/editor.css',
			array( 'wp-edit-blocks' ),
			$this->_version
		);
	}
}

Gutenkit_Lite_Click_To_Tweet_Block::register();
// function render_dummy_block( $attributes, $content ) {
// 		$this->dummy_block_instance_number += 1;
// 		return $this->dummy_block_instance_number . ':' . $attributes['value'] . ":$content";
// 	}
