

const config = {

	//api: "https://api.podium-network.com",

	// PUT THIS ON THE SERVER
	keys: {
		giphy: "cF21gbHPmGJrxZ8ajPJI7MtGvHxHYI55"
	},

	media: {
		source: "https://media.podium-network.com",
		preload: [
			"icon.png"
		]
	},


	records: {
		reload: 1000 * 10,
		lifetime: 1000 * 60
	},


	validation: {
		delay: 500,
		alias: {
			minLength: 1,
			maxLength: 20,
			chars: /[^A-Z0-9_-]/i
		},
		passphrase: {
			minLength: 7,
			maxLength: 36
		},
		name: {
			maxLength: 50
		},
		about: {
			maxLength: 250
		}
	},


	// style: {

	// 	fonts: {
	// 		body: "Varela",
	// 		titles: "VarelaRound"
	// 	},

	// 	colors: {

	// 		// Greens
	// 		major: "#00AA22",
	// 		majorPale: "#89D494",
	// 		majorPalest: "#F3FBF5",

	// 		// Reds
	// 		minor: "#AA2200",
	// 		minorPale: "#D49489",
	// 		minorPalest: "#FBF5F3",

	// 		// Greys
	// 		neutralPalest: "#F5F5F5",
	// 		neutralPale: "#E9E9E9",
	// 		neutral: "#DDDDDD",
	// 		neutralDark: "#B6B6B6",
	// 		neutralDarkest: "#888888",

	// 		white: "#FEFEFE",
	// 		black: "#010101",

	// 		pod: "#00AA22",
	// 		aud: "#AA0088",

	// 		good: "#0088AA",	// Blue (not green - colour blindness)
	// 		warn: "#DD8800",	// Amber
	// 		bad: "#AA2200",		// Red

	// 		note: "#AA0088",	// Purple
	// 		info: "#0088AA",	// Blue
	// 		other: "#AA8800",	// Tan

	// 	},


	// 	iconSize: {
	// 		small: 14, 			// 0.035
	// 		smallish: 18,		// 0.045
	// 		medium: 22,			// 0.055
	// 		largish: 25,		// 0.065
	// 		large: 32			// 0.075
	// 	},

	// 	size: {
	// 		smallest: 1,
	// 		smaller: 2,
	// 		small: 4,
	// 		smallish: 8,
	// 		normal: 16,
	// 		bigish: 32,
	// 		big: 64,
	// 		bigger: 128,
	// 		biggest: 256
	// 	},

	// 	fontSize: {
	// 		tiny: 10,
	// 		smaller: 12,
	// 		small: 14,
	// 		smallish: 16,
	// 		normal: 18,
	// 		largish: 22,
	// 		large: 26,
	// 		huge: 32,
	// 	},

	// },


	balancing: {
		coefficients: {
			affinity: 2.0,
			integrity: 4.0
		}
	},


	settings: {

		// General
		general: {
			border: 1.0,			// Width of borders (pixels)
			margin: 0.025,			// Margin between components (% of screen width)
			screenPadding: 0.05,	// Space around edges of screen (% of screen width)
			bigIcon: 0.15,			// Size of a large icon (% of screen width)
			shadowOpacity: 0.4,		// Opacity of shadows
			shadowHeight: 0.005,	// Effective elevation of shadowed objects (% of screen width)
		},

		// Fonts
		font: {

			body: "Varela",
			titles: "VarelaRound",
			offset: 0.16,			// % of font size required to vertically center text as bottom margin

			size: {
				tiniest: 0.02,
				tiny: 0.025,
				smallest: 0.03,
				smaller: 0.035,
				small: 0.04,
				normal: 0.045,
				large: 0.05,
				larger: 0.055,
				largest: 0.065,
				huge: 0.075,
			},

		},

		// Colour scheme
		colors: {

			green: "#00AA22",
			lightGreen: "#89D494",
			paleGreen: "#F3FBF5",

			red: "#AA2200",
			lightRed: "#D49489",
			paleRed: "#FBF5F3",

			paleGrey: "#F5F5F5",
			lightGrey: "#E9E9E9",
			grey: "#DDDDDD",
			dimGrey: "#B6B6B6",
			darkGrey: "#888888",

			white: "#FEFEFE",
			black: "#010101",

			purple: "#AA0088",
			blue: "#0088AA",
			amber: "#DD8800",
			tan: "#AA8800",

		},

		// Splash screen
		splash: {
			iconWidth: 0.2,			// Width of loading icon (% of screen width)
			spinElasticity: 14,		// Bounciness of spin animation
		},

		// Core layout
		core: {
			drawerWidth: 0.9,		// Width of left/right nav drawers (% of screen width)
			footerHeight: 0.17,		// Height of navigation footer (% of screen width)
			headerHeight: 0.12,		// Height of page headers and search input (% of screen width)
			icons: {
				small: 1.0,
				medium: 1.3,
				large: 1.6,
			}
		},

		// Timings
		timing: {
			typingInterval: 400,	// Delay between last keystroke and scheduled tasks (validation, search, etc...)
			keyboardDelay: 25,		// Delay before resizing screen to keyboard to prevent jittering on focus changes (ms)
			transition: 500,		// Delay before navigating between screens (ms)
			move: 300,				// Duration of movement/resize animations (ms)
			pause: 500,				// Duration of pause between animation cycles (ms)
			spin: 6000,				// Spin duration for loading icon (ms)
			fade: 300,				// Fade in/out of fader elements (ms)
			reset: 200,				// Duration of animation reseting element position, etc... on cancel (ms)
			submit: 3000,			// Pause before auto-submit of (e.g.) reactions (ms)
			submitWarning: 1000,	// Pause before warning of auto-submit appears (ms)
			highlight: 3000,		// Duration to highlight new/contextual information (ms)
		},

		// Pan Responder
		swipe: {
			threshold: 5,			// Number of pixels moved before pan locks the screen
			xLimit: 0.2,			// Scroll limit (% of screen width) before auto-pan moves to next stable point upon release
			vLimit: 0.5,			// Velocity limit before auto-pan moves to next stable point upon release
			bounce: 7,				// Bounciness of auto-pan animation
			overScroll: 0.6,		// Decay factor for pan when scrolling outside of screen bounds
			deadZone: 10,			// Boundary on edges of pannable object where pan will be ignored (pixels)
		},

		// Inputs
		inputs: {
			singleHeight: 0.16,		// Height of single line inputs (% of screen width)
			multiHeight: 0.48,		// Height of multi-line inputs (% of screen width)
			checkbox: {
				size: 0.05,			// Size of checkbox (% of screen width)
				icon: 0.95,			// Size of check icon (% of box size)
			},
		},

		// Media
		media: {
			avatar: {
				corner: 0.38,		// Border radius of images with 1 corner rounded (% of image width)
			},
		},

		// Buttons
		button: {
			normal: 0.08,			// Size of standard square HUD button (% of screen width)
			large: 0.12,			// Size of large HUD button (% of screen width)
			icon: 0.048,			// Size of icon in standard square HUD buton (% of screen width)
		},

		// Tasks
		tasks: {
			max: 3,					// Maximum number of tasks that can be displayed at the same time
			exitTime: 1500,			// Interval between task completion and removal from HUD
			lifetime: 4000,			// Minimum amount of time to display each task, even if it completes sooner (ms)
		},

		// Lobby
		lobby: {
			navigationDelay: 4000,	// Delay before showing signin/register buttons in lobby (ms)
			footerHeight: 0.15,		// Padding to bottom of lobby to raise center of screen (% of screen height)
		},

		// Menu
		menu: {
			headerHeight: 0.36,		// Height of the header (profile) section of the menu (% of screen width)
			buttonSpacing: 0.14,	// Spacing between buttons (% of screen width)
		},

		// Search
		search: {
			inputHeight: 0.1,		// Size of search input box (% of screen width)
			iconSize: 0.04,			// Size of icons in quicksearch input (% of screen width)
		},

		feed: {
			loadingIcon: 0.1,		// Size of the loading icon (% of screen width)
			backgroundIcon: 0.12,	// Size of the background icon on notices (% of screen width)
			backgroundOpacity: 0.3,	// Opacity of objects in the feed background
		},

		// Posts
		post: {
			wingInset: 0.15,		// Background visible at edge of swiped post (% of screen width)
			headerHeight: 0.06,		// Height of post header - name, @identity, etc.. (% of screen width)
			mediaAspectRatio: 0.5625,	// Default aspect ratio (vs post width) of a single item of media
			thumbnailCount: 2.8,		// Number of thumbnails to fit across a post before scrolling
			popularitySize: 0.6,		// Width of popularity chart (% of post content width)
		},

		// Link Previews
		link: {
			imageHeight: 0.36,		// Height of image in link preview (% of screen width)
			bodyHeight: 0.14,		// Height of body in link preview (% of screen width)
			corners: 0,				// Rounding radius of corners (% of link body height)
		},

		// Post Creation
		compose: {
			referenceHeight: 0.1,	// Height of a post creation reference validator (% of screen width)
			footerHeight: 0.1,		// Height of post creation footer above keyboard (% of screen width)
		},

	},

	regex: {

		// Regex for matching references (e.g. {link:0} in post strings)
		reference: /(?:\{\w+\:\d+\})/gi,

		// Regex for matching @, #, or \ tags
		tag: /[@#\/][a-z0-9_-]+[a-z0-9_-]*?(?=\W|$)/gi,

		// Regex for matching urls
		url: /(?:http[s]*:\/\/)?(?:www\.)?(?!ww*\.)[a-z][a-z0-9.\-/]*\.[a-z]{2}(?:[^\s]*[a-z0-9/]|(?=\W))/gi
	
	}

}


export default config;