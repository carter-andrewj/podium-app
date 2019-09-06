import React from 'react';
import Component from '../../utils/component';
import { View, Text, FlatList, Image,
		 TouchableOpacity } from 'react-native';
import { autorun, toJS, trace } from 'mobx';
import { inject, observer } from 'mobx-react';

import globals from '../../globals';
import settings from '../../settings';
import styles from '../../styles/styles';

import Button from '../../components/button';



const filters = {
	"all": ["promote", "reply", "mention", "follow", "verdict", "sanction"],
	"mentions": ["mention", "reply"],
	"promos": ["promote"],
	"follows": ["follow"],
	"juries": ["verdict", "sanction"]
}



@inject("store")
@observer
class QuickAlerts extends Component {

	constructor() {

		super()

		this.state = {
			filter: "all",
			filterSet: filters.all,
			filterTitle: "alerts",
			loading: false,
			alerts: []
		}

		this.list = null

		this.filterAlerts = this.filterAlerts.bind(this)
		this.quickAlert = this.quickAlert.bind(this)
		this.emptyAlerts = this.emptyAlerts.bind(this)

		this.lockScroll = this.lockScroll.bind(this)
		this.unlockScroll = this.unlockScroll.bind(this)

	}

	componentDidMount() {
		this.props.store.session.addAlert({
			type: "reply",
			user: "Test User 1",
			post: "alert-post-address-1"
		})
		this.props.store.session.addAlert({
			type: "promote",
			user: "Test User 2",
			post: "alert-post-address-2",
			value: 12,
			currency: "PDM"
		})
		this.props.store.session.addAlert({
			type: "mention",
			user: "Test User 3",
			post: "alert-post-address-3"
		})
		this.props.store.session.addAlert({
			type: "jury",
			verdict: "jury-verdict-1",
		})
		this.props.store.session.addAlert({
			type: "sanction",
			rule: "2.1.3",
			verdict: "jury-verdict-2",
		})
		this.props.store.session.addAlert({
			type: "follow",
			user: "Test User 4",
		})
	}


	filterAlerts(filter) {
		this.updateState(state => state
			.set("filter", filter)
			.set("filterSet", filters[filter])
			.set("filterTitle", filter === "all" ? "alerts" : filter)
			
		)
	}

	quickAlert({ index, item }) {

		// Retrieve alert
		let alert = item;

		// Unpack alert
		let message;
		let link;
		switch (item.type) {

			// Handle alerts for replies
			case "reply":
				message = <Text style={styles.alerts.quickAlertText}>
					<Text style={styles.text.user}>
						{alert.user}
					</Text>
					<Text>{" replied to your post"}</Text>
				</Text>
				link = () => this.props.navigate(
					"Post",
					{ address: alert.post }
				)
				break;

			// Handle alerts for replies
			case "mention":
				message = <Text style={styles.alerts.quickAlertText}>
					<Text style={styles.text.user}>
						{alert.user}
					</Text>
					<Text>{" mentioned you in their post"}</Text>
				</Text>
				link = () => this.props.navigate(
					"Post",
					{ address: alert.post }
				)
				break;

			// Handle alerts for promotions
			case "promote":
				message = <Text style={styles.alerts.quickAlertText}>
					<Text style={styles.text.user}>
						{alert.user}
					</Text>
					<Text>{" spent "}</Text>
					<Text style={styles.text.pdm}>
						{` ${alert.value}${alert.currency} `}
					</Text>
					<Text>{" to promote your post"}</Text>
				</Text>
				link = () => this.props.navigate(
					"Post",
					{ address: alert.post }
				)
				break;

			// Handle alerts for follows
			case "follow":
				message = <Text style={styles.alerts.quickAlertText}>
					<Text style={styles.text.user}>
						{alert.user}
					</Text>
					<Text>{" followed you"}</Text>
				</Text>
				link = () => this.props.navigate(
					"User",
					{ address: alert.user }
				)
				break;

			// Handle alerts for Jury results
			case "verdict":
				message = <Text style={styles.alerts.quickAlertText}>
					your jury reached a verdict
				</Text>
				link = () => this.props.navigate(
					"Verdict",
					{ address: alert.jury }
				)
				break;

			// Handle alerts for Sanctions
			case "sanction":
				message = <Text style={styles.alerts.quickAlertText}>
					<Text>
						you have been sanctioned for violating
					</Text>
					<Text style={styles.text.sanction}>
						{alert.rule}
					</Text>
				</Text>
				link = () => this.props.navigate(
					"Verdict",
					{ address: alert.jury }
				)
				break;

			default: null

		}

		// Return 
		return <TouchableOpacity key={`alert-${index}`}>
			<View style={styles.alerts.quickAlert}>
				<View style={styles.alerts.quickAlertPictureHolder}>
					<Image
						style={styles.alerts.quickAlertPicture}
						source={require("../../assets/profile-placeholder.png")}
					/>
				</View>
				<View style={styles.alerts.quickAlertMessage}>
					{message}
				</View>
			</View>
		</TouchableOpacity>

	}


