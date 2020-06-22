import React, { Fragment } from 'react';
import DrawerComponent from '../../../components/drawer/component';
import { View, Text, FlatList } from 'react-native';
import { computed } from 'mobx';
import { inject, observer } from 'mobx-react';

import { Map } from 'immutable';

import Drawer from '../../../components/drawer/drawer';
import FadingView from '../../../components/animated/fadingView';
import SquareButton from '../../../components/buttons/squareButton';

import Alert from './alert';



@inject("store")
@observer
class AlertFeed extends DrawerComponent {

	constructor() {

		super({
			filter: "all"
		})

		// Methods
		this.setFilter = this.setFilter.bind(this)

		this.keys = this.keys.bind(this)
		this.empty = this.empty.bind(this)
		this.alert = this.alert.bind(this)
		this.footer = this.footer.bind(this)

	}


// FILTERING

	get filter() {
		return this.getState("filter")
	}

	get filterName() {
		switch (this.filter) {
			case "follow": return " new follower"
			case "mention": return " mention"
			case "promote": return " promoted post"
			case "reply": return " reply"
			default: return ""
		}
	}

	setFilter(filter) {
		this.updateState(state => state.set("filter", filter))
	}

	@computed
	get alerts() {
		return Map(this.nation.alerts.toJS())
			.valueSeq()
			.toJS()
	}

	get visibleCount() {
		console.log(this.alerts)
		return this.alerts
			.filter(a => {
				console.log("type", a.type)
				return this.filter === a.type ||
						 this.filter === "all"
			})
			.length
	}




// RENDER

	keys({ key }, index) {
		return `alert-${key}`
	}


	empty() {
		return <View style={this.style.alerts.empty}>
			<Text style={this.style.alerts.notice}>
				no alerts yet
			</Text>
		</View>
	}


	alert({ item, index }) {
		return <Alert
			alert={item}
			show={this.filter === item.type ||
				  this.filter === "all"}
		/>
	}


	footer() {
		let more = this.visibleCount > 0 ? " more" : ""
		return <View style={{
				...this.style.alerts.footer,
				borderColor: this.visibleCount === 0 ?
					"transparent" :
					this.colors.border
			}}>
			<Text style={this.style.alerts.notice}>
				{`no${more}${this.filterName} alerts`}
			</Text>
		</View>
	}


	render() {

		return <Drawer
			position="left"
			open={this.props.open}
			controller={this.props.controller}
			animator={this.props.animator}
			style={this.style.alerts.body}>

			<View style={this.style.alerts.filter}>
				<SquareButton
					icon="bell"
					onPress={() => this.setFilter("all")}
					label={this.filter === "all" ?
						"all"
						: ""
					}
					labelStyle={this.style.alerts.filterLabel}
					style={this.filter === "all" ?
						this.style.alerts.filterButtonOn :
						this.style.alerts.filterButtonOff
					}
				/>
				<SquareButton
					icon="eye"
					onPress={() => this.setFilter("follow")}
					label={this.filter === "follow" ?
						"new\nfollowers"
						: ""
					}
					labelStyle={this.style.alerts.filterLabel}
					style={this.filter === "follow" ?
						this.style.alerts.filterButtonOn :
						this.style.alerts.filterButtonOff
					}
				/>
				<SquareButton
					icon="at"
					onPress={() => this.setFilter("mention")}
					label={this.filter === "mention" ?
						"mentions"
						: ""
					}
					labelStyle={this.style.alerts.filterLabel}
					style={this.filter === "mention" ?
						this.style.alerts.filterButtonOn :
						this.style.alerts.filterButtonOff
					}
				/>
				<SquareButton
					icon="bullhorn"
					onPress={() => this.setFilter("promote")}
					label={this.filter === "promote" ?
						"promotions"
						: ""
					}
					labelStyle={this.style.alerts.filterLabel}
					style={this.filter === "promote" ?
						this.style.alerts.filterButtonOn :
						this.style.alerts.filterButtonOff
					}
				/>
				<SquareButton
					icon="comment-medical"
					onPress={() => this.setFilter("reply")}
					label={this.filter === "reply" ?
						"replies"
						: ""
					}
					labelStyle={this.style.alerts.filterLabel}
					style={this.filter === "reply" ?
						this.style.alerts.filterButtonOn :
						this.style.alerts.filterButtonOff
					}
				/>
			</View>

			<FlatList

				ref={this.alertList}
				keyExtractor={this.keys}

				endFillColor={this.colors.white}

				ListEmptyComponent={this.empty}

				ListFooterComponent={this.footer}
				ListFooterComponentStyle={this.style.container}

				data={this.alerts}

				renderItem={this.alert}

				scrollsToTop={false}

				maintainVisibleContentPosition={{
					minIndexForVisible: 0,
				}}
				directionalLockEnabled={true}

				keyboardShouldPersistTaps="handled"
				keyboardDismissMode="on-drag"

			/>

		</Drawer>
	}

}

export default AlertFeed;