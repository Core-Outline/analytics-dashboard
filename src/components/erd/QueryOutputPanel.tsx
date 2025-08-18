import React from 'react';
import { Copy, Download, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { FieldConfig } from './FieldConfigPanel';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface QueryOutput {
  includeFields: string[];
  referenceTables: Array<{
    name: string;
    joinType: string;
    join?: {
      table: string;
      leftColumn: string;
      rightColumn: string;
    };
  }>;
  joins: any[];
  filters: Array<{
    field: string;
    operator: string;
    value: string;
  }>;
  calculations: Array<{
    expression?: string;
    alias?: string;
    field?: string;
    operation?: string;
    withField?: string;
  }>;
  aggregations: Array<{
    field: string;
    function: string;
    alias?: string;
  }>;
  groupBy: string[];
  sortBy: Array<{
    field: string;
    direction: string;
    priority: number;
  }>;
}

interface QueryOutputPanelProps {
  fieldConfigs: Map<string, FieldConfig>;
  tableNames: string[];
  referenceTables?: Array<{
    name: string;
    joinType: string;
    join?: { table: string; leftColumn: string; rightColumn: string };
  }>;
  isOpen: boolean;
  onClose: () => void;
  onCreate?: (payload: { request: QueryOutput }) => Promise<void> | void;
  queryType?: string;
  onQueryTypeChange?: (value: string) => void;
}

export const QueryOutputPanel: React.FC<QueryOutputPanelProps> = ({
  fieldConfigs,
  tableNames,
  referenceTables,
  isOpen,
  onClose,
  onCreate,
  queryType = 'transactions',
  onQueryTypeChange,
}) => {
  const generateOutput = (): QueryOutput => {
    const output: QueryOutput = {
      includeFields: [],
      referenceTables: [],
      joins: [],
      filters: [],
      calculations: [],
      aggregations: [],
      groupBy: [],
      sortBy: [],
    };

    // Process field configurations
    fieldConfigs.forEach((config) => {
      // Include fields
      if (config.isIncluded) {
        let fieldExpression = `${config.tableName}.${config.fieldName}`;
        
        if (config.aggregation) {
          const aggAlias = config.aggregation.alias || `${config.aggregation.type.toLowerCase()}_${config.fieldName}`;
          fieldExpression = `${config.aggregation.type}(${fieldExpression}) AS ${aggAlias}`;
          
          output.aggregations.push({
            field: `${config.tableName}.${config.fieldName}`,
            function: config.aggregation.type,
            alias: config.aggregation.alias,
          });
        } else if (config.alias) {
          fieldExpression += ` AS ${config.alias}`;
        }
        
        output.includeFields.push(fieldExpression);
      }

      // Calculations (keep current structure)
      if (config.calculation?.expression && config.calculation?.alias) {
        output.calculations.push({
          expression: config.calculation.expression,
          alias: config.calculation.alias,
        });
        
        if (config.isIncluded) {
          output.includeFields.push(`${config.calculation.expression} AS ${config.calculation.alias}`);
        }
      }

      // Filters
      if (config.filter?.operator && config.filter?.value) {
        output.filters.push({
          field: `${config.tableName}.${config.fieldName}`,
          operator: config.filter.operator,
          value: config.filter.value,
        });
      }

      // Group by
      if (config.groupBy) {
        output.groupBy.push(`${config.tableName}.${config.fieldName}`);
      }

      // Sort by
      if (config.sortBy?.direction) {
        output.sortBy.push({
          field: `${config.tableName}.${config.fieldName}`,
          direction: config.sortBy.direction,
          priority: config.sortBy.priority,
        });
      }
    });

    // Reference tables and joins
    if (referenceTables && referenceTables.length > 0) {
      output.referenceTables = referenceTables;
    } else {
      tableNames.forEach((tableName) => {
        output.referenceTables.push({
          name: tableName,
          joinType: 'combine',
        });
      });
    }

    // Sort the sortBy array by priority
    output.sortBy.sort((a, b) => a.priority - b.priority);

    return output;
  };

  const output = generateOutput();
  const wrapped = { request: output };
  const jsonOutput = JSON.stringify(wrapped, null, 2);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(jsonOutput);
    toast.success('Query output copied to clipboard');
  };

  const downloadJson = () => {
    const blob = new Blob([jsonOutput], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'query-config.json';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Query configuration downloaded');
  };

  const handleCreateClick = async () => {
    try {
      if (onCreate) {
        await onCreate({ request: output });
      }
    } finally {
      onClose();
    }
  };

  if (!isOpen) return null;

  const typeOptions = [
    { value: 'transactions', label: 'Transactions' },
    { value: 'customer', label: 'Customers' },
    { value: 'subscriptions', label: 'Subscriptions' },
    { value: 'twitter_account', label: 'Twitter Account' },
    { value: 'facebook_account', label: 'Facebook Account' },
    { value: 'instagram_account', label: 'Instagram Account' },
    { value: 'linkedin_account', label: 'LinkedIn Account' },
    { value: 'tiktok_account', label: 'TikTok Account' },
    { value: 'competitor_query', label: 'Social Media Search (Competitor)' },
    { value: 'account_query', label: 'Social Media Search (Account)' },
    { value: 'user_product_interaction', label: 'User-Product Interaction' },
    { value: 'product_catalog', label: 'Product Catalog' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-[800px] max-h-[80vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Query Configuration Output
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ×
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Button onClick={copyToClipboard} variant="outline" size="sm">
              <Copy className="h-4 w-4 mr-2" />
              Copy to Clipboard
            </Button>
            <Button onClick={downloadJson} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download JSON
            </Button>
            <div className="ml-auto flex items-center gap-2">
              <Select value={queryType} onValueChange={onQueryTypeChange}>
                <SelectTrigger className="w-[260px]">
                  <SelectValue placeholder="Select query type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="select" disabled>
                    Select a query type
                  </SelectItem>
                  {typeOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleCreateClick} size="sm">
                Create
              </Button>
            </div>
          </div>
          
          <Textarea
            value={jsonOutput}
            readOnly
            className="font-mono text-sm min-h-[400px] max-h-[50vh]"
            placeholder="Your query configuration will appear here..."
          />
          
          <div className="text-xs text-muted-foreground">
            <p><strong>Fields configured:</strong> {fieldConfigs.size}</p>
            <p><strong>Tables referenced:</strong> {output.referenceTables.length}</p>
            <p><strong>Aggregations:</strong> {output.aggregations.length}</p>
            <p><strong>Filters:</strong> {output.filters.length}</p>
            <p><strong>Calculations:</strong> {output.calculations.length}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};