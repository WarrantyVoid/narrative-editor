import React from 'react';
import { createRef } from 'react';
import ResizePanel from "react-resize-panel";

import * as Model from '../model.js';

import { NarrativeContext } from "./context.js"

import EntityEditor from "./EntityEditor.js";
import Graph from "./Graph";
import ObjectEditor from "./ObjectEditor.js";
import SectionEditor from "./SectionEditor.js";
import StringEditor from "./StringEditor.js";

class Layout {
  constructor() {
    this.elements = new Map();
    this.rows = [];
  }

  position(parentSection, section) {
    let element = this.elements.get(section);
    if (element) {
      return { x: element.rx * 175, y: element.ry * 50 };
    }
    let parentElement = this.elements.get(parentSection);
    if (parentElement) {
      element = this.insert(section, parentElement.ry + 1);
    } else {
      element = this.insert(section, this.rows.length);
    }
    if (element) {
      return { x: element.rx * 175, y: element.ry * 50 };
    }
  }

  insert(section, ry) {
    if (this.rows.length < ry + 1) {
      this.rows.push([]);
    }
    let rx = this.rows[ry].length;
    this.rows[ry].push(section);
    this.elements.set(section, { rx, ry });
    return this.elements.get(section);
  }
}

export default class NarrativeEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = { narrative: new Model.Narrative() };
    this.layout = new Layout();
    this.loadFile = createRef();
    this.saveFile = createRef();
    this.sectionRefs = {};
  }

  handleNew() {
    this.setState({ narrative: new Model.Narrative() });
  }

  handleLoad(e) {
    if (e.target.files.length > 0) {
      let reader = new FileReader();
      reader.onload = res => {
        let state = JSON.parse(res.target.result);
        for (let entry of state.sections) {
          if (!entry.hasOwnProperty('position')) {
            entry.position = this.layout.position(null, entry.key);
            for (let decision of entry.value.decisions) {
              this.layout.position(entry.key, decision.targetSection);
            }
          }
        }
        this.setState({ narrative: state });
      }
      reader.onerror = err => {
        console.log(err);
      }
      reader.readAsText(e.target.files[0]);
      e.target.value = "";

    }
  }

  handleAddSection(position) {
    let sections = this.state.narrative.sections;
    const key = "section-" + (sections.length + 1);
    sections.push({
      key: key,
      value: new Model.Section(),
      position
    });
    this.setState({ narrative: this.state.narrative });
  }

  handleEditSection(section, position) {
    section.position = position;
    this.setState({ narrative: this.state.narrative });
  }

  handleDelSection(section) {
    let sections = this.state.narrative.sections;
    const idx = sections.indexOf(section);
    sections.splice(idx, 1);
    this.setState({ narrative: this.state.narrative });
  }

  handleAddDecision(frSection, toSection) {
    let sections = this.state.narrative.sections;
    const frIdx = sections.indexOf(frSection);
    const toIdx = sections.indexOf(toSection);
    let decision = new Model.Decision();
    decision.targetSection = sections[toIdx].key;
    sections[frIdx].value.decisions.push(decision);
    this.setState({ narrative: this.state.narrative });
  }

  handleDelDecision(section, decision) {
    let sections = this.state.narrative.sections;
    const sIdx = sections.indexOf(section);
    const dIdx = sections[sIdx].value.decisions.indexOf(decision);
    sections[sIdx].value.decisions.splice(dIdx, 1);
    this.setState({ narrative: this.state.narrative });
  }

  handleEditSectionKey(section, key) {
    let sections = this.state.narrative.sections;
    const idx = sections.indexOf(section);
    sections[idx].key = key;
    this.setState({ narrative: this.state.narrative });
  }

  handleAddEntity() {
    let entities = this.state.narrative.realm.entities;
    const key = "entity-" + (entities.length + 1);
    entities.push({ key: key, value: new Model.Entity() });
    this.setState({ narrative: this.state.narrative });
  }

  handleDelEntity(entity) {
    let entities = this.state.narrative.realm.entities;
    let idx = entities.length - 1;
    entities.splice(idx, 1);
    this.setState({ narrative: this.state.narrative });
  }

  handleEditEntityKey(entity, key) {
    let entities = this.state.narrative.realm.entities;
    const idx = entities.indexOf(entity);
    entities[idx].key = key;
    this.setState({ narrative: this.state.narrative });
  }

  handleAddObject() {
    let objects = this.state.narrative.realm.objects;
    const key = "object-" + (objects.length + 1);
    objects.push({ key: key, value: new Model.Object() });
    this.setState({ narrative: this.state.narrative });
  }

  handleDelObject(object) {
    let objects = this.state.narrative.realm.objects;
    const idx = objects.length - 1;
    objects.splice(idx, 1);
    this.setState({ narrative: this.state.narrative });
  }

  handleEditObjectKey(object, key) {
    let objects = this.state.narrative.realm.objects;
    const idx = objects.indexOf(object);
    objects[idx].key = key;
    this.setState({ narrative: this.state.narrative });
  }

  makeSaveFileName() {
    return this.state.narrative.title + ".json";
  }

  makeSaveFileContent() {
    const str = JSON.stringify(this.state.narrative, null, 2);
    return "data:application/json;charset=utf-8," + encodeURI(str);
  }

  render() {
    return (
      <NarrativeContext.Provider value={this.state.narrative}>
        <div id="menu-box" className="horizontal-layout">
          <img src="narrative40.png" alt="Logo" className="menu-item" />
          <div className="menu-item horizontal-fill">
            <StringEditor
              id="narrative-title"
              className="title-editor"
              value={this.state.narrative.title}
              onEdit={(v) => { this.state.narrative.title = v; this.setState(this.state.narrative); }} />
            <StringEditor
              id="narrative-author"
              className="author-editor"
              value={this.state.narrative.author}
              onEdit={(v) => { this.state.narrative.author = v; this.setState(this.state.narrative); }} />
          </div>
          <div id="menu-button-box">
            <button
              className="menu-item menu-button"
              onClick={() => { this.handleNew() }}>
              New
            </button>
            <button
              className="menu-item menu-button"
              onClick={() => { this.loadFile.current.click() }}>
              <input
                id="narrative-load-file"
                ref={this.loadFile}
                hidden
                type="file"
                accept=".json"
                multiple={false}
                onChange={(e) => { this.handleLoad(e) }} />
              Load..
            </button>
            <button
              className="menu-item menu-button"
              onClick={() => { this.saveFile.current.click() }}>
              <a
                id="narrative-save-file"
                ref={this.saveFile}
                hidden
                href={this.makeSaveFileContent()}
                download={this.makeSaveFileName()}>
                Save
              </a>
              Save..
            </button>
          </div>
        </div>
        <div className="editor-box">
          <ResizePanel direction="e" style={{ flexGrow: '1', width: '800px' }}>
            <div className="editor">
              <header className="horizontal-layout fixed-title">
                <img src="realm18.png" alt="Realm Icon" />
                <h2 className="header-item">Realm</h2>
              </header>
              <div className="realm-entities-box">
                <header className="horizontal-layout">
                  <img src="entities18.png" alt="Entities Icon" className="header-item" />
                  <h3 className="header-item">Entities</h3>
                  <button
                    title="Add"
                    className="header-item title-button"
                    onClick={() => { this.handleAddEntity() }}>
                    +</button>
                  <button
                    title="Del"
                    className="header-item title-button"
                    onClick={() => { this.handleDelEntity() }}>
                    -</button>
                </header>
                <ul>
                  {this.state.narrative.realm.entities.map(entry => (
                    <EntityEditor
                      id={entry.key}
                      key={entry.key}
                      name={entry.key}
                      entity={entry.value}
                      setEntity={(entity) => { this.setState({ narrative: this.state.narrative }) }}
                      onKeyChange={(key) => { this.handleEditEntityKey(entry, key) }}
                    />))}
                </ul>
              </div>
              <div className="realm-objects-box">
                <header className="horizontal-layout">
                  <img src="objects18.png" alt="Objects Icon" className="header-item" />
                  <h3 className="header-item">Objects</h3>
                  <button
                    title="Add"
                    className="header-item title-button"
                    onClick={() => { this.handleAddObject() }}>
                    +</button>
                  <button
                    title="Del"
                    className="header-item title-button"
                    onClick={() => { this.handleDelObject() }}>
                    -</button>
                </header>
                <ul>
                  {this.state.narrative.realm.objects.map(entry => (
                    <ObjectEditor
                      id={entry.key}
                      key={entry.key}
                      name={entry.key}
                      object={entry.value}
                      setObject={(object) => { this.setState({ narrative: this.state.narrative }) }}
                      onKeyChange={(key) => { this.handleEditObjectKey(entry, key) }}
                    />))}
                </ul>
              </div>
            </div>
          </ResizePanel>
          <div className="editor">
            <Graph
              sections={this.state.narrative.sections}
              onAddEdge={(frNode, toNode) => { this.handleAddDecision(frNode, toNode); }}
              onDeleteEdge={(node, edge) => { this.handleDelDecision(node, edge); }}
              onSelectEdge={(node, edge) => { this.sectionRefs[node.key].scrollIntoView({ block: 'center', behavior: 'instant' }); }}
              onAddNode={(position) => { this.handleAddSection(position); }}
              onEditNode={(node, position) => { this.handleEditSection(node, position); }}
              onDeleteNode={(node) => { this.handleDelSection(node); }}
              onSelectNode={(node) => { this.sectionRefs[node.key].scrollIntoView({ block: 'center', behavior: 'instant' }); }} />
          </div>
          <ResizePanel direction="w" style={{ flexGrow: '1', width: '800px' }}>
            <div className="editor">
              <header className="horizontal-layout  fixed-title">
                <img src="sections18.png" alt="Sections Icon" className="header-item" />
                <h2 className="header-item">Sections</h2>
              </header>
              <ul>
                {this.state.narrative.sections.map(entry => (
                  <SectionEditor
                    id={entry.key}
                    key={entry.key}
                    ref={(element) => { this.sectionRefs[entry.key] = element; }}
                    title={entry.key}
                    section={entry.value}
                    setSection={(section) => { this.setState({ narrative: this.state.narrative }) }}
                    onKeyChange={(key) => { this.handleEditSectionKey(entry, key) }}
                  />))}
              </ul>
            </div>
          </ResizePanel>
        </div>
      </NarrativeContext.Provider>
    );
  }
}
