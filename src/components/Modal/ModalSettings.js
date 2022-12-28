import React from 'react';

export class ModalSettings extends React.Component {
  render() {
    return (
      <div className="modal-wrapper">
        <div className="modal-header">
          <h2 className="modal-title">Настройка</h2>
        </div>
        <div className="modal-body">
          <div className="option option-completed">
            <input
              type="checkbox"
              id="isCompletedInEnd"
              checked={this.state.options.isCompletedInEnd}
              onChange={this.handleCheckBoxModal}
            />
            <label htmlFor="isCompletedInEnd">Выполненные таски уходят в конец</label>
          </div>
        </div>
      </div>
    );
  }
}
