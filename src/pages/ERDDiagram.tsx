import React from 'react';
import { ERDCanvas } from '../components/erd/ERDCanvas';

const ERDDiagram: React.FC = () => {
  const params = new URLSearchParams(window.location.search);
  const dataSourceId = params.get('data_source_id') ?? undefined;
  return (
    <main className="h-screen w-full overflow-hidden bg-background">
      <ERDCanvas dataSourceId={dataSourceId ?? undefined} />
    </main>
  );
};

export default ERDDiagram;