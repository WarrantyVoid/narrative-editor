import React from 'react';
import * as Model from '../model.js';
import StateEditor from "./StateEditor.js";
import StringEditor from "./StringEditor.js";

export default function EntityEditor(props) {
  const id = React.useId();
  const editId = `${id}-edit`;
  return (
    <li className="entity-editor">
      <StringEditor
        id={editId}
        className="subtitle-editor entity-header"
        value={props.name}
        onEdit={(v) => { props.onKeyChange(v); }} />
      <div >
        <div className="horizontal-layout">
          <img src="state18.png" alt="State Icon" className="header-item" />
          <h4>
            <span className="header-item">State</span>
            <button
              title="Add"
              className="header-item title-button"
              onClick={() => { props.entity.states.push(new Model.State()); props.setEntity(props.entity); }}>
              +
            </button>
            <button
              title="Del"
              className="header-item title-button"
              onClick={() => { props.entity.states.pop(); props.setEntity(props.entity); }}>
              -
            </button>
          </h4>
        </div>
        <ul>
          {props.entity.states.map(entry => (
            <StateEditor
              key={props.entity.states.indexOf(entry)}
              state={entry}
              setState={(state) => { props.setEntity(props.entity); }}
            />))}
        </ul>
      </div>
    </li>
  );
}