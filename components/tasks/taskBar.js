import React from 'react';
import Component from '../component';
import { View } from 'react-native';
import { inject, observer } from 'mobx-react';

import { Map } from 'immutable';

import Animator from '../../utils/animator';

import Task from './task';



@inject("store")
@observer
class TaskBar extends Component {


	constructor() {
		super()
		this.animator = new Animator()
	}


	get capacity() {
		return this.settings.tasks.max
	}


	componentDidUpdate() {
		this.animator.play()
	}


	render() {

		// Get publishable tasks
		let tasks = Map(this.nation.tasks)
			.filter(task => task && task.get("label"))

		// Count publishable tasks
		let taskCount = tasks.size

		// Make task components
		let content = tasks
			.keySeq()
			.map((task, i) => <Task
				animator={this.animator}
				key={`task-${task}`}
				show={i < this.capacity - 1 || taskCount === this.capacity}
				task={task}
			/>)
			.take(this.capacity)
			.toList()
		
		// Render
		return <View
			pointerEvents="box-none"
			style={this.style.taskBar.container}>

			{content.toJS()}

			{<Task
				animator={this.animator}
				key={`task-n`}
				show={taskCount > this.capacity}
				static={true}
				task={{
					label: `... and ${Math.max(2, taskCount - this.capacity + 1)} more`
				}}
			/>}

		</View>

	}


}


export default TaskBar;