//components/ProductDetails
import { ProductUnit } from "../types/calendar";
import { StatusIcon, getStatusLabel } from "./StatusIcon";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

interface ProductDetailsProps {
  products: ProductUnit[];
  selectedDate: Date | null;
}

export function ProductDetails({ products, selectedDate }: ProductDetailsProps) {
  if (!selectedDate) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">
            Select a date to view product details
          </p>
        </CardContent>
      </Card>
    );
  }
  
  const productsOnDate = products.filter((product) =>
    product.statusHistory.some(
      (history) => history.date.toDateString() === selectedDate.toDateString()
    )
  );
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {selectedDate.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {productsOnDate.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No product activity on this date
          </p>
        ) : (
          <div className="space-y-3">
            {productsOnDate.map((product) => {
              const statusOnDate = product.statusHistory.find(
                (history) => history.date.toDateString() === selectedDate.toDateString()
              );
              
              if (!statusOnDate) return null;
              
              return (
                <div
                  key={product.id}
                  className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="text-sm">{product.name}</h4>
                      <p className="text-xs text-gray-500">{product.id}</p>
                    </div>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <StatusIcon status={statusOnDate.status} size={10} />
                      <span className="text-xs">{getStatusLabel(statusOnDate.status)}</span>
                    </Badge>
                  </div>
                  
                  {/* Status Timeline */}
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-500 mb-2">Status History:</p>
                    <div className="flex items-center gap-2 overflow-x-auto">
                      {product.statusHistory.map((history, idx) => (
                        <div
                          key={idx}
                          className={`
                            flex items-center gap-1 px-2 py-1 rounded text-xs
                            ${history.date.toDateString() === selectedDate.toDateString()
                              ? 'bg-blue-100 border border-blue-300'
                              : 'bg-gray-100'
                            }
                          `}
                        >
                          <StatusIcon status={history.status} size={8} />
                          <span className="text-[10px] whitespace-nowrap">
                            {history.date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
