import { StyleSheet } from 'react-native';
import { computed, autorun } from 'mobx';


export default Style => class TaskStyle extends Style {


	constructor(...args) {

		super(...args)

		this.compileTask = this.compileTask.bind(this)
		autorun(this.compileTask)

	}


	compileTask() {

		// Unpack settings
		const { max } = this.settings.tasks
		const taskHeight = this.font.size.smallest + this.layout.margin

		// Extend layout
		this.layout.taskBar = {
			height: max * (taskHeight + this.layout.margin),
			task: {
				width: this.layout.screen.width - (2 * this.layout.margin),
				height: taskHeight,
				corners: Math.round(0.5 * this.layout.margin),
			},
		}

	}


	@computed
	get taskBar() {
		return StyleSheet.create({

			container: {
				...this.container,
				width: null,
				alignSelf: "flex-end",
				alignItems: "flex-end",
				alignContent: "flex-end",
				justifyContent: "flex-end",
				position: "absolute",
				right: 0,
				left: 0,
				padding: Math.round(1.5 * this.layout.margin),
				paddingBottom: this.layout.margin,
			},

		})
	}


	@computed
	get task() {
		return StyleSheet.create({

			container: {
				...this.container,
				alignSelf: "flex-end",
				flexDirection: "row",
				...this.withHeight(this.layout.taskBar.task.height),
				backgroundColor: this.colors.major,
				borderRadius: this.layout.taskBar.task.corners,
				marginTop: this.layout.taskBar.task.corners,
				...this.withShadow(),
			},

			message: {
				...this.container,
				flexDirection: "row",
				...this.withHeight(this.layout.taskBar.task.height),
				justifyContent: "flex-start",
			},

			text: {
				...this.text.body,
				fontSize: this.font.size.smallest,
				color: this.colors.white,
				paddingLeft: this.layout.margin,
			},

			iconHolder: {
				...this.row,
				...this.withSize(this.layout.taskBar.task.height),
				paddingRight: this.layout.margin,
			},

			icon: {
				position: "absolute",
				alignSelf: "center",
			},

		})
	}



}