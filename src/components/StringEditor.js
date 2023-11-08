import React from 'react';
import { createRef } from 'react';

export default class StringEditor extends React.Component {
  constructor(props) {
    super(props);
    this.isEditing = false;
    this.input = createRef();
    this.display = createRef();
  }

  beginEdit() {
    this.display.current.hidden = true;
    this.input.current.hidden = false;
    this.input.current.value = this.props.value;
    const end = this.input.current.value.length;
    this.input.current.setSelectionRange(end, end);
    this.input.current.focus();
    this.isEditing = true;
  }

  endEdit() {
    if (this.isEditing) {
      this.isEditing = false;
      this.input.current.hidden = true;
      this.display.current.hidden = false;
      this.props.onEdit(this.input.current.value);
    }
  }

  endEditOnEnter(e) {
    if (e.key === 'Enter') {
      this.endEdit()
    }
  }

  render() {
    return (
      <div className={this.props.className}>
        <input
          id={this.props.id}
          hidden
          ref={this.input}
          type="text"
          onBlur={() => this.endEdit()}
          onKeyDown={(e) => this.endEditOnEnter(e)} />
        <span ref={this.display}>
          {this.props.value}
          <img
            src="edit19.png"
            alt="Edit Icon"
            onClick={() => this.beginEdit()} />
        </span>
      </div>
    );
  }
}
