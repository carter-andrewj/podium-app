# Podium

The Podium App, client to the [Podium App Server](https://github.com/carter-andrewj/podium-admin-server "Server Repo").


## Setup

Podium is built in [React Native](https://facebook.github.io/react-native/ "React Native") using the [Expo](https://expo.io/ "Expo") engine and [MobX](https://mobx.js.org/README.html "MobX") for state management. You will need [Node](https://nodejs.org/en/ "Node.js") and [NPM](https://www.npmjs.com/ "Node Package Manager") installed to run the app.

After cloning the repo, install package dependencies via:

   ```shell
   npm install
   ```


## Simulators

Podium is not currently optimized for web deployment. To run the app, you will need either an iOS or Android simulator - details their installation / operation with Expo can be found here: [iOS](https://docs.expo.io/versions/v36.0.0/workflow/ios-simulator/#__next "iOS Simulator"), [Android](https://docs.expo.io/versions/v36.0.0/workflow/android-studio-emulator/ "Android Emulator").

As the simulator with the simplest setup and the platform for which most development has been directed/optimised (so far), we recommend iOS.


## Launch

To start the Expo app development server, run:

   ```shell
   npm start
   ```

And then, once the server is running, press either `i` (for iOS) or `a` (for Android) to launch the app in the corresponding simulator.

Or, to start directly with a simulator, run either of:

   ```shell
   npm start --ios
   ```

   ```shell
   npm start --android
   ```

*Note: once launched, Expo will reload the app if any files change. The generic `npm start` command resets the Expo cache at startup, but the `--ios` and `--android` commands do not.*

*Note: Various other packages and related modules have their own caches which can also need clearing. If the app begins acting oddly/inconsistently, run `npm run master-reset` to return everything to initial conditions. It is also recommended to hard-reset the simulated device in these circumstances as well.*

Once running, you can force a refresh by pressing `CMD-R` (on Mac) or open the Expo tools window (including the element inspector) with `CMD-D`.


## Server

By default, the development app looks for a local development server running on Port 3000 (the default specified in all **Nation** templates). If it does not find one, it will wait on the loading screen.

*Note: the app does not currently refresh when the server appears, so you may need to refresh it manually (`CMD-R`).*

To point the app at a remote server, specify the server's URL as the `api` key in `state/config.js`.

*Note: `config.js` controls many of the app's settings, but most of these will ultimately be moved to the server and will be provided to the app on startup.*

With a remote server, anyone can test the app on their local device by installing the Expo app on that device and opening either a link or QR code you can generate on your local machine.



## Codebase

*Note: there are currently various "old" areas of the codebase being kept around for reference (or, in some cases, just because tidying them up is low-priority). These are either directly marked (with either the file or its containing folder named "old") or have the comment `// DEPRECIATED //` at the start of the file.*

The app codebase is divided into 4 sections:

### Components

Generic components used throughout the app.

Includes a custom `Navigator` component for managing page transitions, back buttons, etc...

### Pages

Unique components comprising the overall flow/structure of the app.

### State

Management of app state and interface with the server. Also manages component styles.

### Utils

Generic functions used throughout the codebase.

Includes a custom `Animator` class which can be used to synchronise several separate animated components without requiring a global animator or precise management of state changes across components.