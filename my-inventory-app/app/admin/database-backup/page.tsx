"use client";

import { useState, useEffect } from "react";

interface BackupFile {
  filename: string;
  size: number;
  created: string;
}

export default function DatabaseBackupPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [backups, setBackups] = useState<BackupFile[]>([]);

  // Загружаем список бэкапов
  const loadBackups = async () => {
    try {
      const response = await fetch("/api/admin/database/backups");
      const data = await response.json();
      if (data.ok) {
        setBackups(data.data);
      }
    } catch (error) {
      console.error("Error loading backups:", error);
    }
  };

  useEffect(() => {
    loadBackups();
  }, []);

  // Экспорт БД
  const handleExport = async () => {
    setLoading(true);
    setMessage("");
    
    try {
      const response = await fetch("/api/admin/database/export", {
        method: "POST"
      });
      
      const data = await response.json();
      
      if (data.ok) {
        setMessage(`✅ БД экспортирована: ${data.data.filename}`);
        await loadBackups(); // Обновляем список
        
        // Авто-скачивание
        setTimeout(() => {
          handleDownload(data.data.filename);
        }, 1000);
        
      } else {
        setMessage(`❌ Ошибка: ${data.error}`);
      }
    } catch (error: any) {
      setMessage(`❌ Ошибка: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Импорт БД
  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.zip')) {
      setMessage("❌ Файл должен быть в формате ZIP");
      return;
    }

    if (!confirm("ВНИМАНИЕ: Все текущие данные будут заменены! Продолжить?")) {
      return;
    }

    setLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("backup", file);

    try {
      const response = await fetch("/api/admin/database/import", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      
      if (data.ok) {
        setMessage("✅ БД успешно восстановлена!");
        // Перезагружаем страницу через 2 секунды
        setTimeout(() => window.location.reload(), 2000);
      } else {
        setMessage(`❌ Ошибка: ${data.error}`);
      }
    } catch (error: any) {
      setMessage(`❌ Ошибка: ${error.message}`);
    } finally {
      setLoading(false);
      event.target.value = "";
    }
  };

  // Скачивание бэкапа
  const handleDownload = async (filename: string) => {
    try {
      const response = await fetch(`/api/admin/database/download/${filename}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      setMessage(`❌ Ошибка скачивания: ${error.message}`);
    }
  };

  // Удаление бэкапа
  const handleDelete = async (filename: string) => {
    if (!confirm(`Удалить бэкап ${filename}?`)) return;

    try {
      const response = await fetch(`/api/admin/database/backups/${filename}`, {
        method: "DELETE"
      });

      const data = await response.json();
      
      if (data.ok) {
        setMessage("✅ Бэкап удален");
        await loadBackups();
      } else {
        setMessage(`❌ Ошибка: ${data.error}`);
      }
    } catch (error: any) {
      setMessage(`❌ Ошибка: ${data.error}`);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Управление базой данных</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Панель действий */}
        <div className="space-y-4">
          {/* Экспорт */}
          <div className="p-4 border rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Экспорт БД</h2>
            <p className="text-sm text-gray-600 mb-4">
              Создает резервную копию всей базы данных в ZIP архиве
            </p>
            <button
              onClick={handleExport}
              disabled={loading}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Создание бэкапа..." : "📥 Создать бэкап"}
            </button>
          </div>

          {/* Импорт */}
          <div className="p-4 border rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Импорт БД</h2>
            <p className="text-sm text-gray-600 mb-4">
              Восстанавливает БД из ZIP файла. ЗАМЕНИТ все текущие данные!
            </p>
            <input
              type="file"
              accept=".zip"
              onChange={handleImport}
              disabled={loading}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
            />
          </div>

          {/* Сообщение */}
          {message && (
            <div className={`p-3 rounded ${
              message.includes("✅") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}>
              {message}
            </div>
          )}
        </div>

        {/* Список бэкапов */}
        <div className="p-4 border rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Доступные бэкапы</h2>
          
          {backups.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Бэкапы не найдены</p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {backups.map((backup) => (
                <div key={backup.filename} className="flex items-center justify-between p-3 border rounded">
                  <div className="flex-1">
                    <div className="font-medium">{backup.filename}</div>
                    <div className="text-sm text-gray-500">
                      {(backup.size / 1024).toFixed(1)} KB • {new Date(backup.created).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleDownload(backup.filename)}
                      className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                      title="Скачать"
                    >
                      📥
                    </button>
                    <button
                      onClick={() => handleDelete(backup.filename)}
                      className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                      title="Удалить"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Информация */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-800">💡 Информация о бэкапах</h3>
        <ul className="text-sm text-blue-700 mt-2 space-y-1">
          <li>• Бэкапы сохраняются в папке <code className="bg-blue-100 px-1">/backups/</code></li>
          <li>• Каждый бэкап содержит полную копию базы данных</li>
          <li>• Формат: ZIP архив с SQL файлом внутри</li>
          <li>• Совместимо с Windows/Linux/macOS</li>
        </ul>
      </div>
    </div>
  );
}