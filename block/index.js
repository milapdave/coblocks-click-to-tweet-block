/**
 * @@pkg.title
 */

import TextareaAutosize from 'react-autosize-textarea';

const { __ } = wp.i18n;
const { Component } = wp.element;
const { Toolbar, PanelColor, withFallbackStyles } = wp.components;
const InspectorControls = wp.blocks.InspectorControls;
const { TextControl } = InspectorControls;

const {
	registerBlockType,
	Editable,
	BlockControls,
	AlignmentToolbar,
	BlockDescription,
	ColorPalette,
	ContrastChecker,
	source
} = wp.blocks;

const { getComputedStyle } = window;

const ContrastCheckerWithFallbackStyles = withFallbackStyles( ( node, ownProps ) => {
	const { textColor, backgroundColor } = ownProps;
	//avoid the use of querySelector if textColor color is known and verify if node is available.
	const textNode = ! textColor && node ? node.querySelector( '[contenteditable="true"]' ) : null;
	return {
		fallbackBackgroundColor: backgroundColor || ! node ? undefined : getComputedStyle( node ).backgroundColor,
		fallbackTextColor: textColor || ! textNode ? undefined : getComputedStyle( textNode ).color,
	};
} )( ContrastChecker );

/**
 * Internal dependencies
 */
import './editor.scss';
import './style.scss';

class GutenKitClickToTweet extends Component {

	constructor() {
		super( ...arguments );
		this.nodeRef = null;
		this.bindRef = this.bindRef.bind( this );
		this.updateAlignment = this.updateAlignment.bind( this );
		this.updateVia = this.updateVia.bind( this );
	}

	updateAlignment( nextAlign ) {
		this.props.setAttributes( { align: nextAlign } );
	}

	updateVia( nextVia ) {
		this.props.setAttributes( { via: nextVia } );
	}

	bindRef( node ) {
		if ( ! node ) {
			return;
		}
		this.nodeRef = node;
	}

