import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { IntegrationCard } from '@/components/integration-card';
import { type Integration } from '../../shared/schema';
import { ERDModal } from './erd/ERDModal';
import { QueryOutputPanel } from './erd/QueryOutputPanel';
import { toast } from 'sonner';

interface ApiIntegration {
  organization_id: string;
  name: string;
  data_source_id: number;
  query_id: number;
  data_source_type: string;
  queries: string;
  query_type: string;
}

const getCategoryFromDataSource = (dataSourceType: string): string => {
  switch (dataSourceType) {
    case 'mongodb':
    case 'postgresql':
      return 'database';
    case 'twitter':
      return 'social';
    default:
      return 'apps';
  }
};

const getIntegrationDetails = (dataSourceType: string) => {
  switch (dataSourceType) {
    case 'mongodb':
      return {
        name: 'MongoDB',
        iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
        iconName: 'database',
        iconColor: 'text-green-600',
        iconBgColor: 'bg-green-100',
      };
    case 'postgresql':
      return {
        name: 'PostgreSQL',
        iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
        iconName: 'server',
        iconColor: 'text-indigo-600',
        iconBgColor: 'bg-indigo-100',
      };
    case 'twitter':
      return {
        name: 'Twitter',
        iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/twitter/twitter-original.svg',
        iconName: 'twitter',
        iconColor: 'text-blue-400',
        iconBgColor: 'bg-blue-100',
      };
    default:
      return {
        name: dataSourceType,
        iconUrl: '',
        iconName: 'box',
        iconColor: 'text-gray-600',
        iconBgColor: 'bg-gray-100',
      };
  }
};

export const CreateQueryFlow: React.FC = () => {
  const [integrationsOpen, setIntegrationsOpen] = useState(false);
  const [erdOpen, setErdOpen] = useState(false);
  const [outputOpen, setOutputOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selected, setSelected] = useState<{ dataSourceId: string; type: string } | null>(null);

  const { data: apiIntegrations = [] } = useQuery<ApiIntegration[]>({
    queryKey: ['integrations'],
    queryFn: async () => {
      const response = await fetch('https://data.coreoutline.com/queries?company=101&query_type');
      if (!response.ok) throw new Error('Failed to fetch integrations');
      return response.json();
    },
  });

  const integrations = useMemo(() => {
    return apiIntegrations.map((apiInt) => {
      const details = getIntegrationDetails(apiInt.data_source_type);
      return {
        id: `integration-${apiInt.query_id}`,
        name: details.name,
        displayName: apiInt.name,
        description: `${apiInt.query_type || 'N/A'}`,
        category: getCategoryFromDataSource(apiInt.data_source_type),
        iconUrl: details.iconUrl,
        iconName: details.iconName,
        iconColor: details.iconColor,
        iconBgColor: details.iconBgColor,
        enabled: true,
        dataSourceId: apiInt.data_source_id.toString(),
        connectionType: 'database',
        dataSourceType: apiInt.data_source_type,
      } as Integration & { dataSourceType: string };
    });
  }, [apiIntegrations]);

  const filteredIntegrations = useMemo(() => {
    return integrations.filter((integration) =>
      integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      integration.displayName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [integrations, searchQuery]);

  const handleConfigure = (id: string) => {
    const match = integrations.find((i) => i.id === id) as (Integration & { dataSourceType: string }) | undefined;
    if (!match) return;
    setSelected({ dataSourceId: match.dataSourceId, type: match.dataSourceType });
    setIntegrationsOpen(false);
    setErdOpen(true);
  };

  const handleCreate = async (payload: { request: any; type?: string }) => {
    if (!selected) return;
    const finalType = payload.type || 'transactions';
    try {
      const res = await fetch('https://api.coreoutline.com/query/create-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data_source_id: selected.dataSourceId,
          queries: payload,
          type: finalType,
        }),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(text || `Request failed (${res.status})`);
      }
      toast.success('Query created successfully');
    } catch (e) {
      console.error(e);
      toast.error('Failed to create query');
    }
  };

  return (
    <>
      <Button onClick={() => setIntegrationsOpen(true)} variant="default">Create Query</Button>

      <Dialog open={integrationsOpen} onOpenChange={setIntegrationsOpen}>
        <DialogContent className="max-w-8xl w-[95vw] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Select an Integration</DialogTitle>
          </DialogHeader>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search integrations..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredIntegrations.map((integration) => (
              <IntegrationCard
                key={integration.id}
                integration={integration}
                onToggle={() => {}}
                onConfigure={handleConfigure}
                forceOnConfigure
              />
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Optional: expose the output panel here with create handler if we want to trigger create outside ERD too */}
      {/* <QueryOutputPanel ... onCreate={handleCreate} /> */}

      <ERDModal open={erdOpen} onOpenChange={setErdOpen} dataSourceId={selected?.dataSourceId} onCreate={handleCreate} />
    </>
  );
};

export default CreateQueryFlow; 