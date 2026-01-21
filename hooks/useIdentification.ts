/**
 * useIdentification Hook
 * Handles AI identification of ant images
 */

import { useState, useCallback } from 'react';
import { identificationService } from '@/services/identification';
import type { ClassificationResponse, DetectionResponse } from '@/types/api';

interface UseIdentificationReturn {
  // Identification results
  classificationResult: ClassificationResponse | null;
  detectionResult: DetectionResponse | null;
  
  // State
  loading: boolean;
  error: Error | null;
  
  // Actions
  identifyImage: (imageUri: string, mimeType?: string) => Promise<ClassificationResponse | null>;
  detectInImage: (imageUri: string, mimeType?: string) => Promise<DetectionResponse | null>;
  identifyBase64: (base64: string, mimeType?: string) => Promise<ClassificationResponse | null>;
  detectBase64: (base64: string, mimeType?: string) => Promise<DetectionResponse | null>;
  reset: () => void;
}

export function useIdentification(): UseIdentificationReturn {
  const [classificationResult, setClassificationResult] = useState<ClassificationResponse | null>(null);
  const [detectionResult, setDetectionResult] = useState<DetectionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const identifyImage = useCallback(async (imageUri: string, mimeType = 'image/jpeg') => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await identificationService.identifyFromFile(imageUri, 'image.jpg', mimeType);
      setClassificationResult(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Identification failed');
      setError(error);
      console.error('Identification error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const detectInImage = useCallback(async (imageUri: string, mimeType = 'image/jpeg') => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await identificationService.detectFromFile(imageUri, 'image.jpg', mimeType);
      setDetectionResult(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Detection failed');
      setError(error);
      console.error('Detection error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const identifyBase64 = useCallback(async (base64: string, mimeType = 'image/jpeg') => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await identificationService.identifyFromBase64(base64, mimeType);
      setClassificationResult(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Identification failed');
      setError(error);
      console.error('Identification error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const detectBase64 = useCallback(async (base64: string, mimeType = 'image/jpeg') => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await identificationService.detectFromBase64(base64, mimeType);
      setDetectionResult(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Detection failed');
      setError(error);
      console.error('Detection error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setClassificationResult(null);
    setDetectionResult(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    classificationResult,
    detectionResult,
    loading,
    error,
    identifyImage,
    detectInImage,
    identifyBase64,
    detectBase64,
    reset,
  };
}

export default useIdentification;
