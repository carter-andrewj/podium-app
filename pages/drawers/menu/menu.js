import React from 'react';
import DrawerComponent from '../../../components/drawer/component';
import { View, Text, TouchableOpacity } from 'react-native';
import { inject, observer } from 'mobx-react';

import Drawer from '../../../components/drawer/drawer';
import Avatar from '../../../components/media/avatar';
import MenuButton from '../../../components/buttons/menuButton';
import Name from '../../../components/display/name';

import { formatPercentage, formatNumber } from '../../../utils/utils';



@inject("store")
@observer
class Menu extends DrawerComponent {

	constructor() {
		super()
		this.to = this.to.bind(this)
	}

	to(destination, params) {
		return () => this.props.navigate.to(destination, params)
	}

	render() {
		return <Drawer
			position="left"
			open={this.props.open}
			controller={this.props.controller}
			animator={this.props.animator}
			style={this.style.menu.body}>

			<View style={this.style.menu.header}>

				<TouchableOpacity onPress={this.to("Profile")}>
					<Avatar
						corner="right"
						user={this.activeUser}
						style={this.style.menu.avatar}
					/>
				</TouchableOpacity>

				<TouchableOpacity
					style={this.style.menu.profile}
					onPress={this.to("profile")}>
					<Name user={this.activeUser} />
					<Text style={this.style.menu.alias}>
						{this.activeUser.alias}
					</Text>
					<Text style={this.style.menu.bio}>
						{this.activeUser.about}
					</Text>
				</TouchableOpacity>

			</View>

			<View style={this.style.menu.sectionDouble}>

				<View style={this.style.menu.headingHolder}>
					<Text style={this.style.menu.heading}>
						Platform
					</Text>
				</View>

				<View style={this.style.menu.buttonPair}>
					<MenuButton
						position="left"
						style={this.style.menuButton.pair}
						onPress={this.to("Profile", { show: "posts" })}
						icon="comment"
						title="posts"
						caption={this.activeUser.postCount}
					/>
					<MenuButton
						position="right"
						style={this.style.menuButton.pair}
						onPress={this.to("Emblems")}
						icon="certificate"
						title="emblems"
						caption={this.activeUser.emblemCount}
					/>
				</View>

				<View style={this.style.menu.buttonPair}>
					<MenuButton
						position="left"
						style={this.style.menuButton.pair}
						onPress={this.to("Profile", { show: "following" })}
						icon="eye"
						title="following"
						caption={this.activeUser.followingCount}
					/>
					<MenuButton
						position="right"
						style={this.style.menuButton.pair}
						onPress={this.to("Profile", { show: "followers" })}
						icon="users"
						title="followers"
						caption={this.activeUser.followerCount}
					/>
				</View>

			</View>

			<View style={this.style.menu.section}>

				<View style={this.style.menu.headingHolder}>
					<Text style={this.style.menu.heading}>
						Wallet
					</Text>
				</View>

				<View style={this.style.menu.buttonPair}>
					<MenuButton
						position="left"
						style={this.style.menuButton.pair}
						onPress={this.to("Wallet", { show: "pod" })}
						icon="dot-circle"
						color={this.colors.pod}
						title="POD"
						caption={formatNumber(this.activeUser.pod)}
					/>
					<MenuButton
						position="right"
						style={this.style.menuButton.pair}
						onPress={this.to("Wallet", { show: "aud" })}
						icon="dot-circle"
						color={this.colors.aud}
						title="AUD"
						caption={formatNumber(this.activeUser.aud)}
					/>
				</View>

			</View>

			<View style={this.style.menu.section}>

				<View style={this.style.menu.headingHolder}>
					<Text style={this.style.menu.heading}>
						Reputation
					</Text>
				</View>
					
				<View style={this.style.menu.buttonPair}>
					<MenuButton
						position="left"
						style={this.style.menuButton.pair}
						onPress={this.to("Integrity")}
						icon="balance-scale"
						title="integrity"
						caption={formatPercentage(this.activeUser.integrity, 0)}
					/>
					<MenuButton
						position="right"
						style={this.style.menuButton.pair}
						onPress={this.to("Sanctions")}
						icon="ban"
						title="sanctions"
						caption={formatNumber(this.activeUser.sanctionCount, 0)}
					/>
				</View>

			</View>

			<View style={this.style.general.spacer} />

			<View style={this.style.menu.footer}>
				<MenuButton
					style={this.style.menuButton.group}
					onPress={this.props.signOut}
					icon="sign-out-alt"
					title="sign out"
					caption=" "
				/>
				<MenuButton
					style={this.style.menuButton.group}
					onPress={this.to("settings")}
					icon="cogs"
					title="settings"
					caption=" "
				/>
				<MenuButton
					style={this.style.menuButton.group}
					onPress={this.to("messages")}
					icon="envelope"
					title="messages"
					caption=" "
				/>
			</View>

		</Drawer>
	}

}

export default Menu;