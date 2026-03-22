import React from "react";
import { View, Text, Image, ActivityIndicator } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import type { Species } from "@/types/api";

export interface LocationSpeciesPrediction {
  id: string;
  name: string;
  scientificName: string;
  image: string;
  matchPercentage: number;
}

interface LocationSpeciesCardProps {
  readonly predictions: readonly LocationSpeciesPrediction[];
  readonly province: string | null;
  readonly loadingLocation: boolean;
  readonly permissionDenied: boolean;
  readonly provinceSpecies: readonly Species[];
  readonly loadingProvinceSpecies: boolean;
}

/** Normalize a scientific name for fuzzy comparison */
function normalizeSci(name?: string): string {
  if (!name) return "";
  return name.toLowerCase().replaceAll("_", " ").replaceAll(".", "").trim();
}

/** True if a prediction matches a Firestore province species.
 *  Uses partial name matching so "Acropyga sp" matches "Acropyga" */
function isInProvince(
  pred: LocationSpeciesPrediction,
  provinceSpecies: readonly Species[],
): boolean {
  const predSci = normalizeSci(pred.scientificName);
  const predName = pred.name?.toLowerCase().trim() ?? "";

  return provinceSpecies.some((s) => {
    if (s.id === pred.id) return true;

    const speciesSci = normalizeSci(s.scientific_name);
    const speciesName = s.name?.toLowerCase().trim() ?? "";
    if (predName && speciesName && predName === speciesName) return true;
    if (predSci && speciesSci) {
      if (predSci === speciesSci) return true;
      if (predSci.startsWith(speciesSci) || speciesSci.startsWith(predSci))
        return true;
    }

    return false;
  });
}

function computeWeightedScore(aiPercent: number): number {
  return Math.min(Number(aiPercent.toFixed(2)), 100);
}

function ConfidenceBar({
  weighted,
  raw,
}: {
  readonly weighted: number;
  readonly raw: number;
}) {
  const { t } = useTranslation();

  const getBarColor = (value: number): string => {
    if (value >= 70) return "#0A9D5C";
    if (value >= 40) return "#F59E0B";
    return "#9CA3AF";
  };

  const barColor = getBarColor(weighted);
  const pct = Math.min(Math.max(weighted, 0), 100);
  const remainder = 100 - pct;

  return (
    <View style={{ marginTop: 6 }}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View
          style={{
            flex: 1,
            height: 8,
            borderRadius: 4,
            overflow: "hidden",
            flexDirection: "row",
            backgroundColor: "#E5E7EB",
            marginRight: 8,
          }}
        >
          {pct > 0 && <View style={{ flex: pct, backgroundColor: barColor }} />}
          {remainder > 0 && (
            <View style={{ flex: remainder, backgroundColor: "#E5E7EB" }} />
          )}
        </View>
        <Text
          style={{
            color: barColor,
            fontSize: 13,
            fontWeight: "700",
            width: 60,
            textAlign: "right",
          }}
        >
          {weighted.toFixed(2)}%
        </Text>
      </View>
      {weighted !== raw && (
        <Text style={{ color: "#9CA3AF", fontSize: 11, marginTop: 2 }}>
          {t("location_card.ai_confidence", { raw: raw.toFixed(2) })}
        </Text>
      )}
    </View>
  );
}

