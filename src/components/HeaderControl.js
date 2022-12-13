import React from 'react';
import { SvgSearchButton } from '../assets/icons/SvgSearchButton';

export class HeaderControl extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      isSearch: false,
    };
  }

  handleInput = (e) => {
    this.setState({
      value: e.target.value,
    });
  };

  handleForm = (e) => {
    e.preventDefault();
    if (this.state.value && !this.state.isSearch) this.props.onSetNewTask(this.state.value);
  };

  handleClickSearch = (e) => {
    // выносить выше или нет?
    this.setState((state) => (state.isSearch ? { isSearch: false } : { isSearch: true }));
    if (this.state.value && this.state.isSearch) this.props.onSearchTask(this.state.value);
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
        <button className="todo-submit btn" type="submit" disabled={this.state.isSearch}>
          Добавить
        </button>
        <button
          className={`todo-search btn ${this.state.isSearch ? 'active' : ''}`}
          type="button"
          onClick={this.handleClickSearch}
        >
          <SvgSearchButton />
        </button>
      </form>
    );
  }
}
