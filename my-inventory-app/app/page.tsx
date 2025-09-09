// Альтернативная главная страница для инвентарного приложения
export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            📦 Система управления инвентарем
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Управляйте товарами, заявками и поставками в одном месте
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <DashboardCard 
              title="Товары" 
              description="Управление товарами и категориями"
              href="/products"
              icon="📦"
            />
            <DashboardCard 
              title="Заявки" 
              description="Просмотр и управление заявками"
              href="/requests"
              icon="📋"
            />
            <DashboardCard 
              title="Кандидаты" 
              description="Предзаявки и кандидаты"
              href="/requests/candidates"
              icon="⭐"
            />
            <DashboardCard 
              title="Поставщики" 
              description="Управление поставщиками"
              href="/suppliers"
              icon="🏢"
            />
            <DashboardCard 
              title="Клиенты" 
              description="Управление клиентами"
              href="/customers"
              icon="👥"
            />
            <DashboardCard 
              title="Категории" 
              description="Управление категориями товаров"
              href="/categories/tree"
              icon="📂"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardCard({ title, description, href, icon }: { 
  title: string; 
  description: string; 
  href: string;
  icon: string;
}) {
  return (
    <a
      href={href}
      className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200"
    >
      <div className="text-3xl mb-4">{icon}</div>
      <h2 className="text-xl font-semibold text-gray-800 mb-2">{title}</h2>
      <p className="text-gray-600">{description}</p>
    </a>
  );
}