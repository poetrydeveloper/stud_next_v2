//components/StatusIcon
import { ProductStatus } from "../types/calendar";

interface StatusIconProps {
  status: ProductStatus;
  size?: number;
}

export function StatusIcon({ status, size = 8 }: StatusIconProps) {
  const iconSize = size;
  
  switch (status) {
    case "CLEAR":
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="6" stroke="#9CA3AF" strokeWidth="2" fill="none" />
        </svg>
      );
    
    case "CANDIDATE":
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="7" fill="#9CA3AF" />
          <path d="M 8 1 A 7 7 0 0 1 8 15 Z" fill="#9333EA" />
        </svg>
      );
    
    case "IN_REQUEST":
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="7" fill="#EAB308" />
        </svg>
      );
    
    case "IN_STORE":
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 16 16" fill="none">
          <rect x="2" y="2" width="12" height="12" stroke="#22C55E" strokeWidth="2" fill="none" />
        </svg>
      );
    
    case "SOLD":
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 16 16" fill="none">
          <rect x="2" y="2" width="12" height="12" fill="#EAB308" />
          <path d="M 2 2 L 14 14 M 14 2 L 2 14" stroke="#000" strokeWidth="1.5" />
        </svg>
      );
    
    default:
      return null;
  }
}

export function getStatusColor(status: ProductStatus): string {
  switch (status) {
    case "CLEAR":
      return "#9CA3AF";
    case "CANDIDATE":
      return "#9333EA";
    case "IN_REQUEST":
      return "#EAB308";
    case "IN_STORE":
      return "#22C55E";
    case "SOLD":
      return "#EAB308";
    default:
      return "#9CA3AF";
  }
}

export function getStatusLabel(status: ProductStatus): string {
  switch (status) {
    case "CLEAR":
      return "Created";
    case "CANDIDATE":
      return "Candidate";
    case "IN_REQUEST":
      return "In Request";
    case "IN_STORE":
      return "In Store";
    case "SOLD":
      return "Sold";
    default:
      return status;
  }
}
