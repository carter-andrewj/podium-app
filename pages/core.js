import React from 'react';
import { View, Text, Animated, Easing } from 'react-native';
import { computed } from 'mobx';
import { inject, observer } from 'mobx-react';

import Animator from '../utils/animator';

import Navigator from '../components/navigator';
import Page from '../components/page';
import Screen from '../components/screen';
import TaskBar from '../components/tasks/taskBar';

import Menu from './drawers/menu/menu';
import Alerts from './drawers/alerts/alerts';
import Nation from './drawers/nation/nation';
import Search from './drawers/search/search';

import Feed from './posts/feed';
import Compose from './posts/compose';
import PostPage from './posts/postPage';

import ProfilePage from './profiles/profilePage';
import WalletPage from './profiles/walletPage';
import FollowersPage from './profiles/followersPage';
import FollowingPage from './profiles/followingPage';
import IntegrityPage from './profiles/integrityPage';

import HelpPage from './help/helpPage';
import SettingsPage from './settings/settingsPage';

import Button from '../components/buttons/button';





@inject("store")
@observer
export default class Core extends Page {



	constructor() {

		// State
		super({ open: null })

		// Utilities
		this.drawers = {}
		this.animator = new Animator().configure("spring")

		// Methods
		this.control = this.control.bind(this)
		this.toggle = this.toggle.bind(this)

		// Navigation
		this.pages = {

			Feed: { Page: Feed },
			Compose: { Page: Compose },
			Post: { Page: PostPage },

			Profile: { Page: ProfilePage },
			Wallet: { Page: WalletPage },
			Followers: { Page: FollowersPage },
			Following: { Page: FollowingPage },
			Integrity: { Page: IntegrityPage },

			Help: { Page: HelpPage },
			Settings: { Page: SettingsPage },

		}

	}


// LIFECYCLE

	componentDidUpdate() {
		this.animator.play()
	}




// DRAWER CONTROLS

	get open() {
		return this.getState("open")
	}

	control(id) {
		return controls => {
			this.drawers[id] = { id, ...controls }
		}
	}

	get openDrawer() {

		// Get open drawers
		let open = Object
			.values(this.drawers)
			.filter(d => d.isOpen())

		// Return draw, if open, otherwise null
		return (open.length > 0) ?
			open[0] :
			{ close: () => null }

	}

	toggle(id) {

		// Check if a draw is already open
		let current = this.openDrawer

		// Close current drawer
		if (current) current.close()

		// Open new drawer
		if (!current || current.id !== id) this.drawers[id].open()

		// Play animation
		this.animator.play()

	}



// NAVIGATION

	@computed
	get current() {
		let route = this.store.navigation.routes.get("core")
		if (!route || !route.get("current")) return undefined
		return route.get("current")[1]
	}


	get navigatePage() {
		return {
			to: (to, props) => {
				this.openDrawer.close()
				this.navigator.navigate(to, props)
			},
			back: (depth = 1) => {
				this.openDrawer.close()
				this.navigator.back(depth)
			},
			home: () => {
				this.openDrawer.close()
				this.navigator.reset()
			},
		}
	}



// RENDER

	get footer() {
		return <View style={this.style.core.footer}>

			<Button
				containerStyle={this.style.core.navigationButton}
				onPress={() => this.toggle("menu")}
				icon="user"
				iconSize={this.layout.core.footer.icons.small}
			/>

			<Button
				containerStyle={this.style.core.navigationButton}
				onPress={() => this.toggle("alerts")}
				icon="bell"
				iconSize={this.layout.core.footer.icons.medium}
			/>

			{this.current === "Feed" ?
				<Button
					containerStyle={this.style.core.navigationButton}
					onPress={() => this.navigatePage.to("Compose")}
					icon="comment-dots"
					iconSize={this.layout.core.footer.icons.large}
				/>
				:
				<Button
					containerStyle={this.style.core.navigationButton}
					onPress={() => this.navigatePage.home()}
					icon="comments"
					iconSize={this.layout.core.footer.icons.large}
				/>
			}

			<Button
				containerStyle={this.style.core.navigationButton}
				onPress={() => this.toggle("nation")}
				icon="globe"
				iconSize={this.layout.core.footer.icons.medium}
			/>

			<Button
				containerStyle={this.style.core.navigationButton}
				onPress={() => this.toggle("search")}
				icon="search"
				iconSize={this.layout.core.footer.icons.small}
			/>

		</View>
	}



	render() {

		return <Screen
			offsetBottom={this.layout.core.footer.height}
			footer={this.footer}>

			<View style={this.style.core.body}>

				<View style={this.style.core.content}>
					<Navigator
						name="core"
						pages={this.pages}
						controller={controls => this.navigator = controls}
						startingPage="Feed"
					/>
					<View
						pointerEvents="box-none"
						style={this.style.core.overlay}>
						<TaskBar />
					</View>
				</View>

				<Menu
					animator={this.animator}
					open={this.open === "menu"}
					controller={this.control("menu")}
					navigate={this.navigatePage}
					signOut={this.props.signOut}
				/>

				<Alerts
					animator={this.animator}
					open={this.open === "alerts"}
					controller={this.control("alerts")}
					navigate={this.navigatePage}
				/>

				<Nation
					animator={this.animator}
					open={this.open === "nation"}
					controller={this.control("nation")}
					navigate={this.navigatePage}
				/>

				<Search
					animator={this.animator}
					open={this.open === "search"}
					controller={this.control("search")}
					navigate={this.navigatePage}
				/>

			</View>

		</Screen>
	}

}
