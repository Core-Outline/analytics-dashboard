import React, { useCallback, useMemo, useState } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { TableNode, TableNodeData } from './TableNode';
import { ERDSidebar, SidebarTable } from './ERDSidebar';
import { FieldConfigPanel, FieldConfig } from './FieldConfigPanel';
import { QueryOutputPanel } from './QueryOutputPanel';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { toast } from 'sonner';

const nodeTypes = {
  table: TableNode,
};

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

interface ERDCanvasProps {
  dataSourceId?: string | number;
  onCreate?: (payload: { request: any; type?: string }) => Promise<void> | void;
}

export const ERDCanvas: React.FC<ERDCanvasProps> = ({ dataSourceId, onCreate }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [nodeId, setNodeId] = useState(1);
  const [fieldConfigs, setFieldConfigs] = useState<Map<string, FieldConfig>>(new Map());
  const [selectedField, setSelectedField] = useState<FieldConfig | null>(null);
  const [isConfigPanelOpen, setIsConfigPanelOpen] = useState(false);
  const [isOutputPanelOpen, setIsOutputPanelOpen] = useState(false);
  const [queryType, setQueryType] = useState<string>('transactions');

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge: Edge = {
        ...params,
        id: `edge-${Date.now()}`,
        type: 'smoothstep',
        style: { stroke: 'hsl(var(--connection-line))', strokeWidth: 2 },
        markerEnd: {
          type: 'arrowclosed' as const,
          color: 'hsl(var(--connection-line))',
        },
        source: params.source!,
        target: params.target!,
        sourceHandle: params.sourceHandle,
        targetHandle: params.targetHandle,
      };
      
      setEdges((eds) => addEdge(newEdge, eds));
      toast.success('Connection created between tables');
    },
    [setEdges]
  );

  const onFieldClick = useCallback((fieldId: string, fieldName: string, tableName: string) => {
    const configKey = `${tableName}.${fieldName}`;
    const existingConfig = fieldConfigs.get(configKey);
    
    const config: FieldConfig = existingConfig || {
      fieldId,
      fieldName,
      tableName,
      isIncluded: true,
      groupBy: false,
    };
    
    setSelectedField(config);
    setIsConfigPanelOpen(true);
  }, [fieldConfigs]);

  const onSaveFieldConfig = useCallback((config: FieldConfig) => {
    const configKey = `${config.tableName}.${config.fieldName}`;
    setFieldConfigs(prev => new Map(prev).set(configKey, config));
    toast.success(`Configuration saved for ${config.tableName}.${config.fieldName}`);
  }, []);

  const onAddTable = useCallback((table: SidebarTable) => {
    const newNode: Node = {
      id: `table-${nodeId}`,
      type: 'table',
      position: { 
        x: 100 + (nodeId % 3) * 320, 
        y: 100 + Math.floor(nodeId / 3) * 200 
      },
      data: {
        label: table.name,
        fields: table.fields,
        onFieldClick,
      } as TableNodeData & { onFieldClick: typeof onFieldClick },
    };

    setNodes((nds) => [...nds, newNode]);
    setNodeId((id) => id + 1);
    toast.success(`Added ${table.name} table to canvas`);
  }, [nodeId, setNodes, onFieldClick]);

  const getTableNames = useCallback(() => {
    return nodes.map(node => node.data.label as string);
  }, [nodes]);

  const referenceTablesWithJoins = useMemo(() => {
    type Join = { table: string; leftColumn: string; rightColumn: string };
    type Entry = { name: string; joinType: string; join?: Join };

    const entries: Entry[] = [];

    const nodeById = new Map(nodes.map(n => [n.id, n] as const));

    function extractFieldId(handleId: string | null | undefined, nodeId: string): string | null {
      if (!handleId) return null;
      const prefix = `${nodeId}-`;
      if (!handleId.startsWith(prefix)) return null;
      const remainder = handleId.slice(prefix.length);
      // remainder looks like `${fieldId}-source` or `${fieldId}-target`
      const parts = remainder.split('-');
      // remove the last part (source/target)
      parts.pop();
      return parts.join('-');
    }

    edges.forEach((e) => {
      const sourceNode = nodeById.get(e.source!);
      const targetNode = nodeById.get(e.target!);
      if (!sourceNode || !targetNode) return;
      const leftTable = sourceNode.data.label as string;
      const rightTable = targetNode.data.label as string;
      const leftColumn = extractFieldId(e.sourceHandle, sourceNode.id);
      const rightColumn = extractFieldId(e.targetHandle, targetNode.id);
      if (!leftColumn || !rightColumn) return;

      // Add both directions
      entries.push({ name: leftTable, joinType: 'combine', join: { table: rightTable, leftColumn, rightColumn } });
      entries.push({ name: rightTable, joinType: 'combine', join: { table: leftTable, leftColumn: rightColumn, rightColumn: leftColumn } });
    });

    // Ensure all tables appear at least once
    const present = new Set(entries.map(en => en.name));
    getTableNames().forEach((t) => {
      if (!present.has(t)) entries.push({ name: t, joinType: 'combine' });
    });

    return entries;
  }, [edges, nodes, getTableNames]);

  return (
    <div className="flex h-screen w-full">
      <ERDSidebar onAddTable={onAddTable} dataSourceId={dataSourceId} />
      
      <div className="flex-1 relative">
        {/* Toolbar */}
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <Button
            onClick={() => setIsOutputPanelOpen(true)}
            variant="outline"
            size="sm"
            className="bg-background/80 backdrop-blur-sm border shadow-sm"
          >
            <Eye className="h-4 w-4 mr-2" />
            View Output
          </Button>
        </div>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          style={{ backgroundColor: 'hsl(var(--erd-canvas))' }}
          connectionLineStyle={{
            stroke: 'hsl(var(--connection-hover))',
            strokeWidth: 2,
          }}
          defaultEdgeOptions={{
            style: { stroke: 'hsl(var(--connection-line))', strokeWidth: 2 },
          }}
        >
          <Controls 
            style={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
            }}
          />
          <Background 
            variant={BackgroundVariant.Dots}
            gap={20}
            size={1}
            color="hsl(var(--muted-foreground))"
          />
        </ReactFlow>
        
        <FieldConfigPanel
          config={selectedField}
          isOpen={isConfigPanelOpen}
          onClose={() => {
            setIsConfigPanelOpen(false);
            setSelectedField(null);
          }}
          onSave={onSaveFieldConfig}
        />
        
        <QueryOutputPanel
          fieldConfigs={fieldConfigs}
          tableNames={getTableNames()}
          referenceTables={referenceTablesWithJoins}
          isOpen={isOutputPanelOpen}
          onClose={() => setIsOutputPanelOpen(false)}
          onCreate={async (payload) => { await onCreate?.({ ...payload, type: queryType }); }}
          queryType={queryType}
          onQueryTypeChange={setQueryType}
        />
      </div>
    </div>
  );
};