import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import TextInput from "@/components/atom/TextInput";
import TextArea from "@/components/atom/TextArea";
import PrimaryButton from "@/components/atom/button/PrimaryButton";
import Badge from "@/components/atom/badge/Badge";
import RequestTypeCard from "@/components/atom/Requesttypecard";
import { useAuth } from "@/context/AuthContext";
import { ScreenHeader } from "@/components/molecule/ScreenHeader";

type RequestType = "update" | "new";
type RequestStatus = "draft" | "pending" | "approved" | "rejected";

interface RequestData {
  id?: string;
  type: RequestType;
  status: RequestStatus;
  commonName: string;
  scientificName: string;
  family: string;
  subfamily: string;
  genus: string;
  characteristics: string;
  colors: string[];
  habitat: string[];
  distribution: string[];
  behavior: string;
  ecologicalRole: string;
  submittedBy?: string;
  submittedAt?: string;
  lastUpdated?: string;
}

export default function RequestPage() {
  const { user, isAuthenticated } = useAuth();
  const params = useLocalSearchParams<{ id?: string }>();
  const isAdmin = user?.role === "admin";
  const isEditing = !!params.id;

  // Check authentication on mount
  useEffect(() => {
    if (!isAuthenticated) {
      Alert.alert(
        "Login Required",
        "You must be logged in to submit species information requests",
        [
          { text: "Cancel", onPress: () => router.back(), style: "cancel" },
          {
            text: "Log In",
            onPress: () => {
              router.back();
              router.push("/(auth)/login");
            },
          },
        ],
      );
    }
  }, [isAuthenticated]);

  // Mock data
  const [request, setRequest] = useState<RequestData>({
    id: params.id,
    type: "update",
    status: isEditing ? "pending" : "draft",
    commonName: isEditing ? "Weaver Ant" : "",
    scientificName: isEditing ? "Oecophylla smaragdina" : "",
    family: isEditing ? "Formicidae" : "",
    subfamily: isEditing ? "Formicinae" : "",
    genus: isEditing ? "Oecophylla" : "",
    characteristics: isEditing
      ? "Workers range from 5-10mm, with distinctive orange to red-brown coloring"
      : "",
    colors: isEditing ? ["Orange", "Red-brown"] : [],
    habitat: isEditing ? ["Tropical Trees", "Orchards"] : [],
    distribution: isEditing ? ["Central", "East", "South"] : [],
    behavior: isEditing ? "Highly social with complex division of labor" : "",
    ecologicalRole: isEditing ? "Important biological pest control agents" : "",
    submittedBy: isEditing ? "john.doe@example.com" : undefined,
    submittedAt: isEditing ? "2025-12-24T15:46:00Z" : undefined,
    lastUpdated: isEditing ? "2025-12-24T15:46:00Z" : undefined,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [newColorInput, setNewColorInput] = useState("");
  const [newHabitatInput, setNewHabitatInput] = useState("");
  const [newDistributionInput, setNewDistributionInput] = useState("");

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const addTag = (
    field: "colors" | "habitat" | "distribution",
    value: string,
  ) => {
    if (!value.trim()) return;

    setRequest((prev) => ({
      ...prev,
      [field]: [...prev[field], value.trim()],
    }));

    if (field === "colors") setNewColorInput("");
    if (field === "habitat") setNewHabitatInput("");
    if (field === "distribution") setNewDistributionInput("");
  };

  const removeTag = (
    field: "colors" | "habitat" | "distribution",
    index: number,
  ) => {
    setRequest((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    if (!request.commonName.trim()) {
      Alert.alert("Error", "Common Name is required");
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      Alert.alert(
        "Success",
        isEditing
          ? "Request updated successfully"
          : "Request submitted successfully",
        [{ text: "OK", onPress: () => router.back() }],
      );
    } catch {
      Alert.alert("Error", "Failed to submit request");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Request",
      "Are you sure you want to delete this request? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setIsLoading(true);
            try {
              await new Promise((resolve) => setTimeout(resolve, 1000));
              router.back();
            } catch {
              Alert.alert("Error", "Failed to delete request");
            } finally {
              setIsLoading(false);
            }
          },
        },
      ],
    );
  };

  const handleApprove = async () => {
    Alert.alert(
      "Approve Request",
      "Are you sure you want to approve this request? The species information will be updated.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Approve",
          onPress: async () => {
            setIsLoading(true);
            try {
              await new Promise((resolve) => setTimeout(resolve, 1000));
              Alert.alert("Success", "Request approved successfully", [
                { text: "OK", onPress: () => router.back() },
              ]);
            } catch {
              Alert.alert("Error", "Failed to approve request");
            } finally {
              setIsLoading(false);
            }
          },
        },
      ],
    );
  };

  const handleReject = async () => {
    Alert.alert(
      "Reject Request",
      "Are you sure you want to reject this request?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reject",
          style: "destructive",
          onPress: async () => {
            setIsLoading(true);
            try {
              await new Promise((resolve) => setTimeout(resolve, 1000));
              Alert.alert("Success", "Request rejected", [
                { text: "OK", onPress: () => router.back() },
              ]);
            } catch {
              Alert.alert("Error", "Failed to reject request");
            } finally {
              setIsLoading(false);
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View className="py-6">
        <ScreenHeader
          title="Species Information Request"
          leftIcon="chevron-back"
          onLeftPress={() => router.back()}
        />
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-5 py-4">
          {/* Admin Review Info */}
          {isAdmin && isEditing && (
            <View className="mb-6 p-4 bg-blue-50 rounded-xl">
              <View className="flex-row items-center mb-2">
                <Ionicons name="information-circle" size={20} color="#3B82F6" />
                <Text className="ml-2 text-sm font-semibold text-blue-900">
                  Request Information
                </Text>
              </View>
              <Text className="text-sm text-blue-800">
                <Text className="font-medium">Submitted by:</Text>{" "}
                {request.submittedBy}
              </Text>
              {request.lastUpdated && (
                <Text className="text-sm text-blue-800 mt-1">
                  <Text className="font-medium">Last Updated:</Text>{" "}
                  {formatDate(request.lastUpdated)}
                </Text>
              )}
            </View>
          )}

          {/* Description */}
          <Text className="text-gray-600 mb-6">
            Submit your species information request below. All requests are
            reviewed by our team of experts before being added to the database.
          </Text>

          {/* Request Type */}
          <View className="mb-6">
            <Text className="text-base font-semibold text-gray-900 mb-3">
              Request Type
            </Text>

            <RequestTypeCard
              type="update"
              selected={request.type === "update"}
              onPress={() =>
                setRequest((prev) => ({ ...prev, type: "update" }))
              }
            />

            <View className="h-3" />

            <RequestTypeCard
              type="new"
              selected={request.type === "new"}
              onPress={() => setRequest((prev) => ({ ...prev, type: "new" }))}
            />
          </View>

          {/* Species Information */}
          <Text className="text-base font-semibold text-gray-900 mb-4">
            Species Information
          </Text>

          <TextInput
            label="Common Name *"
            placeholder="e.g., Weaver Ant"
            value={request.commonName}
            onChangeText={(text) =>
              setRequest((prev) => ({ ...prev, commonName: text }))
            }
            containerStyle={{ marginBottom: 16 }}
          />

          <TextInput
            label="Scientific Name *"
            placeholder="e.g., Oecophylla smaragdina"
            value={request.scientificName}
            onChangeText={(text) =>
              setRequest((prev) => ({ ...prev, scientificName: text }))
            }
            containerStyle={{ marginBottom: 16 }}
          />

          {/* Classification */}
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Classification *
          </Text>

          <View className="flex-row gap-2 mb-3">
            <View className="flex-1">
              <Text className="text-xs text-gray-600 mb-2">Family</Text>
              <TextInput
                placeholder="Formicidae"
                value={request.family}
                onChangeText={(text) =>
                  setRequest((prev) => ({ ...prev, family: text }))
                }
              />
            </View>
            <View className="flex-1">
              <Text className="text-xs text-gray-600 mb-2">Subfamily</Text>
              <TextInput
                placeholder="Formicinae"
                value={request.subfamily}
                onChangeText={(text) =>
                  setRequest((prev) => ({ ...prev, subfamily: text }))
                }
              />
            </View>
          </View>

          <View className="mb-4">
            <Text className="text-xs text-gray-600 mb-2">Genus</Text>
            <TextInput
              placeholder="Oecophylla"
              value={request.genus}
              onChangeText={(text) =>
                setRequest((prev) => ({ ...prev, genus: text }))
              }
            />
          </View>

          <TextArea
            label="Characteristics *"
            placeholder="Describe physical characteristics..."
            value={request.characteristics}
            onChangeText={(text) =>
              setRequest((prev) => ({ ...prev, characteristics: text }))
            }
            minHeight={120}
            containerStyle={{ marginBottom: 16 }}
          />

          {/* Color */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Color *
            </Text>
            <View className="flex-row flex-wrap mb-2">
              {request.colors.map((color, index) => (
                <Badge
                  key={index}
                  label={color}
                  onPress={() => removeTag("colors", index)}
                  size="small"
                  showCloseIcon
                />
              ))}
            </View>
            <View className="flex-row gap-2">
              <View className="flex-1">
                <TextInput
                  placeholder="Add color..."
                  value={newColorInput}
                  onChangeText={setNewColorInput}
                  onSubmitEditing={() => addTag("colors", newColorInput)}
                />
              </View>
              <TouchableOpacity
                onPress={() => addTag("colors", newColorInput)}
                className="w-12 h-12 bg-green-500 rounded-xl items-center justify-center"
              >
                <Ionicons name="add" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Habitat */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Habitat *
            </Text>
            <View className="flex-row flex-wrap mb-2">
              {request.habitat.map((hab, index) => (
                <Badge
                  key={index}
                  label={hab}
                  onPress={() => removeTag("habitat", index)}
                  size="small"
                  showCloseIcon
                />
              ))}
            </View>
            <View className="flex-row gap-2">
              <View className="flex-1">
                <TextInput
                  placeholder="Add habitat..."
                  value={newHabitatInput}
                  onChangeText={setNewHabitatInput}
                  onSubmitEditing={() => addTag("habitat", newHabitatInput)}
                />
              </View>
              <TouchableOpacity
                onPress={() => addTag("habitat", newHabitatInput)}
                className="w-12 h-12 bg-green-500 rounded-xl items-center justify-center"
              >
                <Ionicons name="add" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Distribution */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Distribution *
            </Text>
            <View className="flex-row flex-wrap mb-2">
              {request.distribution.map((dist, index) => (
                <Badge
                  key={index}
                  label={dist}
                  onPress={() => removeTag("distribution", index)}
                  size="small"
                  showCloseIcon
                />
              ))}
            </View>
            <View className="flex-row gap-2">
              <View className="flex-1">
                <TextInput
                  placeholder="Add distribution..."
                  value={newDistributionInput}
                  onChangeText={setNewDistributionInput}
                  onSubmitEditing={() =>
                    addTag("distribution", newDistributionInput)
                  }
                />
              </View>
              <TouchableOpacity
                onPress={() => addTag("distribution", newDistributionInput)}
                className="w-12 h-12 bg-green-500 rounded-xl items-center justify-center"
              >
                <Ionicons name="add" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          <TextArea
            label="Behavior *"
            placeholder="Describe behavioral traits..."
            value={request.behavior}
            onChangeText={(text) =>
              setRequest((prev) => ({ ...prev, behavior: text }))
            }
            minHeight={120}
            containerStyle={{ marginBottom: 16 }}
          />

          <TextArea
            label="Ecological Role *"
            placeholder="Describe ecological role..."
            value={request.ecologicalRole}
            onChangeText={(text) =>
              setRequest((prev) => ({ ...prev, ecologicalRole: text }))
            }
            minHeight={120}
            containerStyle={{ marginBottom: 16 }}
          />

          {/* Supporting Images */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-3">
              Supporting Images
            </Text>
            <TouchableOpacity className="border-2 border-dashed border-gray-300 rounded-xl p-8 items-center">
              <Ionicons name="image-outline" size={48} color="#9CA3AF" />
              <Text className="mt-2 text-sm text-blue-500">Upload Images</Text>
            </TouchableOpacity>
          </View>

          {/* Bottom Buttons - Now inside ScrollView */}
          <View className="mb-6">
            {isAdmin && isEditing ? (
              // Admin buttons
              <View className="flex-row gap-3">
                <View className="flex-1">
                  <PrimaryButton
                    title="Cancel"
                    onPress={() => router.back()}
                    variant="outlined"
                    fullWidth
                    style={{ shadowColor: "transparent" }}
                  />
                </View>
                <View className="flex-1">
                  <PrimaryButton
                    title="Reject"
                    onPress={handleReject}
                    disabled={isLoading}
                    fullWidth
                    style={{
                      backgroundColor: "#EF4444",
                      borderColor: "#EF4444",
                    }}
                  />
                </View>
                <View className="flex-1">
                  <PrimaryButton
                    title="Approve"
                    onPress={handleApprove}
                    disabled={isLoading}
                    icon="checkmark"
                    fullWidth
                  />
                </View>
              </View>
            ) : isEditing ? (
              // User edit buttons
              <View className="flex-row gap-3">
                <View className="flex-1">
                  <PrimaryButton
                    title="Cancel"
                    onPress={() => router.back()}
                    variant="outlined"
                    fullWidth
                    style={{ shadowColor: "transparent" }}
                  />
                </View>
                <View className="flex-1">
                  <PrimaryButton
                    title="Delete"
                    onPress={handleDelete}
                    disabled={isLoading}
                    fullWidth
                    style={{
                      backgroundColor: "#EF4444",
                      borderColor: "#EF4444",
                    }}
                  />
                </View>
                <View className="flex-1">
                  <PrimaryButton
                    title="Update"
                    onPress={handleSubmit}
                    disabled={isLoading}
                    icon="checkmark"
                    fullWidth
                  />
                </View>
              </View>
            ) : (
              // New request button
              <PrimaryButton
                title="Submit Request"
                onPress={handleSubmit}
                disabled={isLoading}
                icon="send"
                fullWidth
              />
            )}
          </View>
        </View>
      </ScrollView>

      {/* Loading Overlay */}
      {isLoading && (
        <View className="absolute inset-0 bg-black/30 items-center justify-center">
          <View className="bg-white p-6 rounded-2xl">
            <ActivityIndicator size="large" color="#0A9D5C" />
            <Text className="mt-3 text-gray-700">Processing...</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
