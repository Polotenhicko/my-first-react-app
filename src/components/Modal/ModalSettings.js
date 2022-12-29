import React from 'react';
import { SvgClose } from '../../assets/icons/SvgClose';

export class ModalSettings extends React.Component {
  modal = React.createRef();

  componentDidMount() {
    this.timerAddActive = setTimeout(() => this.modal.current.classList.add('active'));
  }

  componentWillUnmount() {
    clearTimeout(this.timerAddActive);
    clearTimeout(this.timerRemoveActive);
  }

  onCloseModal = (e) => {
    if (e.target == e.currentTarget || e.target.closest('svg')?.hasAttribute('data-modal-close')) {
      this.modal.current.classList.remove('active');
      this.timerRemoveActive = setTimeout(() => this.props.onCloseModal(), 400);
    }
  };

  handleIsCompletedInEnd = (e) => {
    this.props.onChangeOptions(e.target.checked, 'isCompletedInEnd');
  };

  render() {
    return (
      <div className="modal" onClick={this.onCloseModal} ref={this.modal}>
        <div className="modal-wrapper">
          <div className="modal-header">
            <h2 className="modal-title">Настройка</h2>
            <SvgClose />
          </div>
          <div className="modal-body">
            <div className="option">
              <input
                type="checkbox"
                id="isCompletedInEnd"
                checked={this.props.options.isCompletedInEnd}
                onChange={this.handleIsCompletedInEnd}
              />
              <label htmlFor="isCompletedInEnd">Выполненные таски уходят в конец</label>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
