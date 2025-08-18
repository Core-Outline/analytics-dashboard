import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Loader2, Search } from "lucide-react";
import { cn } from "../lib/utils";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "../components/ui/alert";
import { IntegrationCard } from "../components/integration-card";
import { type Integration } from "../../shared/schema";
import { useLocation } from "react-router-dom";

const categories = [
  { id: "all", label: "All integrations" },
  { id: "database", label: "Database" },
  { id: "ads", label: "Ads" },
  { id: "social", label: "Social Media" },
  { id: "payments", label: "Payments" },
  { id: "files", label: "File Sources" },
  { id: "apps", label: "App Stores" },
  { id: "communication", label: "Communication" },
  { id: "analytics", label: "Analytics" },
];

// Type for the API response item
interface ApiIntegration {
  organization_id: string;
  name: string;
  data_source_id: number;
  query_id: number;
  data_source_type: string;
  queries: string;
  query_type: string;
}

// Map API data source types to our category system
const getCategoryFromDataSource = (dataSourceType: string): string => {
  switch (dataSourceType) {
    case 'mongodb':
    case 'postgresql':
      return 'database';
    case 'twitter':
      return 'social';
    default:
      return 'apps'; // Default category
  }
};

// Map data source types to display names and icons
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
    case 'social_media':
      return {
        name: 'Social Media',
        iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/twitter/twitter-original.svg',
        iconName: 'users',
        iconColor: 'text-blue-500',
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

export default function Integrations() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const organization_id = searchParams.get('organization_id');


  // Fetch integrations from the API
  const { data: apiIntegrations = [], isLoading, error } = useQuery<ApiIntegration[]>({
    queryKey: ['integrations'],
    queryFn: async () => {
      const response = await fetch(`https://data.coreoutline.com/queries?company=${organization_id}&query_type`);
      if (!response.ok) {
        throw new Error('Failed to fetch integrations');
      }
      return response.json();
    },
  });

  // Transform API data to match Integration type
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
      } as Integration;
    });
  }, [apiIntegrations]);

  // Filter integrations by category and search query
  const filteredIntegrations = useMemo(() => {
    return integrations.filter(integration => {
      const matchesCategory = activeCategory === "all" || integration.category === activeCategory;
      const matchesSearch = integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         integration.displayName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [integrations, activeCategory, searchQuery]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <span className="mt-2 text-gray-600">Loading integrations...</span>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="text-center py-12">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load integrations. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const handleToggle = (id: string, enabled: boolean) => {
    console.log(`Toggled integration ${id} to ${enabled ? 'enabled' : 'disabled'}`);
    // Here you would typically make an API call to update the integration status
  };

  const handleConfigure = (id: string) => {
    console.log(`Configure integration ${id}`);
    // Here you would typically open a configuration dialog or navigate to settings
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Integrations</h1>
        <p className="text-gray-600">Connect and manage your data sources</p>
      </div>

      {/* Search and filter */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search integrations..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "outline"}
              className={cn(
                "rounded-full",
                activeCategory === category.id
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              )}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Integration cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredIntegrations.map((integration) => (
          <IntegrationCard 
            key={integration.id} 
            integration={integration}
            onToggle={handleToggle}
            onConfigure={handleConfigure}
          />
        ))}
      </div>

      {filteredIntegrations.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No integrations found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
//   if (error) {
//     return (
//       <div className="p-4 text-red-600 bg-red-100 rounded-md">
//         Error loading integrations: {error.message}
//       </div>
//     );
//   }
  

//   const toggleMutation = useMutation({
//     mutationFn: async ({ id, enabled }: { id: string; enabled: boolean }) => {
//       const response = await apiRequest("PATCH", `/api/integrations/${id}`, { enabled });
//       return response.json();
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["integrations"] });
//     },
//     onError: (error: Error) => {
//       console.error("Failed to update integration status:", error);
//     },
//   });

//   const filteredIntegrations = useMemo(() => {
//     let filtered = integrations;

//     // Filter by category
//     if (activeCategory !== "all") {
//       filtered = filtered.filter(integration => integration.category === activeCategory);
//     }

//     // Filter by search query
//     if (searchQuery) {
//       const query = searchQuery.toLowerCase();
//       filtered = filtered.filter(integration =>
//         integration.name.toLowerCase().includes(query) ||
//         integration.description.toLowerCase().includes(query)
//       );
//     }

//     return filtered;
//   }, [integrations, activeCategory, searchQuery]);

//   const handleToggle = (id: string, enabled: boolean) => {
//     toggleMutation.mutate({ id, enabled });
//   };

//   const handleConfigure = (id: string) => {
//     console.log(`Configuring integration: ${id}`);
//     // Here you would typically open a configuration dialog or navigate to a configuration page
//   };

//   // if (isLoading) {
    
    
//   //   return (
//   //     <div className="min-h-screen bg-gray-50">
//   //       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//   //         <div className="animate-pulse">
//   //           <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
//   //           <div className="h-4 bg-gray-200 rounded w-96 mb-8"></div>
//   //           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//   //             {Array.from({ length: 6 }).map((_, i) => (
//   //               <div key={i} className="bg-white rounded-lg border border-gray-200 p-6">
//   //                 <div className="flex items-start justify-between mb-4">
//   //                   <div className="flex items-center">
//   //                     <div className="w-10 h-10 bg-gray-200 rounded-lg mr-4"></div>
//   //                     <div className="h-6 bg-gray-200 rounded w-24"></div>
//   //                   </div>
//   //                 </div>
//   //                 <div className="space-y-2 mb-6">
//   //                   <div className="h-4 bg-gray-200 rounded"></div>
//   //                   <div className="h-4 bg-gray-200 rounded w-3/4"></div>
//   //                 </div>
//   //                 <div className="flex items-center justify-between">
//   //                   <div className="h-8 bg-gray-200 rounded w-20"></div>
//   //                   <div className="h-6 bg-gray-200 rounded w-12"></div>
//   //                 </div>
//   //               </div>
//   //             ))}
//   //           </div>
//   //         </div>
//   //       </div>
//   //     </div>
//   //   );
//   // }

//   return (
//     <div className="min-h-screen bg-gray-50" data-testid="page-integrations">
//       <header className="bg-white border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           <div className="mb-8">
//             <h1 className="text-2xl font-semibold text-gray-900 mb-2" data-testid="text-page-title">
//               Integrations
//             </h1>
//             <p className="text-gray-600" data-testid="text-page-subtitle">
//               Supercharge your workflow - connect tools you use.
//             </p>
//           </div>
          
//           <nav className="flex space-x-8 mb-6 overflow-x-auto" data-testid="nav-categories">
//             {categories.map((category) => (
//               <Button
//                 key={category.id}
//                 variant="ghost"
//                 className={cn(
//                   "tab-button pb-2 px-1 text-sm font-medium border-b-2 whitespace-nowrap",
//                   activeCategory === category.id
//                     ? "text-primary border-primary"
//                     : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
//                 )}
//                 onClick={() => setActiveCategory(category.id)}
//                 data-testid={`button-category-${category.id}`}
//               >
//                 {category.label}
//               </Button>
//             ))}
//           </nav>
          
//           <div className="relative max-w-md">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <Search className="h-4 w-4 text-gray-400" />
//             </div>
//             <Input
//               type="text"
//               placeholder="Search"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="pl-10"
//               data-testid="input-search"
//             />
//           </div>
//         </div>
//       </header>
      
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {filteredIntegrations.length === 0 ? (
//           <div className="text-center py-12" data-testid="text-no-results">
//             <p className="text-gray-500 text-lg">No integrations found</p>
//             <p className="text-gray-400 text-sm mt-2">
//               Try adjusting your search or category filter
//             </p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" data-testid="grid-integrations">
//             {filteredIntegrations.map((integration) => (
//               <IntegrationCard
//                 key={integration.id}
//                 integration={integration}
//                 onToggle={handleToggle}
//                 onConfigure={handleConfigure}
//               />
//             ))}
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }
