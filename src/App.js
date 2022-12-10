import React from "react";
import Joi from "joi";

const taskSchema = Joi.array().items(
	Joi.object({
		id: Joi.number(),
		value: Joi.string(),
		state: Joi.number().integer().min(0).max(3),
	})
);

const LOCALNAME = "__taskArray";

class App extends React.Component {
	constructor(props) {
		super(props);
		try {
			this.state = { taskArray: Joi.attempt(JSON.parse(localStorage[LOCALNAME]), taskSchema) };
		} catch (e) {
			this.state = { taskArray: [] };
		}

		const idList = this.state.taskArray.map((taskObj) => taskObj.id);
		this.maxId = idList.length ? Math.max(...idList) : -1;
		this.setNewTask = this.setNewTask.bind(this);
		console.log(this.state.taskArray);
	}

	setNewTask(taskValue) {
		const taskObj = {
			id: ++this.maxId,
			value: taskValue,
			state: 0,
		};
		this.setState((state) => {
			const taskArray = [...state.taskArray, taskObj];
			localStorage.setItem(LOCALNAME, JSON.stringify(taskArray));
			return { taskArray };
		});
	}

	render() {
		return (
			<div className="App">
				<HeaderControl setNewTask={this.setNewTask} />
				<TaskList taskArray={this.state.taskArray} />
			</div>
		);
	}
}

class HeaderControl extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			value: "",
		};

		this.handleInput = this.handleInput.bind(this);
		this.handleForm = this.handleForm.bind(this);
	}

	handleInput(e) {
		this.setState({
			value: e.target.value,
		});
	}

	handleForm(e) {
		e.preventDefault();
		this.props.setNewTask(this.state.value);
	}

	render() {
		return (
			<form className="todo-header" onSubmit={this.handleForm}>
				<input type="text" onChange={this.handleInput} value={this.state.value} />
				<button type="submit">Добавить</button>
			</form>
		);
	}
}

class TaskList extends React.Component {
	render() {
		const taskArray = this.props.taskArray.map((taskObj) => <TaskItem key={taskObj.id} state={taskObj.state} value={taskObj.value} />);
		return <ul className="task-list">{taskArray}</ul>;
	}
}

class TaskItem extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return <li className="task-item">{this.props.value}</li>;
	}
}

export default App;

/*

[
	{id: 0, value: 'aboba', state: 0}
]

*/
