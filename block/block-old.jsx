/**
 * @@pkg.title
 */

const { __ } = wp.i18n;
const { Toolbar, withAPIData, PanelBody, PanelColor, Dashicon, IconButton } = wp.components;
const InspectorControls = wp.blocks.InspectorControls;
const { RangeControl, ToggleControl, SelectControl } = InspectorControls;
const { Component } = wp.element;
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
	cite: {
		type: 'string',
		source: 'text',
		selector: 'cite',
	},
	tweet: {
		type: 'array',
		source: 'children',
		selector: 'span',
	},
	url: {
		type: 'string',
		// source: 'attribute',
		// attribute: 'src',
	},
	align: {
		type: 'string',
		default: 'left',
	},
	color__background: {
		type: 'string',
	},
	color__text: {
		type: 'string',
	},
};



class ClickToTweet extends Component {

	// componentDidMount() {
	// 	const { attributes, setAttributes } = this.props;
	// 	const { id, url = '' } = attributes;

	// 	if ( ! id && url.indexOf( 'blob:' ) === 0 ) {
	// 		getBlobByURL( url )
	// 			.then( createMediaFromFile )
	// 			.then( ( media ) => {
	// 				setAttributes( {
	// 					id: media.id,
	// 					url: media.source_url,
	// 				} );
	// 			} );
	// 	}
	// }

	// componentWillReceiveProps( { post } ) {
	// 	if ( post && post.data ) {
	// 		this.props.setAttributes( {
	// 			url: post.data.title.rendered,
	// 		} );
	// 	}
	// }

	// componentDidMount( { post } ) {
	// 	if ( post && post.data ) {
	// 		this.props.setAttributes( {
	// 			url: post.data.title.rendered,
	// 		} );
	// 	}
	// }

	// componentDidMount() {
	// 	const { attributes, setAttributes } = this.props;
	// 	const { url = '' } = attributes;

	// 	if ( post && post.data ) {
	// 		this.props.setAttributes( {
	// 			url: post.data.title.rendered,
	// 		} );
	// 	}

	// 	// if ( post && post.data && ! this.props.url ) {
	// 	// 	this.props.setAttributes( {
	// 	// 		link: post.data.link,
	// 	// 	} );
	// 	// }
	// }

	// componentDidUpdate( prevProps ) {
	// 	const { url: prevUrl = '' } = prevProps.attributes;
	// 	const { url = '' } = this.props.attributes;
	// }

	render() {
		// const latestPosts = this.props.latestPosts.data;

		const { attributes, setAttributes, focus, setFocus, className, posts } = this.props;
		const { tweet, cite, align, color__background, color__text, url } = attributes;


		if ( ! posts.data ) {
	            return "loading !";
	        }

	        if ( posts.data.length === 0 ) {
	            return "No posts";
	        }

	        var post = posts.data[ 0 ];


		// const categories = this.props.post.data;

		function onChangeAlignment( newAlignment ) {
			setAttributes( { align: newAlignment } );
		}

		function onChangeTweet( newTweet ) {
			setAttributes( { tweet: newTweet } );
		}

		function onChangeCite( newCite ) {
			setAttributes( { cite: newCite } );
		}

		return (
			<div className={ className } style={ { textAlign: align } }>
				{ post.link }

				{ url }
				{ post.data.title.rendered }

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
						formattingControls={ [] }
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
							formattingControls={ [] }
							keepPlaceholderOnFocus
						/>
					) }



				</div>

			</div>
		);
	}
}

// export default withAPIData( ( { id } ) => ( {
// 	posts: '/wp/v2/posts?per_page=1'
// } ) )( ClickToTweet );


// export default withAPIData( ( { props } ) => ( {
// 	post: id ? `/wp/v2/posts/${ id }` : 'asdfads',
// } ) )( ClickToTweet );

// export default withAPIData( ( props ) => {
// 	post: `/wp/v2/post/${ props.postId }`
// } )( ClickToTweet );

// export default withAPIData( () => {
// 	return {
// 		categories: '/wp/v2/categories',
// 	};
// } )( ClickToTweet );

export default withAPIData( ( props ) => ( {
	// post: `/wp/v2/${ type( 'post' ) }/${ props.postId }`
	posts: '/wp/v2/posts?per_page=1'
} ) )( ClickToTweet );

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
	edit: ClickToTweet,

	save( { attributes, className } ) {

		const { tweet, cite, align, color__background, color__text, url } = attributes;

		return (

			<div className={ className } style={ { textAlign: align } }>
				<div className={ 'gutenkit--click-to-tweet' } style={ { backgroundColor: color__background } } >
					<span className={ 'gutenkit--click-to-tweet__text gutenkit--header-font' } style={ { color: color__text } } >{ tweet }</span>
					{ url }
				</div>
			</div>

			// { link }
		);
	},
} );