	render() {

		const {
			attributes,
			setAttributes,
			focus,
			setFocus,
			className,
		} = this.props;

		const {
			tweet,
			via,
			align,
			backgroundColor,
			textColor,
		} = attributes;

		const at_icon = [
			<svg
			aria-hidden
			role="img"
			focusable="false"
			className="dashicon"
			xmlns="http://www.w3.org/2000/svg"
			width="20"
			height="20"
			viewBox="0 0 20 20"
			>
			<g id="Symbols" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
			        <g id="3-columns-copy-3" fill="currentColor" fill-rule="nonzero">
			            <g id="noun_984574" transform="translate(2.000000, 2.000000)">
			                <path d="M8.02520581,0 L7.98776317,0 C5.86277332,-2.33459646e-05 3.82535953,0.846680002 2.32628237,2.35278409 C0.827205206,3.85888818 -0.00996089005,5.90023931 8.13151629e-20,8.02520581 C0.0199694079,12.4084909 3.69683664,15.9755263 8.19494578,15.9755263 L8.48699837,15.9755263 C9.03843834,15.9755263 9.48546877,15.5284959 9.48546877,14.9770559 C9.48546877,14.425616 9.03843834,13.9785856 8.48699837,13.9785856 L8.19494578,13.9785856 C4.7926579,13.9785856 2.01191785,11.3026849 1.99694079,8.01522111 C1.98963664,6.42160411 2.61758479,4.89075151 3.74187457,3.76130874 C4.86616435,2.63186597 6.39412944,1.99692405 7.98776317,1.99694079 L8.01522111,1.99694079 C11.3026849,2.01191785 13.9785856,4.7926579 13.9785856,8.19494578 L13.9785856,10.4839392 C13.9785856,11.0353791 13.5315551,11.4824096 12.9801152,11.4824096 C12.4286752,11.4824096 11.9816448,11.0353791 11.9816448,10.4839392 L11.9816448,7.98776317 C11.9878239,6.15815454 10.7537205,4.55679866 8.98291101,4.09664686 C7.21210152,3.63649505 5.35452376,4.43446543 4.46920407,6.03562594 C3.58388438,7.63678645 3.89577006,9.63430471 5.22705151,10.8893727 C6.55833296,12.1444407 8.57075026,12.3381632 10.1170013,11.3600969 C10.5524576,12.776278 11.9578409,13.6613354 13.4231625,13.4421927 C14.8884842,13.22305 15.9734432,11.9655554 15.9755263,10.4839392 L15.9755263,8.19494578 C15.9755263,3.69683664 12.4084909,0.0199694079 8.02520581,0 Z M7.98776317,9.98470397 C6.88488323,9.98470397 5.99082238,9.09064312 5.99082238,7.98776317 C5.99082238,6.88488323 6.88488323,5.99082238 7.98776317,5.99082238 C9.09064312,5.99082238 9.98470397,6.88488323 9.98470397,7.98776317 C9.98470397,9.09064312 9.09064312,9.98470397 7.98776317,9.98470397 Z" id="Shape"></path>
			            </g>
			        </g>
			    </g>
			</svg>
		]

		const inspectorControls = focus && (
			<InspectorControls key="inspector">
				<TextControl
					label={ __( 'Twitter Username' ) }
					placeholder='@'
					value={ via }
					onChange={ this.updateVia }
					help={ __( 'Attribute the source of your Tweet with your Twitter username that appears as ”via @username”.' ) }
				/>
				<PanelColor title={ __( 'Background' ) } colorValue={ backgroundColor } initialOpen={ false }>
					<ColorPalette
						value={ backgroundColor }
						onChange={ ( colorValue ) => setAttributes( { backgroundColor: colorValue } ) }
					/>
				</PanelColor>
				<PanelColor title={ __( 'Text' ) } colorValue={ textColor } initialOpen={ false }>
					<ColorPalette
						value={ textColor }
						onChange={ ( colorValue ) => setAttributes( { textColor: colorValue } ) }
					/>
				</PanelColor>

			</InspectorControls>
		);

		const controls = focus && (
			<BlockControls key="controls">
				<AlignmentToolbar
					value={ align }
					onChange={ this.updateAlignment }
				/>
				<Toolbar>
					<label htmlFor={ 'gutenkit--click-to-tweet__tweet-via' } aria-label={ __( 'Twitter Username' ) }>
						{ at_icon }
					</label>
					<input
						id={ 'gutenkit--click-to-tweet__tweet-via' }
						type="text"
						placeholder={ __( 'Username' ) }
						aria-label={ __( 'Twitter Username' ) }
						className="gutenkit--click-to-tweet__tweet-via"
						value={ via }
						onChange={ ( event ) => setAttributes( { via: event.target.value } ) }
					/>
				</Toolbar>
			</BlockControls>
		);

		return [
			controls,
			inspectorControls,
			<div className={ className } style={ { textAlign: align } }>

				<div className={ 'gutenkit--click-to-tweet' } style={ { backgroundColor: backgroundColor } }>

					<TextareaAutosize
						className="gutenkit--click-to-tweet__tweet-text"
						placeholder={ __( 'Enter your Tweet here…' ) }
						value={ tweet }
						style={ { color: textColor } }
						onChange={ ( event ) => setAttributes( { tweet: event.target.value } ) }
					/>

					<span className={ 'gutenkit--click-to-tweet__label gutenkit--gray' } style={ { color: textColor } }>
						{ __( 'Click to Tweet' ) }
					</span>

				</div>

			</div>
		];

	}

}

const blockAttributes = {
	via: {
		source: 'meta',
		meta: 'gutenkit_ctt_via',
	},
	tweet: {
		source: 'meta',
		meta: 'gutenkit_ctt_tweet',
	},
	align: {
		type: 'string',
	},
	backgroundColor: {
		type: 'string',
	},
	textColor: {
		type: 'string',
	},
};

registerBlockType( 'gutenkit/click-to-tweet', {

	title: __( 'Click to Tweet' ),

	description: __( 'Easily create tweetable content for your readers to share.' ),

	icon: 'twitter',

	category: 'formatting',

	keywords: [ __( 'twitter' ), __( 'social' ), __( 'gutenkit' )  ],

	attributes: blockAttributes,

	useOnce: true,

	edit: GutenKitClickToTweet,

	save() {
		return null;
	},
} );
