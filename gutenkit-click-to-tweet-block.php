<?php
/**
 * Plugin Name: Gutenberg Click to Tweet Block by GutenKit
 * Plugin URI: https://gutenkit.com
 * Description: Easily add a click to tweet block into the upcoming Gutenberg editor. <strong>This is a beta release.</strong>
 * Author: @@pkg.author
 * Author URI: https://richtabor.com
 * Version: @@pkg.version
 * Text Domain: @@textdomain
 * Domain Path: languages
 * Requires at least: @@pkg.requires
 * Tested up to: @@pkg.tested_up_to
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
		register_meta( 'post', 'gutenkit_ctt_via', array(
			'show_in_rest' => true,
			'single'       => true,
		) );
		register_meta( 'post', 'gutenkit_ctt_tweet', array(
			'show_in_rest' => true,
			'single'       => true,
		) );
	}

	/**
	 * Renders the `gutenkit/social-sharing` block on server.
	 *
	 * @param array $attributes The block attributes.
	 */
	public function render_block( $attributes ) {

		// Username.
		$via = get_post_meta( get_the_ID(), 'gutenkit_ctt_via', true );
		$via = ( $via ) ? '&via=' . str_replace( '@', '', $via ) : false;

		// Tweet.
		$tweet      = get_post_meta( get_the_ID(), 'gutenkit_ctt_tweet', true );
		$tweet_url  = ( $tweet ) ? rawurlencode( $tweet ) : false;
		$tweet_text = ( $tweet ) ? $tweet : false;

		// Styles.
		$text_align   = is_array( $attributes ) && isset( $attributes['alignText'] ) ? "style=text-align:{$attributes['alignText']}" : false;
		$text_color   = is_array( $attributes ) && isset( $attributes['textColor'] ) ? "style=color:{$attributes['textColor']}" : false;
		$bg_color     = is_array( $attributes ) && isset( $attributes['backgroundColor'] ) ? "style=background-color:{$attributes['backgroundColor']}" : false;
		$border_class = is_array( $attributes ) && isset( $attributes['border'] ) ? 'true' : 'no-border';

		// Block class.
		$class = 'wp-block-gutenkit-click-to-tweet';

		// Twitter Sharing URL.
		$permalink = get_the_permalink();
		$url       = apply_filters( 'gutenkit_click_to_tweet_url', "http://twitter.com/share?&text={$tweet_url}&url={$permalink}{$via}" );

		// Output the block.
		$markup  = '';
		$markup .= sprintf( '<div class="%1$s" %2$s>', esc_attr( $class ), esc_attr( $text_align ) );
		$markup .= sprintf( '<div class="gutenkit--click-to-tweet %1$s" %2$s>', esc_attr( $border_class ), esc_attr( $bg_color ) );
		$markup .= sprintf( '<span class="gutenkit--click-to-tweet__text gutenkit--header-font" %1$s>%2$s</span>', esc_attr( $text_color ), esc_html( $tweet_text ) );
		$markup .= sprintf( '<a class="gutenkit--click-to-tweet__link" target="_blank" href="%1$s"></a>', esc_url( $url ) );
		$markup .= sprintf( '<span class="gutenkit--click-to-tweet__label gutenkit--gray" %1$s>%2$s</span>', esc_attr( $text_color ), esc_html__( 'Click to Tweet', '@@textdomain' ) );
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
			$this->_url . '/block/build/style.css',
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
			$this->_url . '/block/build/index.js',
			array( 'wp-blocks', 'wp-i18n', 'wp-element' ),
			$this->_version
		);

		// Styles.
		wp_enqueue_style(
			$this->_slug . '-editor',
			$this->_url . '/block/build/editor.css',
			array( 'wp-edit-blocks' ),
			$this->_version
		);
	}
}

Gutenkit_Lite_Click_To_Tweet_Block::register();
