import React from 'react';
import Component from '../component';




class DrawerComponent extends Component {

	constructor(...args) {

		super(...args)

		// State
		this.isOpen = false

		this.drawerWillOpen = this.drawerWillOpen.bind(this)
		this.drawerDidOpen = this.drawerDidOpen.bind(this)
		this.drawerWillClose = this.drawerWillClose.bind(this)
		this.drawerDidClose = this.drawerDidClose.bind(this)

	}




// LIFECYCLE

	componentWillUpdate(nextProps) {

		// Check if draw is opening or closing
		if (nextProps.open !== this.props.open) {
			if (nextProps.open) {
				this.drawerWillOpen(nextProps)
			} else {
				this.drawerWillClose(nextProps)
			}
		}

	}


	componentDidUpdate(lastProps) {

		// Check if draw is opening or closing
		if (lastProps.open !== this.props.open) {
			if (this.props.open) {
				this.drawerDidOpen(lastProps)
			} else {
				this.drawerDidClose(lastProps)
			}
		}

	}


	drawerWillOpen(nextProps) {}

	drawerWillClose(nextProps) {}

	drawerDidOpen(lastProps) {}

	drawerDidClose(lastProps) {}




}

export default DrawerComponent;