// app/suppliers/new/page.tsx
"use client";
import { useState } from "react";

export default function NewSupplier() {
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    phone: '',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch('/api/suppliers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    
    if (response.ok) {
      // Редирект или очистка формы
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Новый поставщик</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Поля формы */}
      </form>
    </div>
  );
}