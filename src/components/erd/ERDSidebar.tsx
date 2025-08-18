import React from 'react';
import { Search, Table } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TableField } from './TableNode';

export interface SidebarTable {
	name: string;
	fields: TableField[];
}

interface ERDSidebarProps {
	onAddTable: (table: SidebarTable) => void;
	dataSourceId?: string | number;
}

// Map database column types to TableField types used by the UI
function mapDbTypeToFieldType(dbType: string, columnName: string): TableField['type'] {
	const type = dbType.toLowerCase();
	const name = columnName.toLowerCase();

	if (name.includes('email')) return 'email';
	if (type.includes('timestamp') || type === 'date' || type.includes('date')) return 'date';
	if (type.includes('boolean')) return 'boolean';
	if (
		type.includes('int') ||
		type.includes('double') ||
		type.includes('numeric') ||
		type.includes('decimal') ||
		type.includes('real')
	) {
		return 'number';
	}
	return 'text';
}

export const ERDSidebar: React.FC<ERDSidebarProps> = ({ onAddTable, dataSourceId }) => {
	const [searchQuery, setSearchQuery] = React.useState('');
	const [isLoading, setIsLoading] = React.useState(false);
	const [error, setError] = React.useState<string | null>(null);
	const [tables, setTables] = React.useState<Array<{ name: string; columns: Record<string, string> }>>([]);

	React.useEffect(() => {
		let isMounted = true;
		const controller = new AbortController();
		async function fetchTables() {
			try {
				setIsLoading(true);
				setError(null);
				const id = dataSourceId ?? 501;
				const res = await fetch(`https://data.coreoutline.com/get-db-structure?data_source_id=${id}` , {
					signal: controller.signal,
				});
				if (!res.ok) throw new Error(`Failed to fetch tables (${res.status})`);
				const data = await res.json();
				const tablesJson = data?.tables ?? {};
				const parsed: Array<{ name: string; columns: Record<string, string> }> = Object.keys(tablesJson).map((tbl) => ({
					name: tbl,
					columns: tablesJson[tbl]?.columns ?? {},
				}));
				if (isMounted) setTables(parsed);
			} catch (e: any) {
				if (e?.name === 'AbortError') return;
				if (isMounted) setError(e?.message || 'Failed to load tables');
			} finally {
				if (isMounted) setIsLoading(false);
			}
		}
		fetchTables();
		return () => {
			isMounted = false;
			controller.abort();
		};
	}, [dataSourceId]);

	const filtered = React.useMemo(() => {
		return tables.filter((t) => t.name.toLowerCase().includes(searchQuery.toLowerCase()));
	}, [tables, searchQuery]);

	const handleAdd = (tbl: { name: string; columns: Record<string, string> }) => {
		const fields: TableField[] = Object.entries(tbl.columns).map(([colName, colType]) => {
			const isPrimaryKey = colName.toLowerCase() === 'id';
			const isForeignKey = !isPrimaryKey && colName.toLowerCase().endsWith('_id');
			return {
				id: colName,
				name: colName,
				type: mapDbTypeToFieldType(colType, colName),
				isPrimaryKey,
				isForeignKey,
			};
		});
		onAddTable({ name: tbl.name, fields });
	};

	return (
		<div className="w-80 bg-sidebar-bg border-r border-border flex flex-col h-full">
			{/* Header */}
			<div className="p-4 border-b border-border">
				<h2 className="text-lg font-semibold text-sidebar-text mb-3">Tables</h2>
				{/* Search */}
				<div className="relative">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder="Search tables"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="pl-10"
					/>
				</div>
			</div>

			{/* Tables List */}
			<ScrollArea className="flex-1">
				<div className="p-4 space-y-2">
					{isLoading && (
						<div className="text-sm text-muted-foreground">Loading tables…</div>
					)}
					{error && (
						<div className="text-sm text-red-500">{error}</div>
					)}
					{!isLoading && !error && filtered.length === 0 && (
						<div className="text-sm text-muted-foreground">No tables found.</div>
					)}
					{filtered.map((t) => (
						<div
							key={t.name}
							className="group p-3 rounded-lg bg-sidebar-item hover:bg-sidebar-item-hover transition-colors cursor-pointer border border-transparent hover:border-border"
							onClick={() => handleAdd(t)}
						>
							<div className="flex items-center gap-3">
								<div className="text-primary flex-shrink-0">
									<Table className="h-4 w-4" />
								</div>
								<div className="flex-1 min-w-0">
									<div className="font-medium text-sidebar-text text-sm group-hover:text-primary transition-colors">
										{t.name}
									</div>
									<div className="text-xs text-muted-foreground mt-1 line-clamp-2">
										{Object.keys(t.columns).length} columns
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</ScrollArea>
		</div>
	);
};