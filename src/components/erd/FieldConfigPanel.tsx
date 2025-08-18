import React from 'react';
import { X, Calculator, Filter, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';

export interface FieldConfig {
  fieldId: string;
  fieldName: string;
  tableName: string;
  alias?: string;
  isIncluded: boolean;
  aggregation?: {
    type: 'COUNT' | 'SUM' | 'AVG' | 'MIN' | 'MAX' | 'DISTINCT';
    alias?: string;
  };
  calculation?: {
    expression: string;
    alias: string;
  };
  filter?: {
    operator: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'LIKE' | 'IN' | 'NOT IN';
    value: string;
  };
  groupBy: boolean;
  sortBy?: {
    direction: 'ASC' | 'DESC';
    priority: number;
  };
}

interface FieldConfigPanelProps {
  config: FieldConfig | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: FieldConfig) => void;
}

export const FieldConfigPanel: React.FC<FieldConfigPanelProps> = ({
  config,
  isOpen,
  onClose,
  onSave,
}) => {
  const [localConfig, setLocalConfig] = React.useState<FieldConfig | null>(null);

  React.useEffect(() => {
    if (config) {
      setLocalConfig({ ...config });
    }
  }, [config]);

  if (!isOpen || !localConfig) return null;

  const updateConfig = (updates: Partial<FieldConfig>) => {
    setLocalConfig(prev => prev ? { ...prev, ...updates } : null);
  };

  const handleSave = () => {
    if (localConfig) {
      onSave(localConfig);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-[600px] max-h-[80vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">
            Configure Field: {localConfig.tableName}.{localConfig.fieldName}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="max-h-[60vh] overflow-y-auto">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="aggregation">Aggregate</TabsTrigger>
              <TabsTrigger value="calculation">Calculate</TabsTrigger>
              <TabsTrigger value="filter">Filter</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={localConfig.isIncluded}
                  onCheckedChange={(checked) => updateConfig({ isIncluded: checked })}
                />
                <Label>Include in output</Label>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="alias">Field Alias</Label>
                <Input
                  id="alias"
                  value={localConfig.alias || ''}
                  onChange={(e) => updateConfig({ alias: e.target.value })}
                  placeholder="Optional alias for this field"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={localConfig.groupBy}
                    onCheckedChange={(checked) => updateConfig({ groupBy: checked })}
                  />
                  <Label>Group by this field</Label>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Sort Order</Label>
                <div className="flex gap-2">
                  <Select
                    value={localConfig.sortBy?.direction || 'none'}
                    onValueChange={(value) => 
                      updateConfig({
                        sortBy: value && value !== 'none' ? { 
                          direction: value as 'ASC' | 'DESC', 
                          priority: localConfig.sortBy?.priority || 1 
                        } : undefined
                      })
                    }
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="No sorting" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No sorting</SelectItem>
                      <SelectItem value="ASC">Ascending</SelectItem>
                      <SelectItem value="DESC">Descending</SelectItem>
                    </SelectContent>
                  </Select>
                  {localConfig.sortBy && (
                    <Input
                      type="number"
                      className="w-20"
                      value={localConfig.sortBy.priority}
                      onChange={(e) => 
                        updateConfig({
                          sortBy: {
                            ...localConfig.sortBy,
                            priority: parseInt(e.target.value) || 1
                          }
                        })
                      }
                      placeholder="Priority"
                      min="1"
                    />
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="aggregation" className="space-y-4">
              <div className="space-y-2">
                <Label>Aggregation Function</Label>
                <Select
                  value={localConfig.aggregation?.type || 'none'}
                  onValueChange={(value) => 
                    updateConfig({
                      aggregation: value && value !== 'none' ? {
                        type: value as FieldConfig['aggregation']['type'],
                        alias: localConfig.aggregation?.alias
                      } : undefined
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="No aggregation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No aggregation</SelectItem>
                    <SelectItem value="COUNT">COUNT</SelectItem>
                    <SelectItem value="SUM">SUM</SelectItem>
                    <SelectItem value="AVG">AVERAGE</SelectItem>
                    <SelectItem value="MIN">MIN</SelectItem>
                    <SelectItem value="MAX">MAX</SelectItem>
                    <SelectItem value="DISTINCT">DISTINCT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {localConfig.aggregation && (
                <div className="space-y-2">
                  <Label htmlFor="agg-alias">Aggregation Alias</Label>
                  <Input
                    id="agg-alias"
                    value={localConfig.aggregation.alias || ''}
                    onChange={(e) => 
                      updateConfig({
                        aggregation: {
                          ...localConfig.aggregation,
                          alias: e.target.value
                        }
                      })
                    }
                    placeholder="Alias for aggregated result"
                  />
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="calculation" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="calc-expression">Calculation Expression</Label>
                <Textarea
                  id="calc-expression"
                  value={localConfig.calculation?.expression || ''}
                  onChange={(e) => 
                    updateConfig({
                      calculation: {
                        expression: e.target.value,
                        alias: localConfig.calculation?.alias || ''
                      }
                    })
                  }
                  placeholder="e.g., price * quantity, CASE WHEN ... THEN ... END"
                  rows={3}
                />
              </div>
              
              {localConfig.calculation?.expression && (
                <div className="space-y-2">
                  <Label htmlFor="calc-alias">Calculation Alias (required)</Label>
                  <Input
                    id="calc-alias"
                    value={localConfig.calculation.alias}
                    onChange={(e) => 
                      updateConfig({
                        calculation: {
                          ...localConfig.calculation,
                          alias: e.target.value
                        }
                      })
                    }
                    placeholder="Name for calculated field"
                    required
                  />
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="filter" className="space-y-4">
              <div className="space-y-2">
                <Label>Filter Operator</Label>
                <Select
                  value={localConfig.filter?.operator || 'none'}
                  onValueChange={(value) => 
                    updateConfig({
                      filter: value && value !== 'none' ? {
                        operator: value as FieldConfig['filter']['operator'],
                        value: localConfig.filter?.value || ''
                      } : undefined
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="No filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No filter</SelectItem>
                    <SelectItem value="=">=</SelectItem>
                    <SelectItem value="!=">!=</SelectItem>
                    <SelectItem value=">">&gt;</SelectItem>
                    <SelectItem value="<">&lt;</SelectItem>
                    <SelectItem value=">=">&gt;=</SelectItem>
                    <SelectItem value="<=">&lt;=</SelectItem>
                    <SelectItem value="LIKE">LIKE</SelectItem>
                    <SelectItem value="IN">IN</SelectItem>
                    <SelectItem value="NOT IN">NOT IN</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {localConfig.filter && (
                <div className="space-y-2">
                  <Label htmlFor="filter-value">Filter Value</Label>
                  <Input
                    id="filter-value"
                    value={localConfig.filter.value}
                    onChange={(e) => 
                      updateConfig({
                        filter: {
                          ...localConfig.filter,
                          value: e.target.value
                        }
                      })
                    }
                    placeholder="Value to filter by"
                  />
                </div>
              )}
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Configuration
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};