/**
 * @@pkg.title
 */

const { __ } = wp.i18n;
const { Toolbar, PanelBody, PanelColor, Dashicon, IconButton } = wp.components;
const InspectorControls = wp.blocks.InspectorControls;
const { RangeControl, ToggleControl, SelectControl } = InspectorControls;

const {
	registerBlockType,
	Editable,
	BlockControls,
	AlignmentToolbar,
	BlockDescription,
	ColorPalette,
	source
} = wp.blocks;

// const blockAttributes = {
// 	via: {
// 		type: 'array',
// 		source: 'children',
// 		selector: 'cite',
// 	},
// 	tweet: {
// 		type: 'array',
// 		source: 'children',
// 		selector: '.gutenkit--click-to-tweet__text',
// 	},
// 	align: {
// 		type: 'string',
// 		default: 'left',
// 	},
// 	color__background: {
// 		type: 'string',
// 	},
// 	color__text: {
// 		type: 'string',
// 	},
// };

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
	// attributes: blockAttributes,

	edit( { attributes, setAttributes, focus, setFocus, className } ) {

		const {
			tweet,
			cite,
			align,
			color__background,
			color__text
		} = attributes;

		const inspectorControls = focus && (
			<InspectorControls key="inspector">

				<BlockDescription>
					<p>{ __( 'Add a click to tweet element.' ) }</p>
				</BlockDescription>

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

		function onChangeTweet( newTweet ) {
			setAttributes( { tweet: newTweet } );
		}

		function onChangeCite( newCite ) {
			setAttributes( { cite: newCite } );
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

					<Editable
						tagName="span"
						value={ tweet }
						placeholder={ __( 'Add your tweet text...' ) }
						className={ 'gutenkit--click-to-tweet__text' }
						onChange={ onChangeTweet }
						style={ { color: color__text } }
						focus={ focus && focus.editable === 'tweet' ? focus : null }
						onFocus={ ( props ) => setFocus( { props, editable: 'tweet' } ) }
						// formattingControls={ [] }
					/>

					{ ( !! focus ) && (

						<Editable
							tagName="cite"
							multiline="false"
							value={ cite }
							placeholder={ __( '@username' ) }
							className={ 'gutenkit--click-to-tweet__via' }
							style={ { color: color__text } }
							onChange={ onChangeCite }
							focus={ focus && focus.editable === 'cite' ? focus : null }
							onFocus={ ( props ) => setFocus( { props, editable: 'cite' } ) }
							// formattingControls={ [] }
						/>
					) }

				</div>

			</div>
		];
	},

	save( { attributes, className } ) {

		const { tweet, cite, align, color__background, color__text } = attributes;

		return (

			<div className={ className } style={ { textAlign: align } }>
				<div className={ 'gutenkit--click-to-tweet' } style={ { backgroundColor: color__background } } >
					<span className={ 'gutenkit--click-to-tweet__text gutenkit--header-font' } style={ { color: color__text } } >{ tweet }</span>
					<cite className={ 'gutenkit--click-to-tweet__via gutenkit--gray' } style={ { color: color__text } } >{ cite }</cite>
				</div>
			</div>
		);
	},
} );
