import React, { useCallback, useMemo, useRef, useState } from "react";
import ReactFlow, {
  //addEdge,
  Controls,
  Background,
  BackgroundVariant,
  Panel,
  //useNodesState,
  //useEdgesState,
  MarkerType,
  ReactFlowProvider
} from "reactflow";

export default function OverviewFlow(props) {
  const reactFlowWrapper = useRef(null);
  const nodeTemplate = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  //const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  //const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  //const onConnect = useCallback(
  //  (params) => setEdges((eds) => addEdge(params, eds)),
  //  []
  //);

  const nodes = useMemo(() => {
    return props.sections.map(entry => ({
      id: entry.key,
      targetPosition: 'top',
      sourcePosition: 'bottom',
      data: {
        label: entry.key,
        ref: entry
      },
      position: entry.position
    }));
  }, [props]);

  const edges = useMemo(() => {
    let edges = [];
    for (const entry of props.sections) {
      for (const decision of entry.value.decisions) {
        edges.push({
          id: entry.key + "_" + decision.targetSection,
          source: entry.key,
          target: decision.targetSection,
          label: decision.text.substr(0, 16),
          data: {
            sourceRef: entry,
            ref: decision
          },
          markerEnd: {
            type: MarkerType.ArrowClosed
          }
        });
      }
    }
    return edges;
  }, [props]);

  const onNodesChange = useCallback((changes) => {
    for (const change of changes) {
      switch (change.type) {
        case "position":
          if (change.dragging) {
            let index = nodes.findIndex(node => node.id === change.id);
            props.onEditNode(nodes[index].data.ref, change.position);
          }
          break;
        case "select":
          if (change.selected) {
            let index = nodes.findIndex(node => node.id === change.id);
            props.onSelectNode(nodes[index].data.ref);
          }
          break;
        case "remove":
          let index = nodes.findIndex(node => node.id === change.id);
          props.onDeleteNode(nodes[index].data.ref);
          break;
        default:
          break;
      }
    }
  }, [props, nodes]);

  const onEdgesChange = useCallback((changes) => {
    for (const change of changes) {
      switch (change.type) {
        case "select":
          if (change.selected) {
            let index = edges.findIndex(edge => edge.id === change.id);
            props.onSelectEdge(edges[index].data.sourceRef, edges[index].data.ref);
          }
          break;
        case "remove":
          let index = edges.findIndex(edge => edge.id === change.id);
          props.onDeleteEdge(edges[index].data.sourceRef, edges[index].data.ref);
          break;
        default:
          break;
      }
    }
  }, [props, edges]);

  const onConnect = useCallback((connection) => {
    let frIndex = nodes.findIndex(node => node.id === connection.source);
    let toIndex = nodes.findIndex(node => node.id === connection.target);
    props.onAddEdge(nodes[frIndex].data.ref, nodes[toIndex].data.ref);
  }, [props, nodes]);

  const onDragStart = useCallback((event) => {
    const nodeBounds = nodeTemplate.current.getBoundingClientRect();
    const offset = {
      x: event.clientX - nodeBounds.left,
      y: event.clientY - nodeBounds.top,
    };
    event.dataTransfer.setData('application/reactflow', JSON.stringify(offset));
    event.dataTransfer.effectAllowed = 'move';
  }, []);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((event) => {
    event.preventDefault();
    try {
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const offset = JSON.parse(event.dataTransfer.getData('application/reactflow'));
      const position = reactFlowInstance.project({
        x: event.clientX - offset.x - reactFlowBounds.left,
        y: event.clientY - offset.y - reactFlowBounds.top,
      });
      props.onAddNode(position);
    } catch (e) { }
  }, [props, reactFlowInstance]);

  return (
    <ReactFlowProvider>
      <div className="reactflow-wrapper" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onInit={setReactFlowInstance}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          proOptions={{ hideAttribution: true }}
          snapGrid={[25, 25]}
          snapToGrid
          attributionPosition="top-right"
        >
          <Panel position="top-left">
            <div className="control-panel">
              <div className="horizontal-layout">
                <span className="control-text">
                  Delete
                </span>
                <span className="control-text control-text-select">
                  Selected
                </span>
                <span className="control-text">
                  :
                </span>
                <img src="delete24.png" alt="Logo" className="control-img" />
              </div>
              <div className="node-template" ref={nodeTemplate} onDragStart={(event) => onDragStart(event)} draggable>
                Drag New Section
              </div>
            </div>
          </Panel>
          <Controls />
          <Background
            id="1"
            offset="2.2"
            lineWidth={1}
            color="#090909"
            gap={25}
            variant={BackgroundVariant.Lines}
          />
          <Background
            id="0"
            offset="2"
            lineWidth={1}
            color="#404040"
            gap={25}
            variant={BackgroundVariant.Lines}
          />
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  );
};
