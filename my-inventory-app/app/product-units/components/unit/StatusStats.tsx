// app/product-units/components/unit/StatusStats.tsx
"use client";

interface StatusStatsProps {
  spines: any[];
  compact?: boolean;
}

export default function StatusStats({ spines, compact = false }: StatusStatsProps) {
  const stats = {
    CLEAR: 0,
    CANDIDATE: 0,
    IN_REQUEST: 0,
    IN_STORE: 0,
    SOLD: 0,
  };

  spines.forEach(spine => {
    spine.productUnits?.forEach((unit: any) => {
      if (unit.statusCard in stats) {
        stats[unit.statusCard as keyof typeof stats]++;
      }
      if (unit.statusProduct in stats) {
        stats[unit.statusProduct as keyof typeof stats]++;
      }
    });
  });

  const statusConfig = {
    CLEAR: { bg: 'bg-green-100', text: 'text-green-800', icon: '🟢' },
    CANDIDATE: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: '🟡' },
    IN_REQUEST: { bg: 'bg-blue-100', text: 'text-blue-800', icon: '🔵' },
    IN_STORE: { bg: 'bg-gray-100', text: 'text-gray-800', icon: '📦' },
    SOLD: { bg: 'bg-purple-100', text: 'text-purple-800', icon: '💰' },
  };

  if (compact) {
    return (
      <div className="flex space-x-1">
        {Object.entries(stats)
          .filter(([_, count]) => count > 0)
          .map(([status, count]) => (
            <span 
              key={status}
              className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs ${
                statusConfig[status as keyof typeof statusConfig]?.bg || 'bg-gray-100'
              } ${statusConfig[status as keyof typeof statusConfig]?.text || 'text-gray-800'}`}
              title={status}
            >
              {count}{statusConfig[status as keyof typeof statusConfig]?.icon}
            </span>
          ))
        }
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-1">
      {Object.entries(stats)
        .filter(([_, count]) => count > 0)
        .map(([status, count]) => (
          <span 
            key={status}
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              statusConfig[status as keyof typeof statusConfig]?.bg || 'bg-gray-100'
            } ${statusConfig[status as keyof typeof statusConfig]?.text || 'text-gray-800'}`}
            title={`${status}: ${count}`}
          >
            {statusConfig[status as keyof typeof statusConfig]?.icon} {count}
          </span>
        ))
      }
    </div>
  );
}