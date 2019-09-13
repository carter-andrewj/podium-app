const settings = {

	server: {
		local: true,
		url: "http://ec2-184-72-129-237.compute-1.amazonaws.com/"
	},

	fonts: {
		body: "Varela",
		titles: "VarelaRound"
	},

	colors: {

		// Greens
		major: "#00AA22",
		majorPale: "#89D494",
		majorPalest: "#F3FBF5",

		// Reds
		minor: "#AA2200",
		minorPale: "#D49489",
		minorPalest: "#FBF5F3",

		// Greys
		neutralPalest: "#F5F5F5",
		neutralPale: "#E9E9E9",
		neutral: "#DDDDDD",
		neutralDark: "#B6B6B6",
		neutralDarkest: "#888888",

		white: "#FEFEFE",
		black: "#010101",

		good: "#00AA22",	// Green
		bad: "#AA2200",		// Red

		note: "#AA0088",	// Purple
		info: "#0088AA",	// Blue
		other: "#AA8800",	// Tan
		warn: "#DD8800",	// Amber

	},

	iconSize: {
		small: 14,
		smallish: 18,
		medium: 22,
		largish: 28,
		large: 32
	},

	size: {
		smallest: 1,
		smaller: 2,
		small: 4,
		smallish: 8,
		normal: 16,
		bigish: 32,
		big: 64,
		bigger: 128,
		biggest: 256
	},

	fontsize: {
		tiny: 10,
		smaller: 12,
		small: 14,
		smallish: 16,
		normal: 18,
		largish: 22,
		large: 26,
		huge: 32,
	},

	layout: {

		// Core layout
		drawerSize: 0.9,		// Width of left/right nav drawers (% of screen width)
		headerSize: 0.08,		// Height of navigation header (% of screen height)
		footerSize: 0.06,		// Height of footers (% of screen height)
		border: 2.0,			// Width of borders between layout segments (pixels)
		margin: 0.02,			// Margin used on core nav components (% of screen width)

		// Pan Responder
		panStart: 5,			// Number of pixels moved before pan locks the screen
		xLimit: 0.25,			// Scroll limit (% of screen width) before auto-pan moves to next stable point upon release
		vLimit: 0.5,			// Velocity limit before auto-pan moves to next stable point upon release
		panBounce: 6,			// Bounciness of auto-pan animation
		overScroll: 0.7,		// Decay factor for pan when scrolling outside of screen bounds
		deadZone: 10,			// Boundary on edges of pannable object where pan will be ignored (pixels)

		// General
		corner: 0.38,			// Border radius of images with 1 corner rounded (% of image width)
		button: 0.07,			// Size of standard square HUD button (% of screen width)
		buttonIcon: 0.045,		// Size of icon in standard square HUD buton (% of screen width)
		spinTime: 800,			// Spin duration for loading icon (ms)

		// Quick Profile
		quickProfile: 0.12,		// Minimum size of quick profile element in left drawer (% of screen height)
		quickProfileCap: 0.4,	// Maximum size of quick profile element in left drawer (% of screen height)
		quickProfileName: 0.06,	// Height of name element in quick profile (% of screen height)

		// Quick Search
		quickSearchIcon: 15,	// Size of icons in quicksearch input (pixels)

		// Posts
		postHeight: 0.15,		// Minimum height of a post (% of screen height)
		postHeader: 0.03,		// Height of post header - name, @identity, etc.. (% of screen height)
		postReactor: 0.3,		// Width of reactor element in post header (% of screen width)
		postWing: 0.85,			// Width of post wings outside left/right side of screen (% of screen width)
		postWingOverlap: 0.18	// Overlap of post wings with post core content (% of screen width)

	},

	regex: {

		// Regex for matching @, #, or \ tags
		tag: /[@#\/][a-z0-9_-]+[a-z0-9_-]*?(?=\W|$)/gi,

		// Regex for matching urls
		url: /(?:http[s]*:\/\/)?(?:www\.)?(?!ww*\.)[a-z][a-z0-9.\-/]*\.[a-z]{2}(?:[^\s]*[a-z0-9/]|(?=\W))/gi
	
	}

}

export default settings;