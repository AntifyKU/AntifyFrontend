import { useCallback, useState } from "react";
import { File } from "expo-file-system";
import { identificationService } from "@/services/identification";
import { historyService } from "@/services/history";
import { prependToHistoryCache } from "@/hooks/useHistory";
import type {
  ClassificationResponse,
  DetectionResponse,
  HistoryRecord,
  NewHistoryRecord,
  PredictionSnapshot,
  Species,
  SpeciesDetailsResponse,
} from "@/types/api";

interface UseIdentificationReturn {
  // Results
  classificationResult: ClassificationResponse | null;
  detectionResult: DetectionResponse | null;
  speciesResult: SpeciesDetailsResponse | null;
  speciesInfo: Species | null;
  lastHistoryRecord: HistoryRecord | null;
  // State
  loading: boolean;
  error: Error | null;
  // Actions
  identifyImage: (
    imageUri: string,
    mimeType?: string,
  ) => Promise<ClassificationResponse | null>;
  detectInImage: (
    imageUri: string,
    mimeType?: string,
  ) => Promise<DetectionResponse | null>;
  identifyBase64: (
    base64: string,
    mimeType?: string,
  ) => Promise<ClassificationResponse | null>;
  detectBase64: (
    base64: string,
    mimeType?: string,
  ) => Promise<DetectionResponse | null>;
  /**
   * Identify species from image AND get full Firestore species data.
   * Automatically saves the result to local history.
   *
   * @param imageUri    Local file URI sent to the API
   * @param mimeType    MIME type of the image (default: "image/jpeg")
   * @param imageBase64 Base64 thumbnail to store in history.
   *                    If omitted, imageUri is stored instead.
   */
  identifySpecies: (
    imageUri: string,
    mimeType?: string,
    imageBase64?: string,
  ) => Promise<SpeciesDetailsResponse | null>;
  reset: () => void;
}

function _buildSnapshots(
  predictions: {
    rank?: number;
    class_name?: string;
    confidence?: number;
    species_id?: string | null;
  }[],
  topSpeciesId?: string | null,
): PredictionSnapshot[] {
  return predictions.map((p, i) => {
    const rank = p.rank ?? i + 1;
    return {
      rank,
      speciesName: p.class_name ?? "Unknown",
      confidence: p.confidence ?? 0,
      speciesId:
        rank === 1
          ? (topSpeciesId ?? p.species_id ?? null)
          : (p.species_id ?? null),
    };
  });
}

async function _trySaveHistory(
  data: NewHistoryRecord,
): Promise<HistoryRecord | null> {
  try {
    const record = await historyService.saveRecord(data);
    prependToHistoryCache(record);
    return record;
  } catch (err) {
    console.warn("[useIdentification] Could not save history record:", err);
    return null;
  }
}

export function useIdentification(): UseIdentificationReturn {
  const [classificationResult, setClassificationResult] =
    useState<ClassificationResponse | null>(null);
  const [detectionResult, setDetectionResult] =
    useState<DetectionResponse | null>(null);
  const [speciesResult, setSpeciesResult] =
    useState<SpeciesDetailsResponse | null>(null);
  const [speciesInfo, setSpeciesInfo] = useState<Species | null>(null);
  const [lastHistoryRecord, setLastHistoryRecord] =
    useState<HistoryRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const _wrap = useCallback(
    async <T>(fn: () => Promise<T>): Promise<T | null> => {
      setLoading(true);
      setError(null);
      try {
        console.log(`[useIdentification] Starting task...`);
        const result = await fn();
        console.log(`[useIdentification] Task completed successfully`);
        return result;
      } catch (err) {
        const wrapped = err instanceof Error ? err : new Error(String(err));
        setError(wrapped);
        console.error(`[useIdentification] FAILED:`, wrapped);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const identifyImage = useCallback(
    (imageUri: string, mimeType = "image/jpeg") =>
      _wrap(async () => {
        const result = await identificationService.identifyFromFile(
          imageUri,
          "image.jpg",
          mimeType,
        );
        setClassificationResult(result);
        return result;
      }),
    [_wrap],
  );

  const detectInImage = useCallback(
    (imageUri: string, mimeType = "image/jpeg") =>
      _wrap(async () => {
        const result = await identificationService.detectFromFile(
          imageUri,
          "image.jpg",
          mimeType,
        );
        setDetectionResult(result);
        return result;
      }),
    [_wrap],
  );

  const identifyBase64 = useCallback(
    (base64: string, mimeType = "image/jpeg") =>
      _wrap(async () => {
        const result = await identificationService.identifyFromBase64(
          base64,
          mimeType,
        );
        setClassificationResult(result);
        return result;
      }),
    [_wrap],
  );

  const detectBase64 = useCallback(
    (base64: string, mimeType = "image/jpeg") =>
      _wrap(async () => {
        const result = await identificationService.detectFromBase64(
          base64,
          mimeType,
        );
        setDetectionResult(result);
        return result;
      }),
    [_wrap],
  );

  const identifySpecies = useCallback(
    (imageUri: string, mimeType = "image/jpeg", imageBase64?: string) =>
      _wrap(async () => {
        let result: SpeciesDetailsResponse;
        
        try {
          // Attempt 1: Multipart (Standard)
          result = await identificationService.identifySpeciesFromFile(
            imageUri,
            "image.jpg",
            mimeType,
          );
        } catch (err: any) {
          // Attempt 2: Base64 Fallback (more robust in some environments)
          console.warn(`[useIdentification] Multipart failed. Attempting Base64 fallback...`);
          
          let b64 = imageBase64;
          if (!b64) {
            try {
              console.log(`[useIdentification] Reading file as Base64 using new File API: ${imageUri}`);
              const file = new File(imageUri);
              b64 = await file.base64();
            } catch (fsErr) {
              console.error("[useIdentification] Failed to read file as Base64:", fsErr);
              throw err; // Re-throw the original network error if FS also fails
            }
          }

          if (b64) {
            result = await identificationService.identifySpeciesFromBase64(
              b64,
              mimeType,
            );
          } else {
            throw err;
          }
        }

        setSpeciesResult(result);
        const info: Species | null = result.species_info ?? null;
        setSpeciesInfo(info);

        // Auto-save to history on successful identification
        if (result.success && result.top_prediction) {
          const record = await _trySaveHistory({
            imageBase64: imageBase64 ?? imageUri,
            imageMimeType: mimeType,
            speciesName: result.top_prediction,
            commonName: info?.name ?? null,
            confidence: result.top_confidence ?? 0,
            speciesInfo: info,
            topPredictions: _buildSnapshots(result.predictions ?? [], info?.id),
          });
          setLastHistoryRecord(record);
        }

        return result;
      }),
    [_wrap],
  );

  const reset = useCallback(() => {
    setClassificationResult(null);
    setDetectionResult(null);
    setSpeciesResult(null);
    setSpeciesInfo(null);
    setLastHistoryRecord(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    classificationResult,
    detectionResult,
    speciesResult,
    speciesInfo,
    lastHistoryRecord,
    loading,
    error,
    identifyImage,
    detectInImage,
    identifyBase64,
    detectBase64,
    identifySpecies,
    reset,
  };
}

export default useIdentification;