export default function LocationSpeciesCard({
  predictions,
  province,
  loadingLocation,
  permissionDenied,
  provinceSpecies,
  loadingProvinceSpecies,
}: LocationSpeciesCardProps) {
  const { t } = useTranslation();
  const isLoading = loadingLocation || loadingProvinceSpecies;

  const translatedProvince = province ? t(`badges.${province}`, province) : "";

  const matchedPredictions = predictions.filter((pred) =>
    isInProvince(pred, provinceSpecies),
  );

  const getProvinceStatusContent = () => {
    if (loadingLocation) {
      return (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 2,
          }}
        >
          <ActivityIndicator
            size="small"
            color="#0A9D5C"
            style={{ marginRight: 4 }}
          />
          <Text style={{ color: "#328e6e", fontSize: 12 }}>
            {t("location_card.detecting")}
          </Text>
        </View>
      );
    }
    if (permissionDenied) {
      return (
        <Text style={{ color: "#D97706", fontSize: 12, marginTop: 2 }}>
          {t("location_card.denied")}
        </Text>
      );
    }
    if (province) {
      return (
        <Text style={{ color: "#4B5563", fontSize: 12, marginTop: 2 }}>
          {translatedProvince}
        </Text>
      );
    }
    return (
      <Text style={{ color: "#9CA3AF", fontSize: 12, marginTop: 2 }}>
        {t("location_card.unable_to_detect")}
      </Text>
    );
  };

  const provinceStatusContent = getProvinceStatusContent();

  return (
    <View style={{ marginHorizontal: 16, marginTop: 24 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: "700", color: "#1F2937" }}>
          {t("location_card.title")}
        </Text>
      </View>

      <View
        style={{
          backgroundColor: "#fff",
          borderRadius: 16,
          overflow: "hidden",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.07,
          shadowRadius: 8,
          elevation: 3,
          borderWidth: 1,
          borderColor: "#E5E7EB",
        }}
      >
        {/* Header */}
        <View
          style={{
            backgroundColor: "#e8f5e0",
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 16,
            paddingVertical: 12,
          }}
        >
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: "#fff",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 12,
            }}
          >
            <Ionicons name="location" size={18} color="#0A9D5C" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: "#0A9D5C", fontWeight: "700", fontSize: 14 }}>
              {t("location_card.current_province")}
            </Text>
            {provinceStatusContent}
          </View>
          {!loadingLocation && !permissionDenied && loadingProvinceSpecies && (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <ActivityIndicator size="small" color="#9CA3AF" />
              <Text style={{ color: "#9CA3AF", fontSize: 11, marginLeft: 4 }}>
                {t("locationCard.searching")}
              </Text>
            </View>
          )}
        </View>

        <View style={{ height: 1, backgroundColor: "#E5E7EB" }} />

        {/* Permission denied */}
        {permissionDenied && (
          <View
            style={{
              paddingHorizontal: 16,
              paddingVertical: 20,
              alignItems: "center",
            }}
          >
            <MaterialCommunityIcons
              name="map-marker-off-outline"
              size={36}
              color="#D1D5DB"
            />
            <Text
              style={{
                color: "#6B7280",
                fontSize: 13,
                textAlign: "center",
                marginTop: 8,
              }}
            >
              {t("location_card.enable_location")}
            </Text>
          </View>
        )}

        {/* Loading skeleton */}
        {!permissionDenied && isLoading && (
          <View
            style={{
              paddingHorizontal: 16,
              paddingVertical: 20,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <ActivityIndicator color="#0A9D5C" />
            <Text style={{ color: "#9CA3AF", fontSize: 13, marginLeft: 10 }}>
              {t("location_card.checking_db")}
            </Text>
          </View>
        )}

        {/* Intersection results */}
        {!permissionDenied && !isLoading && matchedPredictions.length > 0 && (
          <>
            {/* Summary chip */}
            <View
              style={{
                paddingHorizontal: 16,
                paddingVertical: 10,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: "#dcfce7",
                  borderRadius: 999,
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Ionicons
                  name="checkmark-circle"
                  size={13}
                  color="#16a34a"
                  style={{ marginRight: 4 }}
                />
                <Text
                  style={{ color: "#16a34a", fontSize: 12, fontWeight: "700" }}
                >
                  {t("location_card.confirmed_in", {
                    count: matchedPredictions.length,
                    total: predictions.length,
                    province: translatedProvince,
                  })}
                </Text>
              </View>
            </View>

            <View style={{ height: 1, backgroundColor: "#E5E7EB" }} />

            {matchedPredictions.map((pred, index) => {
              const weighted = computeWeightedScore(pred.matchPercentage);
              const isLast = index === matchedPredictions.length - 1;

              return (
                <View key={pred.id}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingHorizontal: 16,
                      paddingVertical: 12,
                    }}
                  >
                    {/* Thumbnail */}
                    <View
                      style={{
                        width: 52,
                        height: 52,
                        borderRadius: 10,
                        overflow: "hidden",
                        backgroundColor: "#F3F4F6",
                        marginRight: 12,
                        flexShrink: 0,
                      }}
                    >
                      {pred.image ? (
                        <Image
                          source={{ uri: pred.image }}
                          style={{ width: 52, height: 52 }}
                          resizeMode="cover"
                        />
                      ) : (
                        <View
                          style={{
                            flex: 1,
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <MaterialCommunityIcons
                            name="bug-outline"
                            size={24}
                            color="#9CA3AF"
                          />
                        </View>
                      )}
                    </View>

                    {/* Info */}
                    <View style={{ flex: 1 }}>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: "600",
                            color: "#1F2937",
                            flex: 1,
                            marginRight: 8,
                          }}
                          numberOfLines={1}
                        >
                          {pred.name}
                        </Text>
                        {/* "Found here" badge */}
                        <View
                          style={{
                            backgroundColor: "#dcfce7",
                            borderRadius: 999,
                            paddingHorizontal: 8,
                            paddingVertical: 2,
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <Ionicons
                            name="location"
                            size={10}
                            color="#16a34a"
                            style={{ marginRight: 3 }}
                          />
                          <Text
                            style={{
                              color: "#16a34a",
                              fontSize: 10,
                              fontWeight: "600",
                            }}
                          >
                            {t("location_card.found_here")}
                          </Text>
                        </View>
                      </View>
                      <Text
                        style={{
                          fontSize: 11,
                          color: "#9CA3AF",
                          fontStyle: "italic",
                          marginTop: 1,
                        }}
                        numberOfLines={1}
                      >
                        {pred.scientificName}
                      </Text>
                      <ConfidenceBar
                        weighted={weighted}
                        raw={pred.matchPercentage}
                      />
                    </View>
                  </View>
                  {!isLast && (
                    <View
                      style={{
                        height: 1,
                        backgroundColor: "#F3F4F6",
                        marginHorizontal: 16,
                      }}
                    />
                  )}
                </View>
              );
            })}
          </>
        )}

        {/* Empty state: no predicted species confirmed locally */}
        {!permissionDenied && !isLoading && matchedPredictions.length === 0 && (
          <View
            style={{
              paddingHorizontal: 16,
              paddingVertical: 24,
              alignItems: "center",
            }}
          >
            <MaterialCommunityIcons
              name="map-search-outline"
              size={36}
              color="#D1D5DB"
            />
            <Text
              style={{
                color: "#6B7280",
                fontSize: 13,
                textAlign: "center",
                marginTop: 8,
              }}
            >
              {t("location_card.none_confirmed", {
                province: translatedProvince || t("home.unknown_location"),
              })}
            </Text>
          </View>
        )}

        {/* Footer */}
        {!permissionDenied && !isLoading && province && (
          <>
            <View style={{ height: 1, backgroundColor: "#E5E7EB" }} />
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 16,
                paddingVertical: 10,
              }}
            >
              <MaterialCommunityIcons
                name="database-check-outline"
                size={13}
                color="#0A9D5C"
              />
              <Text style={{ fontSize: 12, color: "#6B7280", marginLeft: 6 }}>
                {t("location_card.total_in_db", {
                  count: provinceSpecies.length,
                  province: translatedProvince,
                })}
              </Text>
            </View>
          </>
        )}
      </View>
    </View>
  );
}
