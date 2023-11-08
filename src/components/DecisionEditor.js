import React, { useContext } from 'react';
import { NarrativeContext } from "./context.js"
import ConditionEditor from "./ConditionEditor.js";

export default function DecisionEditor(props) {
  const narrative = useContext(NarrativeContext);
  const id = React.useId();
  const sectionSelectId = `${id}-section-select`;
  const textEditId = `${id}-text-edit`;
  return (
    <li className="decision-editor">
      <textarea
        id={textEditId}
        className="decision-text-editor"
        rows="1"
        placeholder="Decision Text"
        value={props.decision.text}
        onChange={event => { props.decision.text = event.target.value; props.setDecision(props.decision); }}>
      </textarea>
      <ConditionEditor
        condition={props.decision.condition}
        setCondition={(condition) => { props.decision.condition = condition; props.setDecision(props.decision); }} />
      <label
          htmlFor={sectionSelectId}
          className="header-item">
          Target:
          <select
            id={sectionSelectId}
            className="header-item"
            type="text"
            value={ props.decision.targetSection }
            onChange={event => { props.decision.targetSection = event.target.value; props.setDecision(props.decision); }}>
            {narrative.sections.map(section => (<option key={section.key}>{section.key}</option>))}
          </select>
        </label>
    </li>
  );
}