	emptyAlerts() {
		return <View style={styles.alerts.quickEmpty}>
			<Text style={styles.alerts.quickEmptyText}>

			</Text>
		</View>
	}


	lockScroll() {
		globals.screenLock = "quick-alerts"
	}

	unlockScroll() {
		globals.screenLock = false
	}




	render() {

		const filter = this.state.filter

		return 	<View style={styles.alerts.quickContainer}>

			<View style={styles.alerts.quickHeader}>

				<View style={styles.alerts.quickTitle}>
					<Text style={styles.alerts.quickTitleText}>
						{this.state.filterTitle}
					</Text>
				</View>

				<View style={styles.alerts.quickFilter}>

					<Button
						icon="bell"
						iconColor={filter === "all" ?
							settings.colors.major :
							settings.colors.neutral
						}
						iconSize={16}
						onPress={() => this.filterAlerts("all")}
						style={{ "alignSelf": "flex-end" }}
					/>

					<Button
						icon="at"
						iconColor={filter === "mentions" ?
							settings.colors.major :
							settings.colors.neutral
						}
						iconSize={16}
						onPress={() => this.filterAlerts("mentions")}
						style={{ "alignSelf": "flex-end" }}
					/>

					<Button
						icon="bullhorn"
						iconColor={filter === "promos" ?
							settings.colors.major :
							settings.colors.neutral
						}
						iconSize={16}
						onPress={() => this.filterAlerts("promos")}
						style={{ "alignSelf": "flex-end" }}
					/>

					<Button
						icon="eye"
						iconColor={filter === "follows" ?
							settings.colors.major :
							settings.colors.neutral
						}
						iconSize={16}
						onPress={() => this.filterAlerts("follows")}
						style={{ "alignSelf": "flex-end" }}
					/>

					<Button
						icon="exclamation-triangle"
						iconColor={filter === "juries" ?
							settings.colors.major :
							settings.colors.neutral
						}
						iconSize={16}
						onPress={() => this.filterAlerts("juries")}
						style={{ "alignSelf": "flex-end" }}
					/>

				</View>

			</View>

			<View style={styles.alerts.quickListContainer}>
				<FlatList

					ref={this.list}
					contentContainerStyle={styles.alerts.quickList}

					data={this.props.store.session.alerts
						.map(toJS)
						.filter(a => this.state.filterSet.includes(a.type))
					}
					initialNumToRender={5}

					renderItem={this.quickAlert}
					ListEmptyComponent={this.emptyAlerts}

					scrollEnabled={!globals.screenLock ||
						globals.screenLock === "quick-alerts"}
					onScrollBeginDrag={this.lockScroll}
					onScrollEndDrag={this.unlockScroll}
					
					onEndReachedThreshold={1.0}
					onEndReached={this.props.store.session.loadAlerts}
					refreshing={this.state.loading}

				/>
			</View>

			<View style={styles.alerts.quickFooter}>
				<Button
					label="see all"
					onPress={() => this.props.navigate("Alerts")}
					style={{ alignSelf: "flex-end" }}
				/>
			</View>

		</View>
	}

}

export default QuickAlerts;