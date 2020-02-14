import React from 'react';
import DrawerComponent from '../../../components/drawer/component';
import { View, Text, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { inject, observer } from 'mobx-react';

import { Set } from 'immutable';

import Spinner from '../../../components/animated/spinner';
import FadingIcon from '../../../components/animated/fadingIcon';
import FadingView from '../../../components/animated/fadingView';
import Drawer from '../../../components/drawer/drawer';
import Button from '../../../components/buttons/button';

import Result from './result';

import Animator from '../../../utils/animator';






@inject("store")
@observer
class Search extends DrawerComponent {

	constructor() {

		super({
			terms: "",
			results: Set(),
			active: 0,
			visible: Set(),
		})

		// Utilities
		this.animator = new Animator({ window: 100 }).configure("slide")

		this.timer = undefined

		// Methods
		this.type = this.type.bind(this)
		this.search = this.search.bind(this)
		this.clearSearch = this.clearSearch.bind(this)
		this.onError = this.onError.bind(this)

		this.setVisible = this.setVisible.bind(this)
		this.clearVisible = this.clearVisible.bind(this)

		this.result = this.result.bind(this)

	}



// LIFECYCLE

	componentDidUpdate() {
		this.animator.play()
	}

	componentWillUnmount() {
		clearTimeout(this.timer)
		clearTimeout(this.playTimer)
	}




// SEARCH

	get terms() {
		return this.getState("terms")
	}

	get results() {
		return this.getState("results").toJS()
	}

	get count() {
		return this.getState("visible").size
	}
	
	get searching() {
		 return this.getState("active") > 0
	}

	get filled() {
		return this.terms && this.terms.length > 0
	}


	type(text) {

		// Check if text is provided
		if (!text || text.length === 0) {

			// Clear search
			this.clearSearch()

		} else {

			// Trigger search
			this.updateState(
				state => state
					.set("terms", text)
					.update("active", a => a + 1)
					.set("error", undefined),
				this.search
			)

		}

	}


	search(force = false) {
		
		// Clear existing search delay
		clearTimeout(this.timer)

		// Ignore if no terms are specified
		if (!this.filled) return

		// Schedule next search
		this.timer = setTimeout(

			// Search for terms
			() => this.nation
				.search(this.terms)
				.then(results => Promise.all(
					results.map(address => new Promise(async resolve => {

						// Load subject
						await this.nation.get("user", address).whenReady()

						// Add result
						this.updateState(
							state => state.update(
								"results",
								current => current.add(address)
							),
							resolve
						)

					}))
				))
				.then(() => this.updateState(
					state => state.update("active", a => a - 1)
				))
				.catch(this.onError),

			// Delay, unless search was forced
			force ? 0 : this.config.validation.delay
		
		)

	}


	clearSearch() {
		this.updateState(state => state
			.set("terms", "")
			.set("active", 0)
			.set("error", undefined)
		)
	}

	onError(error) {
		this.updateState(

			// Remove an active search and
			// save the error
			state => state
				.update("active", a => Math.max(0, a - 1))
				.set("error", error),

			// Report error
			() => console.error(error)

		)
	}




// RESULTS

	setVisible(address) {
		this.updateState(state => state
			.update("visible", visible => visible.add(address))
		)
	}

	clearVisible(address) {
		this.updateState(state => state
			.update("visible", visible => visible.delete(address))
		)
	}

	result({ index, item }) {
		return <Result
			key={item}
			terms={this.terms}
			index={index}
			address={item}
			animator={this.animator}
			navigate={this.props.navigate}
			beforeShow={() => this.setVisible(item)}
			onHide={() => this.clearVisible(item)}
		/>
	}





// RENDER

	render() {

		return <Drawer
			position="right"
			open={this.props.open}
			onOpen={() => this.input.focus()}
			beforeClose={() => this.input.blur()}
			controller={this.props.controller}
			animator={this.props.animator}>

			<View style={this.style.search.header}>

				<TextInput

					ref={ref => this.input = ref}
					key="search"

					placeholder="Search..."
					value={this.terms}
					onChangeText={this.type}

					onFocus={this.logFocus}
					onBlur={this.logFocus}

					style={this.style.search.input}
					autoCorrect={false}
					autoCapitalize="none"
		
					returnKeyType="go"
					onSubmitEditing={() => this.search(true)}

				/>

				<View
					pointerEvents="box-none"
					style={this.style.search.overlay}>

					<View style={this.style.search.iconLeft}>
						<FadingIcon
							show={!this.searching}
							icon="search"
							containerStyle={this.style.search.iconOver}
							size={this.layout.search.input.icon}
						/>
						<Spinner
							show={this.searching}
							containerStyle={this.style.search.iconOver}
							size={Math.round(this.layout.search.input.icon * 1.2)}
							color={this.colors.neutral}
						/>
					</View>

					{this.filled ?
						<Button
							style={this.style.search.iconRight}
							icon="times"
							iconColor={this.colors.bad}
							iconSize={this.layout.search.input.icon}
							onPress={this.clearSearch}
						/>
						: null
					}

				</View>

			</View>


			<View style={this.style.search.results}>

				<View
					style={this.style.search.counter}
					show={this.count === 0}>
					<Text style={this.style.search.counterText}>
						{!this.filled ?
							""
						: this.searching ?
							"...searching..."
						: this.count === 0 ?
							"no results"
						: this.count === 1 ?
							"1 result"
						:
							`${this.count} results`
						}
					</Text>
				</View>

				<FlatList

					ref={ref => this.resultList = ref}
					keyExtractor={item => `result-${item}`}

					endFillColor={this.colors.neutral}

					data={this.results}

					renderItem={this.result}
					ListEmptyComponent={this.empty}

					onScrollBeginDrag={this.lockScroll}
					onScrollEndDrag={this.unlockScroll}
					scrollsToTop={false}
					showHorizontalScrollIndicator={false}

					keyboardShouldPersistTaps="handled"
					keyboardDismissMode="none"
					directionalLockEnabled={true}

				/>

			</View>

		</Drawer>
	}

}

export default Search;