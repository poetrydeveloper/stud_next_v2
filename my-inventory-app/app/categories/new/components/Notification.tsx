// app/categories/new/components/Notification.tsx
interface NotificationProps {
  message: string | null;
}

export default function Notification({ message }: NotificationProps) {
  if (!message) return null;

  return (
    <div className="fixed top-4 right-4 bg-gray-800 text-white px-4 py-2 rounded shadow-lg animate-fade-in z-50">
      {message}
    </div>
  );
}