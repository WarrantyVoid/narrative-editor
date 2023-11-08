import React from 'react';
import * as Model from '../model.js';
import DecisionEditor from "./DecisionEditor.js";
import RealmEffectEditor from "./RealmEffectEditor.js";
import StringEditor from "./StringEditor.js";

const SectionEditor = React.forwardRef((props, ref) => {
  const id = React.useId();
  const titleEditId = `${id}-title-edit`;
  const textEditId = `${id}-text-edit`;
  return (
    <li className="section-editor" ref={ref}>
      <StringEditor
        id={titleEditId}
        className="subtitle-editor section-header"
        value={props.title}
        onEdit={(v) => { props.onKeyChange(v); }} />
      <textarea
        id={textEditId}
        className="section-text-editor"
        placeholder="Section Text"
        value={props.section.text}
        rows="5"
        onChange={event => { props.section.text = event.target.value; props.setSection(props.section); }}>
      </textarea>
      <div className="horizontal-layout">
        <img src="effect18.png" alt="Effects Icon" className="header-item" />
        <h4>
          <span className="header-item">Effects</span>
          <button
            title="AddEffect"
            className="header-item title-button"
            onClick={() => { props.section.effects.push(new Model.RealmEffect()); props.setSection(props.section); }}>
            +
          </button>
          <button
            title="DelEffect"
            className="header-item title-button"
            onClick={() => { props.section.effects.pop(); props.setSection(props.section); }}>
            -
          </button>
        </h4>
      </div>
      <ul>
        {props.section.effects.map(effect => (
          <RealmEffectEditor
            key={props.section.effects.indexOf(effect)}
            effect={effect}
            setEffect={(decision) => { props.setSection(props.section); }} />))}
      </ul>
      <div className="section-decisions-box">
        <div className="horizontal-layout">
          <img src="decision18.png" alt="Decisions Icon" className="header-item" />
          <h4>
            <span className="header-item">Decisions</span>
          </h4>
        </div>
        <ul>
          {props.section.decisions.map(decision => (
            <DecisionEditor
              key={props.section.decisions.indexOf(decision)}
              decision={decision}
              setDecision={(decision) => { props.setSection(props.section); }} />))}
        </ul>
      </div>
    </li>
  )
});

export default SectionEditor;
