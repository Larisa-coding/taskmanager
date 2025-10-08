import React, { useState, useRef } from 'react';
import { Upload, File, Download, Trash2, Search, Plus, Eye } from 'lucide-react';
import { useFiles } from '../../hooks/useFiles';
import { FileAttachment } from '../../types';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

export const FileUpload: React.FC = () => {
  const { files, loading, uploadFile, deleteFile } = useFiles();
  const [searchTerm, setSearchTerm] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      // Читаем файл как base64
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Data = e.target?.result as string;
        
        await uploadFile({
          name: file.name,
          size: file.size,
          type: file.type,
          url: base64Data,
          taskId: undefined,
          projectId: undefined
        });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Ошибка загрузки файла:', error);
    }
  };

  const handleView = (file: FileAttachment) => {
    // Открываем файл в новой вкладке
    const win = window.open();
    if (win) {
      win.document.write(`
        <html>
          <head>
            <title>${file.name}</title>
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; 
                background: #1f2224;
                color: #c0c0c0;
                overflow: hidden;
              }
              .header {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                background: rgba(41, 45, 47, 0.95);
                backdrop-filter: blur(20px);
                border-bottom: 1px solid rgba(120, 120, 120, 0.3);
                padding: 16px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                z-index: 1000;
              }
              .file-name {
                font-size: 14px;
                font-weight: 600;
                color: #c0c0c0;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                flex: 1;
                margin-right: 12px;
              }
              .close-btn {
                width: 44px;
                height: 44px;
                border-radius: 12px;
                background: rgba(200, 80, 80, 0.2);
                border: 1px solid rgba(200, 100, 100, 0.3);
                color: #c08080;
                font-size: 24px;
                font-weight: bold;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s;
                flex-shrink: 0;
              }
              .close-btn:hover {
                background: rgba(200, 80, 80, 0.3);
                transform: scale(1.1);
              }
              .content {
                padding: 80px 20px 20px;
                height: 100vh;
                overflow: auto;
                display: flex;
                align-items: center;
                justify-content: center;
              }
              img { max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3); }
              video { max-width: 100%; border-radius: 8px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3); }
              iframe { width: 100%; height: calc(100vh - 100px); border: none; border-radius: 8px; background: white; }
              .message { text-align: center; color: #a0a0a0; }
              .download-link { color: #80c080; text-decoration: none; padding: 12px 24px; background: rgba(80, 200, 80, 0.1); border-radius: 8px; display: inline-block; margin-top: 16px; }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="file-name">${file.name}</div>
              <button class="close-btn" onclick="window.close()" title="Закрыть">✕</button>
            </div>
            <div class="content">
              ${file.type.startsWith('image/') 
                ? `<img src="${file.url}" alt="${file.name}" />` 
                : file.type.startsWith('video/')
                ? `<video controls src="${file.url}"></video>`
                : file.type === 'application/pdf'
                ? `<iframe src="${file.url}"></iframe>`
                : `<div class="message">
                    <p>Предпросмотр недоступен для этого типа файла</p>
                    <a href="${file.url}" download="${file.name}" class="download-link">📥 Скачать файл</a>
                   </div>`
              }
            </div>
          </body>
        </html>
      `);
    }
  };

  const handleDownload = (file: FileAttachment) => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async (fileId: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этот файл?')) {
      try {
        await deleteFile(fileId);
      } catch (error) {
        console.error('Ошибка удаления файла:', error);
      }
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return '🖼️';
    if (type.startsWith('video/')) return '🎥';
    if (type.startsWith('audio/')) return '🎵';
    if (type.includes('pdf')) return '📄';
    if (type.includes('word') || type.includes('document')) return '📝';
    if (type.includes('excel') || type.includes('spreadsheet')) return '📊';
    if (type.includes('zip') || type.includes('rar')) return '📦';
    return '📁';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#c0c0c0' }}></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-heading drop-shadow-lg" style={{ color: '#c0c0c0' }}>Файлы</h1>
          <p className="text-sm font-accent" style={{ color: '#a0a0a0' }}>
            Всего файлов: {files.length} | Показано: {filteredFiles.length}
          </p>
        </div>
        
        <button
          onClick={() => fileInputRef.current?.click()}
          className="btn-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Загрузить файл
        </button>
      </div>

      {/* Поиск */}
      <div>
        <input
          type="text"
          placeholder="🔍 Поиск файлов..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-input"
        />
      </div>

      {/* Область загрузки */}
      <div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Перетащите файлы сюда
        </h3>
        <p className="text-gray-600 mb-4">
          или нажмите кнопку "Загрузить файл"
        </p>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="btn-secondary"
        >
          Выбрать файлы
        </button>
      </div>

      {/* Скрытый input для загрузки */}
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileInput}
        className="hidden"
        multiple
      />

      {/* Список файлов */}
      <div className="space-y-4">
        {filteredFiles.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <File className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-2">Файлов не найдено</h3>
            <p>Загрузите свой первый файл</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFiles.map((file) => (
              <div
                key={file.id}
                className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start space-x-3 mb-3">
                  <div className="text-2xl">
                    {getFileIcon(file.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate" title={file.name}>
                      {file.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
                    <p className="text-xs text-gray-400">
                      {format(new Date(file.uploadedAt), 'dd MMM yyyy HH:mm', { locale: ru })}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {file.type}
                  </span>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleView(file)}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                      title="Просмотр"
                    >
                      <Eye className="w-4 h-4 text-gray-400" />
                    </button>
                    <button
                      onClick={() => handleDownload(file)}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                      title="Скачать"
                    >
                      <Download className="w-4 h-4 text-gray-400" />
                    </button>
                    <button
                      onClick={() => handleDelete(file.id)}
                      className="p-1 hover:bg-red-100 rounded transition-colors"
                      title="Удалить"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
