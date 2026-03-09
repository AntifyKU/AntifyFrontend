/**
 * useLocation Hook
 * Gets the user's current location and reverse-geocodes it to a province name
 */

import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

interface UseLocationReturn {
    province: string | null;
    loading: boolean;
    error: Error | null;
    permissionDenied: boolean;
}

export function useLocation(): UseLocationReturn {
    const [province, setProvince] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [permissionDenied, setPermissionDenied] = useState(false);

    useEffect(() => {
        let cancelled = false;

        const fetchLocation = async () => {
            try {
                const { status } = await Location.requestForegroundPermissionsAsync();

                if (status !== 'granted') {
                    if (!cancelled) {
                        setPermissionDenied(true);
                        setLoading(false);
                    }
                    return;
                }

                const coords = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.Balanced,
                });

                const [geocoded] = await Location.reverseGeocodeAsync({
                    latitude: coords.coords.latitude,
                    longitude: coords.coords.longitude,
                });

                if (!cancelled) {
                    // Try region (province), then city, then subregion as fallback
                    const provinceName =
                        geocoded?.region ||
                        geocoded?.city ||
                        geocoded?.subregion ||
                        null;
                    setProvince(provinceName);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err instanceof Error ? err : new Error('Failed to get location'));
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        fetchLocation();

        return () => {
            cancelled = true;
        };
    }, []);

    return { province, loading, error, permissionDenied };
}

export default useLocation;
