/**
 * @@pkg.title
 */

import TextareaAutosize from 'react-autosize-textarea';

const { __ } = wp.i18n;
const { Toolbar, PanelBody, PanelColor, Dashicon, IconButton } = wp.components;
const InspectorControls = wp.blocks.InspectorControls;
const { RangeControl, TextControl, ToggleControl, SelectControl } = InspectorControls;

const {
	registerBlockType,
	Editable,
	BlockControls,
	AlignmentToolbar,
	BlockDescription,
	ColorPalette,
	source
} = wp.blocks;

const blockAttributes = {
	via: {
		source: 'meta',
		meta: 'via',
	},
	tweet: {
		source: 'meta',
		meta: 'tweet',
	},
	align: {
		type: 'string',
	},
	color__background: {
		type: 'string',
	},
	color__text: {
		type: 'string',
	},
};

/**
 * Register Block.
 *
 * Registers a new block provided a unique name and an object defining its
 * behavior. Once registered, the block is made available as an option to any
 * editor interface where blocks are implemented.
 *
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType( 'gutenkit/click-to-tweet', {
	title: __( 'Click to Tweet' ),
	description: __( 'Easily create tweetable content for your readers to share.' ),
	icon: 'twitter',
	category: 'formatting',
	keywords: [ __( 'twitter' ), __( 'social' ), __( 'gutenkit' )  ],
	attributes: blockAttributes,
	useOnce: true,

	edit( { className, attributes, setAttributes, focus, setFocus, id } ) {

		const {
			tweet,
			via,
			align,
			color__background,
			color__text
		} = attributes;

		const inspectorControls = focus && (
			<InspectorControls key="inspector">

				<TextControl
					label={ __( 'Twitter Username' ) }
					placeholder='@'
					value={ via }
					onChange={ onChangeVia }
					help={ __( 'Attribute the source of your Tweet with your Twitter username that appears as ”via @username”.' ) }
				/>

				<PanelColor title={ __( 'Background' ) } colorValue={ color__background } initialOpen={ false }>
					<ColorPalette
						value={ color__background }
						onChange={ ( colorValue ) => setAttributes( { color__background: colorValue } ) }
					/>
				</PanelColor>

				<PanelColor title={ __( 'Text' ) } colorValue={ color__text } initialOpen={ false }>
					<ColorPalette
						value={ color__text }
						onChange={ ( colorValue ) => setAttributes( { color__text: colorValue } ) }
					/>
				</PanelColor>

			</InspectorControls>
		);

		function onChangeAlignment( newAlignment ) {
			setAttributes( { align: newAlignment } );
		}

		function onChangeVia( event ) {
			setAttributes( { via: event } );
		}

		return [

			inspectorControls,
			focus && (
				<BlockControls key="controls">
					<AlignmentToolbar
						value={ align }
						onChange={ onChangeAlignment }
					/>
				</BlockControls>
			),

			<div className={ className } style={ { textAlign: align } }>

				<div className={ 'gutenkit--click-to-tweet' } style={ { backgroundColor: color__background } } >

					<TextareaAutosize
						className="gutenkit--click-to-tweet__tweet-text"
						placeholder={ __( 'Enter your Tweet here…' ) }
						value={ tweet }
						style={ { color: color__text } }
						onChange={ ( event ) => setAttributes( { tweet: event.target.value } ) }
					/>

					<span className={ 'gutenkit--click-to-tweet__label gutenkit--gray' } style={ { color: color__text } }>
						{ __( 'Click to Tweet' ) }
					</span>

				</div>

			</div>
		];
	},

	save() {
		return null;
	},
} );
