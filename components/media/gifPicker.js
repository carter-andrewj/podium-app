import React from 'react';
import Component from '../component';
import { View, Text } from 'react-native';
import { inject, observer } from 'mobx-react';
import { FontAwesomeIcon } from 'expo-fontawesome';

import Popup from '../display/popup';


@inject("store")
@observer
export default class GIFPicker extends Component {

	constructor() {

		super({
			selected: undefined
		})

		this.search = this.search.bind(this)
		this.select = this.select.bind(this)
		this.clear = this.clear.bind(this)

		this.confirm = this.confirm.bind(this)
		this.cancel = this.cancel.bind(this)

		this.empty = this.empty.bind(this)
		this.item = this.item.bind(this)
		this.footer = this.footer.bind(this)

		this.timer = undefined

	}


// LIFECYCLE

	componentWillUnmount() {
		clearTimeout(this.timer)
	}





// SELECTION

	type(terms) {
		clearTimeout(this.timer)
		this.updateState(
			state => state.set("terms", terms),
			() => this.timer = setTimeout(
				this.search,
				this.settings.timing.typingInterval
			)
		)
	}

	search(offset = 0) {

		// Get current search terms
		let terms = this.getState("terms")

		// Unpack settings
		let { key, batchSize } = this.config.giphy

		// Search gifs
		fetch("api.giphy.com/v1/gifs/search?" +
			  `api_key=${key}&` +
			  `q=${terms}&` +
			  `language=en&` + 			// TODO - use device language
			  `limit=${batchSize}&` +
			  `offset=${offset}`)
			.then(response => {
				console.log(response)
			})

	}

	select(url) {

	}

	clear() {
		this.updateState(state => state.set("selected", undefined))
	}




// EXIT

	confirm() {

	}

	cancel() {

	}





// COMPONENTS

	empty() {
		return "No results"
	}

	item({ item, index }) {
		return <TouchableOpacity
			style={this.style.imagePicker.thumbnailHolder}
			onPress={() => this.select(item)}>
			<Image
				key={`image-search-result-${index}`}
				source={{ uri: item }}
				style={this.style.imagePicker.thumbnail}
			/>
		</TouchableOpacity>
	}

	footer() {
		return "footer"
	}




// RENDER

	render() {
		let selected = this.getState("selected")
		return <Popup style={this.style.imagePicker.container}>

			<View style={this.style.imagePicker.header}>
				<SquareButton
					icon="trash"
					onPress={this.cancel}
					style={this.style.imagePicker.cancelButton}
				/>
				{selected ?
					<SquareButton
						icon="arrow-circle-right"
						onPress={this.confirm}
						style={this.style.imagePicker.confirmButton}
					/>
					: null
				}
			</View>

			<TextInput
				style={this.style.imagePicker.search}
			/>

			<FadingView
				show={selected ? true : false}
				style={this.style.imagePicker.selected}>
				<Image
					source={{ uri: selected }}
					style={this.style.imagePicker.selectedImage}
				/>
				<View
					pointerEvents="box-none"
					style={this.style.imagePicker.selectedOverlay}>
					<SquareButton
						icon="times"
						onPress={this.clear}
						style={this.style.imagePicker.selectedClearButton}
					/>
				</View>
			</FadingView>

			<FlatList

				ref={this.imageList}
				keyExtractor={this.keys}

				endFillColor={this.colors.white}

				ListEmptyComponent={this.empty}

				ListFooterComponent={this.footer}
				ListFooterComponentStyle={this.style.imagePicker.searchFooter}

				data={this.getState.results}
				renderItem={this.item}

				scrollEnabled={this.getState("scroll")}
				scrollsToTop={false}

				maintainVisibleContentPosition={{
					minIndexForVisible: 0,
				}}
				directionalLockEnabled={true}

			/>

		</Popup>
	}

}