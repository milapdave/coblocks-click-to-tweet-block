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
		add_action( 'init', array( $this, 'register_block' ) );
		add_action( 'init', array( $this, 'register_meta' ) );
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

		register_block_type( 'gutenkit/click-to-tweet', array(
			'render_callback' => array( $this, 'render_block' ),
		) );
	}

	/**
	 * Register the block's meta.
	 *
	 * @access public
	 */
	public function register_meta() {
		register_meta( 'post', 'cite', array(
			'show_in_rest' => true,
			'single'       => false,
		) );
	}

	/**
	 * Renders the `gutenkit/social-sharing` block on server.
	 *
	 * @param array $attributes The block attributes.
	 */
	public function render_block( $attributes ) {

		$via        = get_post_meta( get_the_ID(), 'cite', true );
		$tweet      = is_array( $attributes ) && isset( $attributes['tweet'] ) ? $attributes['tweet'] : false;
		$text_align = is_array( $attributes ) && isset( $attributes['align'] ) ? "text-align:{$attributes['align']}" : false;
		$text_color = is_array( $attributes ) && isset( $attributes['color__text'] ) ? "color:{$attributes['color__text']}" : false;
		$bg_color   = is_array( $attributes ) && isset( $attributes['color__background'] ) ? "background-color:{$attributes['color__background']}" : false;

		// Block class.
		$class = 'wp-block-gutenkit-click-to-tweet';

		// Twitter Sharing URL.
		$url = '
			http://twitter.com/share?
			&text=' . $tweet[0] . '
			&url=' . esc_url( get_the_permalink() ) . '
			&via=' . $via . '
		';

		// Apply filters, so that it may be modified.
		$url = apply_filters( 'gutenkit_click_to_tweet_url', $url );

		// Output the block.
		$markup  = '';
		$markup .= sprintf( '<div class="%1$s" style="%2$s">', esc_attr( $class ), esc_attr( $text_align ) );
		$markup .= sprintf( '<div class="gutenkit--click-to-tweet" style="%1$s">', esc_attr( $bg_color ) );
		$markup .= sprintf( '<h4 class="gutenkit--click-to-tweet__text gutenkit--header-font" style="%1$s">%2$s</h4>', esc_attr( $text_color ), esc_html( $tweet[0] ) );
		$markup .= sprintf( '<a class="gutenkit--click-to-tweet__link" target="_blank" href="%1$s"></a>', esc_url( $url ) );
		$markup .= sprintf( '<span class="gutenkit--click-to-tweet__label gutenkit--gray" style="%1$s">Click to Tweet</span>', esc_attr( $text_color ) );
		$markup .= sprintf( '</div>' );
		$markup .= sprintf( '</div>' );

		return $markup;

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
