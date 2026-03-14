import {
  View,
  Text,
  Pressable,
  Image,
  StatusBar,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Modal,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { antSpeciesData } from "@/constants/AntData";
import Badge from "@/components/atom/badge/Badge";
import { useSpeciesDetail } from "@/hooks/useSpeciesDetail";
import { useSpecies } from "@/hooks/useSpecies";
import RiskTags from "@/components/molecule/RiskTags";
import { useAuth } from "@/context/AuthContext";
import { useCollection } from "@/hooks/useCollection";
import { useFolders } from "@/hooks/useFolders";
import { useState } from "react";
import PrimaryButton from "@/components/atom/button/PrimaryButton";
import EmptyState from "@/components/molecule/EmptyState";

type DetailParams = {
  id: string;
  fromIdentification?: string;
  antName?: string;
  scientificName?: string;
  matchPercentage?: string;
  imageUri?: string;
  source?: string;
};

const BUTTON_HEIGHT = 52;

function navigateAfterIdentification(
  id: string,
  imageUri: string | undefined,
  source: string | undefined,
  antName: string,
  scientificName: string,
  matchPercentage: string | undefined,
) {
  router.replace({
    pathname: "/help-improve-ai",
    params: {
      antId: id,
      imageUri,
      source,
      antName,
      scientificName,
      matchPercentage,
    },
  });
}

function promptLogin(message: string) {
  Alert.alert("Login Required", message, [
    { text: "Cancel", style: "cancel" },
    { text: "Log In", onPress: () => router.push("/(auth)/login") },
  ]);
}

function FolderItem({
  folder,
  isSelected,
  onToggle,
}: {
  readonly folder: {
    readonly id: string;
    readonly name: string;
    readonly color: string;
  };
  readonly isSelected: boolean;
  readonly onToggle: (id: string) => void;
}) {
  return (
    <TouchableOpacity
      className={`flex-row items-center p-3 rounded-lg mb-2 ${isSelected ? "bg-green-50" : "bg-gray-50"}`}
      onPress={() => onToggle(folder.id)}
    >
      <View
        className="w-4 h-4 rounded-full mr-3"
        style={{ backgroundColor: folder.color }}
      />
      <Text className="flex-1 text-base text-gray-800">{folder.name}</Text>
      {isSelected && (
        <Ionicons name="checkmark-circle" size={24} color="#22A45D" />
      )}
    </TouchableOpacity>
  );
}

function FolderSelectModal({
  visible,
  folders,
  selectedFolderIds,
  isLoading,
  onClose,
  onToggleFolder,
  onConfirm,
}: {
  readonly visible: boolean;
  readonly folders: readonly {
    readonly id: string;
    readonly name: string;
    readonly color: string;
  }[];
  readonly selectedFolderIds: readonly string[];
  readonly isLoading: boolean;
  readonly onClose: () => void;
  readonly onToggleFolder: (id: string) => void;
  readonly onConfirm: (ids: string[]) => void;
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        className="flex-1 bg-black/30 justify-center items-center"
        onPress={onClose}
      >
        <Pressable
          className="bg-white rounded-2xl mx-6 w-[90%] max-w-[340px]"
          onPress={() => {}}
        >
          <View className="p-6">
            <Text className="text-xl font-bold text-center text-gray-800 mb-2">
              Add to Collection
            </Text>
            <Text className="text-sm text-gray-500 text-center mb-4">
              Select folders to organize this species
            </Text>
            <View className="mb-4 max-h-64">
              <ScrollView showsVerticalScrollIndicator={false}>
                {folders.map((folder) => (
                  <FolderItem
                    key={folder.id}
                    folder={folder}
                    isSelected={selectedFolderIds.includes(folder.id)}
                    onToggle={onToggleFolder}
                  />
                ))}
              </ScrollView>
            </View>
            <View className="flex-row">
              <TouchableOpacity
                className="flex-1 py-3 rounded-lg border border-gray-300 mr-2"
                onPress={onClose}
              >
                <Text className="text-center text-gray-600 font-medium">
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 py-3 rounded-lg bg-[#22A45D] ml-2"
                onPress={() => onConfirm(selectedFolderIds.slice())}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text className="text-center text-white font-medium">
                    {selectedFolderIds.length > 0
                      ? "Add to Collection"
                      : "Skip Folders"}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function AcceptedTaxonSection({
  acceptedTaxon,
}: {
  readonly acceptedTaxon: NonNullable<any>;
}) {
  return (
    <View className="mb-5">
      <Text className="text-lg font-bold text-gray-800 mb-3">
        Accepted Taxonomy
      </Text>
      <View className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        {acceptedTaxon.scientific_name && (
          <View className="flex-row justify-between py-3 px-4 border-b border-gray-100">
            <Text className="text-gray-600">Scientific Name</Text>
            <Text
              className="text-gray-800 font-medium italic flex-1 text-right ml-4"
              numberOfLines={2}
            >
              {acceptedTaxon.scientific_name}
            </Text>
          </View>
        )}
        {acceptedTaxon.rank && (
          <View className="flex-row justify-between py-3 px-4 border-b border-gray-100">
            <Text className="text-gray-600">Rank</Text>
            <Text className="text-gray-800 font-medium capitalize">
              {acceptedTaxon.rank}
            </Text>
          </View>
        )}
        {acceptedTaxon.synonyms && acceptedTaxon.synonyms.length > 0 && (
          <View className="flex-row justify-between py-3 px-4">
            <Text className="text-gray-600">Synonyms</Text>
            <Text className="text-gray-800 font-medium">
              {acceptedTaxon.synonyms.join(", ")}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

function LookalikesSection({
  lookalikes,
  allSpecies,
}: {
  readonly lookalikes: readonly string[];
  readonly allSpecies: any[];
}) {
  return (
    <View className="mb-5">
      <Text className="text-lg font-bold text-gray-800 mb-2">
        Similar Species
      </Text>
      <View className="flex-col">
        {lookalikes.map((lookalike) => {
          const matchedSpecies = allSpecies.find(
            (s) =>
              s.name.toLowerCase() === lookalike.toLowerCase() ||
              s.scientific_name.toLowerCase() === lookalike.toLowerCase() ||
              s.classification.genus.toLowerCase() === lookalike.toLowerCase(),
          );
          return (
            <View
              key={lookalike}
              className="mb-3 bg-gray-50 rounded-xl p-3 border border-gray-100 flex-row items-center flex-wrap"
            >
              <Text className="font-semibold text-gray-800 text-base mr-3 mb-1">
                {lookalike}
              </Text>
              {matchedSpecies?.risk && (
                <View className="mb-1">
                  <RiskTags riskInfo={matchedSpecies.risk} size="small" />
                </View>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
}

function RiskSafetySection({ risk }: { readonly risk: NonNullable<any> }) {
  return (
    <View className="mb-5">
      <Text className="text-lg font-bold text-gray-800 mb-3">
        Risk & Safety
      </Text>
      <View className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        {risk.sting_or_bite && (
          <View className="flex-row justify-between py-3 px-4 border-b border-gray-100">
            <Text className="text-gray-600">Sting / Bite</Text>
            <Text className="text-gray-800 font-medium capitalize">
              {risk.sting_or_bite.replaceAll("_", " ")}
            </Text>
          </View>
        )}
        {risk.medical_importance && (
          <View className="flex-row justify-between py-3 px-4 border-b border-gray-100">
            <Text className="text-gray-600">Medical Importance</Text>
            <Text className="text-gray-800 font-medium capitalize">
              {risk.medical_importance.replaceAll("_", " ")}
            </Text>
          </View>
        )}
        {risk.venom && (
          <View className="py-3 px-4 border-b border-gray-100">
            <View className="flex-row justify-between mb-1">
              <Text className="text-gray-600">Venom</Text>
              <Text
                className={`font-medium ${risk.venom.has_venom ? "text-red-500" : "text-[#0A9D5C]"}`}
              >
                {risk.venom.has_venom ? "Yes" : "No"}
              </Text>
            </View>
            {risk.venom.details && (
              <Text className="text-gray-500 text-sm">
                {risk.venom.details}
              </Text>
            )}
          </View>
        )}
        {risk.allergy_risk_note && (
          <View className="py-3 px-4">
            <Text className="text-gray-600 mb-1">Allergy Risk</Text>
            <Text className="text-gray-500 text-sm">
              {risk.allergy_risk_note}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

export default function DetailScreen() {
  const params = useLocalSearchParams<DetailParams>();
  const {
    id,
    fromIdentification,
    antName,
    scientificName,
    matchPercentage,
    imageUri,
    source,
  } = params;

  const { isAuthenticated } = useAuth();
  const { isInCollection, addToCollection, removeFromCollection } =
    useCollection();
  const { folders } = useFolders();

  const [isCollectionLoading, setIsCollectionLoading] = useState(false);
  const [showFolderSelect, setShowFolderSelect] = useState(false);
  const [selectedFolderIds, setSelectedFolderIds] = useState<string[]>([]);

  const { species, loading } = useSpeciesDetail(id);
  const { species: allSpecies } = useSpecies();

  const currentAnt = species
    ? {
        id: species.id,
        name: species.name,
        scientificName: species.scientific_name,
        classification: species.classification,
        tags: species.tags,
        about: species.about,
        characteristics: species.characteristics,
        colors: species.colors,
        habitat: species.habitat,
        distribution: species.distribution,
        behavior: species.behavior,
        ecologicalRole: species.ecological_role,
        image: species.image || "",
        provinces: species.distribution_v2?.provinces ?? [],
        acceptedTaxon: species.accepted_taxon,
        lookalikes: species.lookalikes ?? [],
        risk: species.risk,
      }
    : {
        ...antSpeciesData[0],
        provinces: [] as string[],
        acceptedTaxon: undefined,
        lookalikes: [] as string[],
        risk: undefined,
      };

  const handleBackPress = () => {
    if (fromIdentification === "true") {
      navigateAfterIdentification(
        id,
        imageUri,
        source,
        antName || currentAnt.name,
        scientificName || currentAnt.scientificName,
        matchPercentage,
      );
    } else {
      router.back();
    }
  };

  const addToCollectionWithFolders = async (folderIds: string[]) => {
    setIsCollectionLoading(true);
    try {
      await addToCollection(id, undefined, undefined, folderIds);
      setShowFolderSelect(false);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to add to collection");
    } finally {
      setIsCollectionLoading(false);
    }
  };

  const removeFromCollectionWithFeedback = async () => {
    setIsCollectionLoading(true);
    try {
      await removeFromCollection(id);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to remove from collection");
    } finally {
      setIsCollectionLoading(false);
    }
  };

  const handleCollectionPress = async () => {
    if (!isAuthenticated) {
      promptLogin("Please log in to add to your collection");
      return;
    }
    if (isInCollection(id)) {
      await removeFromCollectionWithFeedback();
      return;
    }
    if (folders.length > 0) {
      setSelectedFolderIds([]);
      setShowFolderSelect(true);
    } else {
      await addToCollectionWithFolders([]);
    }
  };

  const toggleFolderSelection = (folderId: string) => {
    setSelectedFolderIds((prev) =>
      prev.includes(folderId)
        ? prev.filter((f) => f !== folderId)
        : [...prev, folderId],
    );
  };

  const handleSuggestUpdate = () => {
    if (!isAuthenticated) {
      promptLogin("Please log in to suggest updates to species information");
      return;
    }
    router.push("/requestformpage");
  };

  const isCurrentInCollection = isAuthenticated && isInCollection(id);

  if (loading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <StatusBar barStyle="dark-content" />
        <ActivityIndicator size="large" color="#0A9D5C" />
        <Text className="mt-4 text-gray-600">Loading species details...</Text>
      </View>
    );
  }

  if (!species && !loading) {
    return (
      <View className="flex-1 bg-white">
        <StatusBar barStyle="dark-content" />
        <SafeAreaView edges={["top"]}>
          <Pressable
            onPress={handleBackPress}
            className="m-4 w-10 h-10 rounded-full bg-white/80 items-center justify-center"
            style={({ pressed }) => pressed && styles.pressed}
          >
            <Ionicons name="chevron-back" size={24} color="#333" />
          </Pressable>
        </SafeAreaView>
        <View className="flex-1 items-center justify-center px-8">
          <EmptyState
            icon="alert-circle-outline"
            iconColor="#9CA3AF"
            title="Species Not Found"
            titleStyle={{ fontWeight: "600", color: "#333" }}
            description="Unable to load species details. Please try again."
            descriptionStyle={{ color: "#374151" }}
            buttonTitle="Go Back"
            onButtonPress={handleBackPress}
          />
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      <FolderSelectModal
        visible={showFolderSelect}
        folders={folders}
        selectedFolderIds={selectedFolderIds}
        isLoading={isCollectionLoading}
        onClose={() => setShowFolderSelect(false)}
        onToggleFolder={toggleFolderSelection}
        onConfirm={addToCollectionWithFolders}
      />

      {/* Fixed Header */}
      <View className="absolute top-0 left-0 z-20" style={{ zIndex: 20 }}>
        <SafeAreaView edges={["top"]}>
          <Pressable
            onPress={handleBackPress}
            className="m-4 w-10 h-10 rounded-full bg-white/80 items-center justify-center"
            style={({ pressed }) => [
              {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              },
              pressed && styles.pressed,
            ]}
          >
            <Ionicons name="chevron-back" size={24} color="#0A9D5C" />
          </Pressable>
        </SafeAreaView>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Image Header */}
        <View className="relative">
          {currentAnt.image ? (
            <Image
              source={{ uri: currentAnt.image }}
              className="w-full h-72"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-72 bg-[#e8f5e0] items-center justify-center">
              <MaterialCommunityIcons name="image" size={64} color="#328e6e" />
            </View>
          )}
        </View>

        {/* Content */}
        <View className="px-5 pt-5">
          <Text className="text-2xl font-bold text-gray-800 mb-1">
            {currentAnt.name}
          </Text>
          <Text className="text-gray-500 italic mb-3">
            {currentAnt.scientificName}
          </Text>

          <View className="flex-row flex-wrap mb-4">
            {currentAnt.tags.map((tag) => (
              <View
                key={tag}
                className="bg-[#0A9D5C] rounded-full px-4 py-1.5 mr-2 mb-2"
              >
                <Text className="text-sm text-white font-medium">{tag}</Text>
              </View>
            ))}
          </View>

          <View className="mb-5">
            <Text className="text-lg font-bold text-gray-800 mb-2">About</Text>
            <Text className="text-gray-600 leading-5">{currentAnt.about}</Text>
          </View>

          <View className="mb-5">
            <Text className="text-lg font-bold text-gray-800 mb-3">
              Classification
            </Text>
            <View className="bg-white border border-gray-100 rounded-xl overflow-hidden">
              <View className="flex-row justify-between py-3 px-4 border-b border-gray-100">
                <Text className="text-gray-600">Family</Text>
                <Text className="text-gray-800 font-medium">
                  {currentAnt.classification.family}
                </Text>
              </View>
              <View className="flex-row justify-between py-3 px-4 border-b border-gray-100">
                <Text className="text-gray-600">Subfamily</Text>
                <Text className="text-gray-800 font-medium">
                  {currentAnt.classification.subfamily}
                </Text>
              </View>
              <View className="flex-row justify-between py-3 px-4">
                <Text className="text-gray-600">Genus</Text>
                <Text className="text-[#0A9D5C] font-medium italic">
                  {currentAnt.classification.genus}
                </Text>
              </View>
            </View>
          </View>

          <View className="mb-5">
            <Text className="text-lg font-bold text-gray-800 mb-2">
              Characteristics
            </Text>
            <Text className="text-gray-600 leading-5">
              {currentAnt.characteristics}
            </Text>
          </View>

          <View className="mb-5">
            <Text className="text-lg font-bold text-gray-800 mb-2">Color</Text>
            <View className="flex-row flex-wrap">
              {currentAnt.colors.map((color) => (
                <Badge
                  key={color}
                  label={color}
                  onPress={() => {}}
                  size="small"
                  showCloseIcon={false}
                />
              ))}
            </View>
          </View>

          <View className="mb-5">
            <Text className="text-lg font-bold text-gray-800 mb-2">
              Habitat
            </Text>
            <View className="flex-row flex-wrap">
              {currentAnt.habitat.map((hab) => (
                <Badge
                  key={hab}
                  label={hab}
                  onPress={() => {}}
                  size="small"
                  showCloseIcon={false}
                />
              ))}
            </View>
          </View>

          <View className="mb-5">
            <Text className="text-lg font-bold text-gray-800 mb-2">
              Distribution in Thailand
            </Text>
            <View className="flex-row flex-wrap">
              {currentAnt.distribution.map((dist) => (
                <Badge
                  key={dist}
                  label={dist}
                  onPress={() => {}}
                  size="small"
                  showCloseIcon={false}
                />
              ))}
            </View>
          </View>

          {currentAnt.provinces.length > 0 && (
            <View className="mb-5">
              <Text className="text-lg font-bold text-gray-800 mb-2">
                Observed Provinces
              </Text>
              <View className="flex-row flex-wrap">
                {currentAnt.provinces.map((province) => (
                  <Badge
                    key={province}
                    label={province}
                    onPress={() => {}}
                    size="small"
                    showCloseIcon={false}
                  />
                ))}
              </View>
            </View>
          )}

          <View className="mb-5">
            <Text className="text-lg font-bold text-gray-800 mb-2">
              Behavior
            </Text>
            <Text className="text-gray-600 leading-5">
              {currentAnt.behavior}
            </Text>
          </View>

          <View className="mb-5">
            <Text className="text-lg font-bold text-gray-800 mb-2">
              Ecological Role
            </Text>
            <Text className="text-gray-600 leading-5">
              {currentAnt.ecologicalRole}
            </Text>
          </View>

          {currentAnt.acceptedTaxon && (
            <AcceptedTaxonSection acceptedTaxon={currentAnt.acceptedTaxon} />
          )}

          {currentAnt.lookalikes.length > 0 && (
            <LookalikesSection
              lookalikes={currentAnt.lookalikes}
              allSpecies={allSpecies}
            />
          )}

          {currentAnt.risk && <RiskSafetySection risk={currentAnt.risk} />}

          <View className="mb-6">
            <Text className="text-lg font-bold text-gray-800 mb-2">
              Contribute
            </Text>
            <View className="flex-row items-center justify-between">
              <Text className="text-gray-600">Help improve our database</Text>
              <PrimaryButton
                title="Suggest Update"
                onPress={handleSuggestUpdate}
                icon="pencil"
                fullWidth={false}
                variant="outlined"
                size="small"
                style={{ shadowColor: "transparent" }}
                textStyle={{ fontWeight: "600" }}
              />
            </View>
          </View>
        </View>

        <View className="h-32" />
      </ScrollView>

      {/* Bottom Fixed Buttons */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100">
        <SafeAreaView edges={["bottom"]}>
          <View className="flex-row px-4 py-3 gap-3">
            <View style={{ flex: 2 }}>
              <View style={{ height: BUTTON_HEIGHT }}>
                <PrimaryButton
                  title={
                    isCurrentInCollection
                      ? "In Collection"
                      : "Add to My Collection"
                  }
                  onPress={handleCollectionPress}
                  disabled={isCollectionLoading}
                  icon={isCurrentInCollection ? "checkmark" : "add"}
                  fullWidth
                  variant={isCurrentInCollection ? "outlined" : "filled"}
                  iconColor={isCurrentInCollection ? "#0A9D5C" : "#FFFFFF"}
                  style={{
                    height: BUTTON_HEIGHT,
                    borderColor: "#0A9D5C",
                    backgroundColor: isCurrentInCollection
                      ? "#E8F6EF"
                      : "#0A9D5C",
                    shadowColor: isCurrentInCollection
                      ? "transparent"
                      : "#0A9D5C",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: isCurrentInCollection ? 0 : 0.3,
                    shadowRadius: 8,
                    elevation: isCurrentInCollection ? 0 : 6,
                  }}
                  textStyle={{
                    color: isCurrentInCollection ? "#0A9D5C" : "#FFFFFF",
                    fontWeight: "600",
                  }}
                />
              </View>
            </View>

            <View style={{ flex: 1 }}>
              <View style={{ height: BUTTON_HEIGHT }}>
                <PrimaryButton
                  title="Ask Chat"
                  onPress={() =>
                    router.push({
                      pathname: "/chatbot",
                      params: { initialAntName: currentAnt.name },
                    })
                  }
                  fullWidth
                  variant="outlined"
                  style={{
                    height: BUTTON_HEIGHT,
                    borderColor: "#0A9D5C",
                    shadowColor: "transparent",
                  }}
                  textStyle={{ fontWeight: "600" }}
                />
              </View>
            </View>
          </View>
        </SafeAreaView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pressed: { opacity: 0.7 },
});
