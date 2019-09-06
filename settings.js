const settings = {

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

		drawerSize: 0.9,		// Width of left/right nav drawers (% of screen)
		headerSize: 0.08,		// Height of navigation header (% of screen)
		border: 2.0,			// Width of borders between layout segments (pixels)

		panStart: 5,			// Number of pixels moved before pan locks the screen
		xLimit: 0.25,			// Scroll limit (% of screen width) before auto-pan moves to next stable point upon release
		vLimit: 0.5,			// Velocity limit before auto-pan moves to next stable point upon release
		panBounce: 6,			// Bounciness of auto-pan animation
		overScroll: 0.7,		// Decay factor for pan when scrolling outside of screen bounds
		deadZone: 10,			// Boundary on edges of pannable object where pan will be ignored (pixels)

		corner: 0.3,			// Border radius of images with 1 corner rounded (% of width)

		postHeight: 0.17,		// Minimum height of a post (% of screen height)
		postHeader: 0.05,		// Height of post header - name, @identity, etc.. (% of screen height)
		postReactor: 0.3,		// Width of reactor element in post header (% of screen width)
		postMargin: 0.02,		// Padding around edge of post (% of screen width)
		postWing: 0.9,			// Width of post wings outside left/right side of screen (% of screen)
		postWingOverlap: 0.18	// Overlap of post wings with post core content (% of screen)

	},

	regex: {

		// Regex for matching a @, #, or \ tag
		tag: /[@#\/][a-z0-9_-]+[a-z0-9_-]*?(?=\W|$)/gi,

		// Regex for matching a url
		url: /(?:http[s]*:\/\/)?(?:www\.)?(?!ww*\.)[a-z][a-z0-9.\-/]*\.[a-z]{2}(?:[^\s]*[a-z0-9/]|(?=\W))/gi
	
	}

}

export default settings;