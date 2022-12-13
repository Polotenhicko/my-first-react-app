import React from 'react';

export class HeaderControl extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
    };
  }

  handleInput = (e) => {
    this.setState({
      value: e.target.value,
    });
  };

  handleForm = (e) => {
    e.preventDefault();
    if (this.state.value) this.props.onSetNewTask(this.state.value);
  };

  render() {
    return (
      <form className="todo-header" onSubmit={this.handleForm}>
        <input
          className="todo-input"
          type="text"
          onChange={this.handleInput}
          value={this.state.value}
        />
        <button className="todo-submit" type="submit">
          Добавить
        </button>
      </form>
    );
  }
}
