import React from 'react';
import Component from '../../utils/component';
import { View, Text, TextInput, FlatList,
		 TouchableWithoutFeedback } from 'react-native';
import { FontAwesomeIcon } from 'expo-fontawesome';
import { inject, observer } from 'mobx-react';

import globals from '../../globals';
import settings from '../../settings';
import styles from '../../styles/styles';

import QuickResult from './quickResult';



@inject("store")
@observer
class QuickSearch extends Component {

	constructor() {

		super()

		this.state = {
			search: "",
			searchFilter: [],
			results: [],
			changed: false,
			loading: 0,
			focussed: false
		}

		this.timer = null;
		this.input = null;

		this.focus = this.focus.bind(this)
		this.blur = this.blur.bind(this)
		this.logFocus = this.logFocus.bind(this)

		this.typeSearch = this.typeSearch.bind(this)
		this.search = this.search.bind(this)
		this.directSearch = this.directSearch.bind(this)
		this.clearSearch = this.clearSearch.bind(this)

		this.lockScroll = this.lockScroll.bind(this)
		this.unlockScroll = this.unlockScroll.bind(this)

		this.result = this.result.bind(this)
		this.empty = this.empty.bind(this)

	}

	
	componentDidMount() {
		this.props.controller({
			focus: this.focus,
			blur: this.blur,
			clear: this.clearSearch,
			direct: this.directSearch
		})
	}

	focus() {
		this.input.focus()
	}

	blur() {
		this.input.blur()
	}

	logFocus() {
		this.updateState(state => state.update("focussed", f => !f))
	}




// SEARCH

	typeSearch(s) {
		this.updateState(
			state => state
				.set("results", [])
				.set("changed", true)
				.set("search", s),
			this.search
		)
	}

	search(force=false) {

		// Reset timer
		clearTimeout(this.timer)

		// Check if search string exists
		const target = this.state.search
		if (target.length > 0) {
			this.timer = setTimeout(
				() => this.updateState(

					// Count active searches
					state => state
						.update("loading", l => l + 1)
						.set("changed", false),

					// Search
					() =>  this.props.store.api
						.search({
							target: target,
							among: this.state.searchFilter
						})
						.then(result => this.updateState(state => state
							.update("loading", l => l - 1)
							.update("results", current => 
								(this.state.search === target) ?
									result : current
							)
						))
						.catch(console.error)

				),
				force ? 1 : this.props.store.config.validation.delay
			)
		}

	}

	directSearch(target) {
		this.updateState(
			state => state.set("search", target),
			() => {
				this.input.focus()
				this.search(true)
			}
		)
	}

	clearSearch() {
		this.updateState(
			state => state
				.set("search", "")
				.set("loading", 0)
				.set("results", []),
			this.input.blur
		)
	}




// SCROLL MANAGERS

	lockScroll() {
		if (!globals.screenLock) {
			globals.screenLock = "quick-search"
		}
	}

	unlockScroll() {
		if (globals.screenLock === "quick-search") {
			globals.screenLock = false
		}
	}



// RESULTS

	result({ item }) {
		return <QuickResult
			address={item}
			navigate={this.props.navigate}
		/>
	}

	empty() {

		// Check if search is active
		if (this.state.focussed) {

			// Return results component
			return <View style={styles.quickSearch.empty}>
				<Text style={styles.quickSearch.emptyText}>
					{this.state.search.length === 0 ?
						""
					: (this.state.loading || this.state.changed) ?
						"searching"
					:
						"no results"
					}
				</Text>
			</View>

		} else {

			// Return suggested follows component
			return <View style={styles.quickSearch.trending}>
				<Text style={styles.text.title}>
					[SUGGESTED FOLLOWS / TRENDING]
				</Text>
			</View>

		}

	}



// RENDER

	render() {
		return <View style={[
				styles.quickSearch.container,
				styles.keyboard.aboveWithAuto
			]}>

			<View style={styles.quickSearch.header}>

				<TextInput

					ref={ref => this.input = ref}
					key="quick-search"

					placeholder="Search..."
					value={this.state.search}
					onChangeText={this.typeSearch}

					onFocus={this.logFocus}
					onBlur={this.logFocus}

					style={styles.quickSearch.input}
					autoCorrect={false}
					autoCapitalize="none"
		
					returnKeyType="go"
					onSubmitEditing={this.search}

				/>

				<TouchableWithoutFeedback
					onPress={() => this.input.focus()}>
					<View style={styles.quickSearch.overlay}>

						<View style={styles.quickSearch.icon}>
							{this.state.loading ?
								<FontAwesomeIcon
									icon="circle-notch"
									size={settings.layout.quickSearchIcon}
									color={settings.colors.neutralDarkest}
									style={styles.quickSearch.searchIcon}
								/>
								:
								<FontAwesomeIcon
									icon="search"
									size={settings.layout.quickSearchIcon}
									color={settings.colors.neutralDarkest}
									style={styles.quickSearch.searchIcon}
								/>
							}
						</View>

						<View style={styles.quickSearch.icon}>
							<FontAwesomeIcon
								icon="times"
								size={settings.layout.quickSearchIcon}
								color={this.state.search.length > 0 ?
									settings.colors.bad :
									"transparent"
								}
								onPress={this.clearSearch}
							/>
						</View>

					</View>
				</TouchableWithoutFeedback>

			</View>

			<View style={[
					styles.quickSearch.resultsContainer,
					
				]}>
				<FlatList

					ref={ref => this.list = ref}

					contentContainerStyle={styles.quickSearch.resultList}
					endFillColor={settings.colors.neutral}

					data={this.state.results}

					renderItem={this.result}
					ListEmptyComponent={this.empty}

					scrollEnabled={!globals.screenLock ||
						globals.screenLock === "quick-results"}
					onScrollBeginDrag={this.lockScroll}
					onScrollEndDrag={this.unlockScroll}
					scrollsToTop={false}
					
					refreshing={this.state.loading > 0}

					keyboardShouldPersistTaps="handled"
					keyboardDismissMode="none"
					directionalLockEnabled={true}

				/>
			</View>

		</View>
	}


	componentWillUnmount() {
		clearTimeout(this.timer)
	}


}

export default QuickSearch;