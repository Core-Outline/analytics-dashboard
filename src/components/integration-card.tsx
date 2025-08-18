import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Badge } from "./ui/badge";
import { Heart, Database, Server, Snowflake, Facebook, Chrome, Twitter, Instagram, Share2, CreditCard, Slack, TrendingUp, FileText, Sheet, Smartphone, MessageCircle } from "lucide-react";
import { type Integration } from "../../shared/schema";
import { cn } from "../lib/utils";

interface IntegrationCardProps {
  integration: Integration;
  onToggle: (id: string, enabled: boolean) => void;
  onConfigure: (id: string) => void;
  /**
   * When true, clicking Configure will always call onConfigure
   * instead of performing internal navigation. Defaults to false to
   * preserve existing behavior for pages relying on navigation.
   */
  forceOnConfigure?: boolean;
}

const iconMap = {
  database: Database,
  server: Server,
  snowflake: Snowflake,
  facebook: Facebook,
  chrome: Chrome,
  twitter: Twitter,
  instagram: Instagram,
  "share-2": Share2,
  "credit-card": CreditCard,
  slack: Slack,
  "trending-up": TrendingUp,
  "file-text": FileText,
  sheet: Sheet,
  smartphone: Smartphone,
  "message-circle": MessageCircle,
};

export function IntegrationCard({ integration, onToggle, onConfigure, forceOnConfigure = false }: IntegrationCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [, navigate] = useLocation();
  const IconComponent = iconMap[integration.iconName as keyof typeof iconMap] || Database;

  // Generate a color for the ID pill based on the integration category
  const getPillColor = (category: string) => {
    const colors = {
      database: "bg-blue-100 text-blue-800",
      ads: "bg-green-100 text-green-800",
      social: "bg-purple-100 text-purple-800",
      payments: "bg-indigo-100 text-indigo-800",
      files: "bg-yellow-100 text-yellow-800",
      apps: "bg-red-100 text-red-800",
      communication: "bg-pink-100 text-pink-800",
      analytics: "bg-orange-100 text-orange-800",
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const handleConfigure = () => {
    if (forceOnConfigure) {
      onConfigure(integration.id);
      return;
    }
    if (integration.category === "database" || integration.id === "csv") {
      navigate(`/query-builder/${integration.id}`);
    } else {
      onConfigure(integration.id);
    }
  };

  return (
    <Card className="p-6 hover:shadow-md transition-shadow duration-200" data-testid={`card-integration-${integration.id}`}>
      <CardContent className="p-0">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center mr-4", integration.iconBgColor)}>
              {integration.iconUrl ? (
                <img 
                  src={integration.iconUrl} 
                  alt={integration.name}
                  className="w-5 h-5 object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                  }}
                />
              ) : null}
              <IconComponent className={cn("w-5 h-5", integration.iconColor, integration.iconUrl ? "hidden" : "")} />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-1" data-testid={`text-integration-name-${integration.id}`}>
                {integration.displayName}
              </h3>
              <div className="flex items-center gap-2">
                {/* <span className={cn("inline-block px-2 py-1 text-xs font-medium rounded-full", getPillColor(integration.category))} data-testid={`pill-id-${integration.id}`}>
                  {integration.id}
                </span> */}
                {integration.description && (
                  <Badge variant="secondary" className="whitespace-nowrap">
                    {integration.description}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="p-1 h-auto"
            onClick={() => setIsFavorited(!isFavorited)}
            data-testid={`button-favorite-${integration.id}`}
          >
            <Heart className={cn("w-4 h-4", isFavorited ? "text-red-400 fill-current" : "text-gray-300")} />
          </Button>
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <Button
            variant="secondary"
            className="bg-gray-100 hover:bg-gray-200 text-gray-700"
            onClick={handleConfigure}
            data-testid={`button-configure-${integration.id}`}
          >
            Configure
          </Button>
          
          <Switch
            checked={integration.enabled}
            onCheckedChange={(checked) => onToggle(integration.id, checked)}
            data-testid={`switch-enabled-${integration.id}`}
          />
        </div>
      </CardContent>
    </Card>
  );
}
