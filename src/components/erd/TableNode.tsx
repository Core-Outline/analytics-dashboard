import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { 
  User, 
  Mail, 
  Hash, 
  Calendar, 
  ToggleLeft, 
  Building, 
  FileText, 
  BarChart3,
  ArrowUpRight 
} from 'lucide-react';

export interface TableField {
  id: string;
  name: string;
  type: 'text' | 'email' | 'number' | 'date' | 'boolean' | 'relation';
  isPrimaryKey?: boolean;
  isForeignKey?: boolean;
}

export interface TableNodeData extends Record<string, unknown> {
  label: string;
  fields: TableField[];
  onFieldClick?: (fieldId: string, fieldName: string, tableName: string) => void;
}

interface TableNodeProps {
  data: TableNodeData;
  id: string;
  onFieldClick?: (fieldId: string, fieldName: string, tableName: string) => void;
}

const getFieldIcon = (type: TableField['type']) => {
  const iconClass = "h-4 w-4";
  switch (type) {
    case 'text':
      return <FileText className={iconClass} />;
    case 'email':
      return <Mail className={iconClass} />;
    case 'number':
      return <Hash className={iconClass} />;
    case 'date':
      return <Calendar className={iconClass} />;
    case 'boolean':
      return <ToggleLeft className={iconClass} />;
    case 'relation':
      return <ArrowUpRight className={iconClass} />;
    default:
      return <FileText className={iconClass} />;
  }
};

const getFieldColor = (type: TableField['type']) => {
  switch (type) {
    case 'text':
      return 'text-field-text';
    case 'email':
      return 'text-field-email';
    case 'number':
      return 'text-field-number';
    case 'date':
      return 'text-field-date';
    case 'boolean':
      return 'text-field-boolean';
    case 'relation':
      return 'text-field-relation';
    default:
      return 'text-field-text';
  }
};

export const TableNode = memo(({ data, id, onFieldClick }: TableNodeProps) => {
  return (
    <div className="bg-erd-table border border-erd-table-border rounded-lg shadow-lg min-w-[280px] overflow-hidden">
      {/* Table Header */}
      <div className="bg-erd-table-header text-erd-table-header-foreground px-4 py-3 font-semibold text-sm">
        {data.label}
      </div>
      
      {/* Table Fields */}
      <div className="divide-y divide-erd-table-border">
        {data.fields.map((field, index) => (
          <div 
            key={field.id} 
            className="relative flex items-center px-4 py-2 hover:bg-muted/50 transition-colors group cursor-pointer"
            onClick={() => data.onFieldClick?.(field.id, field.name, data.label)}
          >
            {/* Left handle for connecting FROM this field */}
            <Handle
              type="source"
              position={Position.Left}
              id={`${id}-${field.id}-source`}
              className="!w-3 !h-3 !bg-connection-line !border-2 !border-background opacity-0 group-hover:opacity-100 transition-opacity !left-0"
            />
            
            {/* Right handle for connecting TO this field */}
            <Handle
              type="target"
              position={Position.Right}
              id={`${id}-${field.id}-target`}
              className="!w-3 !h-3 !bg-connection-line !border-2 !border-background opacity-0 group-hover:opacity-100 transition-opacity !right-0"
            />
            
            <div className={`${getFieldColor(field.type)} mr-3 flex-shrink-0`}>
              {getFieldIcon(field.type)}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground truncate">
                  {field.name}
                </span>
                {field.isPrimaryKey && (
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded font-medium">
                    PK
                  </span>
                )}
                {field.isForeignKey && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-medium">
                    FK
                  </span>
                )}
              </div>
              <div className="text-xs text-muted-foreground capitalize">
                {field.type}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

TableNode.displayName = 'TableNode';