import { useState, useEffect, useCallback } from 'react';
import { db } from '../database/db';
import { FileAttachment } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const useFiles = () => {
  const [files, setFiles] = useState<FileAttachment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFiles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const filesData = await db.files.orderBy('uploadedAt').toArray();
      setFiles(filesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки файлов');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  const uploadFile = async (fileData: Omit<FileAttachment, 'id' | 'uploadedAt'>) => {
    try {
      const newFile: FileAttachment = {
        ...fileData,
        id: uuidv4(),
        uploadedAt: new Date()
      };
      
      await db.files.add(newFile);
      await loadFiles();
      return newFile;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки файла');
      throw err;
    }
  };

  const deleteFile = async (id: string) => {
    try {
      await db.files.delete(id);
      await loadFiles();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка удаления файла');
      throw err;
    }
  };

  return {
    files,
    loading,
    error,
    uploadFile,
    deleteFile,
    refetch: loadFiles
  };
};
