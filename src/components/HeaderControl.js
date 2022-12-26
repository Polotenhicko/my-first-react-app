import React from 'react';
import { SvgSearchButton } from '../assets/icons/SvgSearchButton';

export class HeaderControl extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
    };
  }

  handleInput = (e) => {
    this.setState((state) => {
      const value = e.target.value;
      if (this.props.isSearch) this.props.onSearchTask(value);
      return { value };
    });
  };

  handleForm = (e) => {
    e.preventDefault();
    if (!this.state.value) return;
    if (this.props.isSearch) {
      this.props.onSearchTask(this.state.value);
    } else {
      this.props.onSetNewTask(this.state.value);
    }
  };

  handleClickSearchButton = (e) => {
    // выносить выше или нет? уже забыл вопрос
    // если стэйт асинк, то как лучше проверять ласт значение?
    if (!this.props.isSearch) {
      this.props.onSearchTask(this.state.value);
    }
    this.props.onClickSearchButton();
  };

  render() {
    return (
      <form className="todo-header" onSubmit={this.handleForm}>
        <input
          className="todo-input"
          type="text"
          onChange={this.handleInput}
          value={this.state.value}
          placeholder={this.props.placeholderText}
        />
        <button className="todo-submit btn" type="submit" disabled={this.props.isSearch}>
          Добавить
        </button>
        <button
          className={`todo-search btn ${this.props.isSearch ? 'active' : ''}`}
          type="button"
          onClick={this.handleClickSearchButton}
        >
          <SvgSearchButton />
        </button>
      </form>
    );
  }
}
