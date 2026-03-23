import {
  View,
  Text,
  ScrollView,
  Pressable,
  StatusBar,
  ActivityIndicator,
  Alert,
  Switch,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSpeciesDetail } from "@/hooks/useSpeciesDetail";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { speciesService } from "@/services/species";
import { ApiError } from "@/services/api";
import TextInput from "@/components/atom/TextInput";
import TextArea from "@/components/atom/TextArea";
import PrimaryButton from "@/components/atom/button/PrimaryButton";
import Badge from "@/components/atom/badge/Badge";
import { useTranslation } from "react-i18next";

type EditParams = { id: string };

type FormData = {
  // Basic Info
  name: string;
  scientific_name: string;
  about: string;
  characteristics: string;
  behavior: string;
  ecological_role: string;
  image: string;
  // Classification
  family: string;
  subfamily: string;
  genus: string;
  // Arrays (comma-separated in text input)
  tags: string;
  colors: string;
  habitat: string;
  distribution: string;
  provinces: string;
  lookalikes: string;
  // Risk
  medical_importance: string;
  sting_or_bite: string;
  has_venom: boolean;
  venom_details: string;
  allergy_risk_note: string;
  // Accepted Taxon
  taxon_scientific_name: string;
  taxon_rank: string;
  taxon_synonyms: string;
};

const MEDICAL_IMPORTANCE_OPTIONS = ["low", "medium", "high"];
const STING_OR_BITE_OPTIONS = ["none", "bite_only", "sting_only", "both"];
const RANK_OPTIONS = ["species", "genus", "subfamily", "family"];

function arrayToString(arr?: string[] | null): string {
  return arr?.join(", ") ?? "";
}

function stringToArray(str: string): string[] {
  return str
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function SectionHeader({ title, icon }: { title: string; icon: string }) {
  return (
    <View className="flex-row items-center mb-3 mt-5">
      <View className="w-8 h-8 rounded-full bg-[#E8F6EF] items-center justify-center mr-3">
        <MaterialCommunityIcons name={icon as any} size={16} color="#0A9D5C" />
      </View>
      <Text className="text-lg font-bold text-gray-800">{title}</Text>
    </View>
  );
}

function FieldLabel({ label, hint }: { label: string; hint?: string }) {
  return (
    <View className="mb-1">
      <Text className="text-base font-semibold text-gray-700">{label}</Text>
      {hint && <Text className="text-xs text-gray-400 mt-0.5">{hint}</Text>}
    </View>
  );
}

function TextFieldInput({
  label,
  value,
  onChangeText,
  placeholder,
  hint,
  multiline,
  numberOfLines,
  keyboardType,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  hint?: string;
  multiline?: boolean;
  numberOfLines?: number;
  keyboardType?: "default" | "url" | "email-address";
}) {
  return (
    <View className="mb-4">
      <FieldLabel label={label} hint={hint} />
      {multiline ? (
        <TextArea
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          numberOfLines={numberOfLines}
          minHeight={90}
          style={{ fontSize: 14, lineHeight: 20 }}
        />
      ) : (
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          keyboardType={keyboardType}
          style={{ fontSize: 14 }}
        />
      )}
    </View>
  );
}

function RadioGroup({
  label,
  options,
  selected,
  onSelect,
  getLabel,
}: {
  label: string;
  options: string[];
  selected: string;
  onSelect: (val: string) => void;
  getLabel?: (val: string) => string;
}) {
  return (
    <View className="mb-4">
      <FieldLabel label={label} />
      <View className="flex-row flex-wrap mt-1">
        {options.map((opt) => {
          const isSelected = selected === opt;
          return (
            <View key={opt} style={{ marginRight: 8, marginBottom: 8 }}>
              <Badge
                label={getLabel ? getLabel(opt) : opt.replace(/_/g, " ")}
                isSelected={isSelected}
                onPress={() => onSelect(opt)}
                size="small"
                showCloseIcon={false}
                selectedBackgroundColor="#0A9D5C"
                unselectedBackgroundColor="#E8F6EF"
              />
            </View>
          );
        })}
      </View>
    </View>
  );
}

function ToggleRow({
  label,
  value,
  onToggle,
  description,
}: {
  label: string;
  value: boolean;
  onToggle: (val: boolean) => void;
  description?: string;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        padding: 14,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        marginBottom: 12,
      }}
    >
      <View style={{ flex: 1, marginRight: 12 }}>
        <Text style={{ fontSize: 14, fontWeight: "600", color: "#1F2937" }}>
          {label}
        </Text>
        {description && (
          <Text style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>
            {description}
          </Text>
        )}
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: "#D1D5DB", true: "#86EFAC" }}
        thumbColor={value ? "#0A9D5C" : "#9CA3AF"}
      />
    </View>
  );
}

export default function EditInfoScreen() {
  const { id } = useLocalSearchParams<EditParams>();
  const { species, loading } = useSpeciesDetail(id);
  const { token, isLoading: isAuthLoading, isAuthenticated, user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [isAccessChecked, setIsAccessChecked] = useState(false);
  const { t } = useTranslation();

  const [form, setForm] = useState<FormData>({
    name: "",
    scientific_name: "",
    about: "",
    characteristics: "",
    behavior: "",
    ecological_role: "",
    image: "",
    family: "",
    subfamily: "",
    genus: "",
    tags: "",
    colors: "",
    habitat: "",
    distribution: "",
    provinces: "",
    lookalikes: "",
    medical_importance: "low",
    sting_or_bite: "bite_only",
    has_venom: false,
    venom_details: "",
    allergy_risk_note: "",
    taxon_scientific_name: "",
    taxon_rank: "genus",
    taxon_synonyms: "",
  });

  // Populate form from species data
  useEffect(() => {
    if (!species) return;
    setForm({
      name: species.name ?? "",
      scientific_name: species.scientific_name ?? "",
      about: species.about ?? "",
      characteristics: species.characteristics ?? "",
      behavior: species.behavior ?? "",
      ecological_role: species.ecological_role ?? "",
      image: species.image ?? "",
      family: species.classification?.family ?? "",
      subfamily: species.classification?.subfamily ?? "",
      genus: species.classification?.genus ?? "",
      tags: arrayToString(species.tags),
      colors: arrayToString(species.colors),
      habitat: arrayToString(species.habitat),
      distribution: arrayToString(species.distribution),
      provinces: arrayToString(species.distribution_v2?.provinces),
      lookalikes: arrayToString(species.lookalikes),
      medical_importance: species.risk?.medical_importance ?? "low",
      sting_or_bite: species.risk?.sting_or_bite ?? "bite_only",
      has_venom: species.risk?.venom?.has_venom ?? false,
      venom_details: species.risk?.venom?.details ?? "",
      allergy_risk_note: species.risk?.allergy_risk_note ?? "",
      taxon_scientific_name: species.accepted_taxon?.scientific_name ?? "",
      taxon_rank: species.accepted_taxon?.rank ?? "genus",
      taxon_synonyms: arrayToString(species.accepted_taxon?.synonyms),
    });
  }, [species]);

  useEffect(() => {
    if (isAuthLoading) return;

    if (!isAuthenticated) {
      Alert.alert(
        t("editInfo.loginRequired"),
        t("editInfo.loginRequiredMessage"),
        [
          {
            text: t("common.cancel"),
            onPress: () => router.back(),
            style: "cancel",
          },
          {
            text: t("common.signIn"),
            onPress: () => router.replace("/(auth)/login"),
          },
        ],
      );
      return;
    }

    if (!isAdmin) {
      Alert.alert(
        t("editInfo.adminAccessRequired"),
        t("editInfo.adminAccessRequiredMessage"),
        [{ text: t("common.ok"), onPress: () => router.back() }],
      );
      return;
    }

    setIsAccessChecked(true);
  }, [isAdmin, isAuthLoading, isAuthenticated, t]);

  const updateField = <K extends keyof FormData>(
    key: K,
    value: FormData[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    // Basic validation
    if (!form.name.trim()) {
      Alert.alert(
        t("editInfo.validationError"),
        t("editInfo.errors.nameRequired"),
      );
      return;
    }
    if (!form.scientific_name.trim()) {
      Alert.alert(
        t("editInfo.validationError"),
        t("editInfo.errors.scientificNameRequired"),
      );
      return;
    }

    if (!token) {
      Alert.alert(
        t("editInfo.unauthorized"),
        t("editInfo.unauthorizedMessage"),
      );
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        scientific_name: form.scientific_name.trim(),
        about: form.about.trim(),
        characteristics: form.characteristics.trim(),
        behavior: form.behavior.trim(),
        ecological_role: form.ecological_role.trim(),
        image: form.image.trim(),
        classification: {
          family: form.family.trim(),
          subfamily: form.subfamily.trim(),
          genus: form.genus.trim(),
        },
        tags: stringToArray(form.tags),
        colors: stringToArray(form.colors),
        habitat: stringToArray(form.habitat),
        distribution: stringToArray(form.distribution),
        distribution_v2: {
          provinces: stringToArray(form.provinces),
        },
        lookalikes: stringToArray(form.lookalikes),
        risk: {
          medical_importance: form.medical_importance,
          sting_or_bite: form.sting_or_bite,
          venom: {
            has_venom: form.has_venom,
            details: form.venom_details.trim(),
          },
          allergy_risk_note: form.allergy_risk_note.trim(),
        },
        accepted_taxon: {
          scientific_name: form.taxon_scientific_name.trim(),
          rank: form.taxon_rank,
          synonyms: stringToArray(form.taxon_synonyms),
        },
      };

      await speciesService.updateSpeciesById(id, payload, token);

      setHasChanges(false);
      Alert.alert(t("editInfo.savedTitle"), t("editInfo.savedMessage"), [
        { text: t("common.ok"), onPress: () => router.back() },
      ]);
    } catch (error: any) {
      const errorMessage =
        error instanceof ApiError
          ? error.message
          : error?.message || "Failed to save changes.";
      Alert.alert(t("common.error"), errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscard = () => {
    if (!hasChanges) {
      router.back();
      return;
    }
    Alert.alert(t("editInfo.discardTitle"), t("editInfo.discardMessage"), [
      { text: t("editInfo.keepEditing"), style: "cancel" },
      {
        text: t("editInfo.discard"),
        style: "destructive",
        onPress: () => router.back(),
      },
    ]);
  };

  if (loading || isAuthLoading || !isAccessChecked) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#FFFFFF",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <StatusBar barStyle="dark-content" />
        <ActivityIndicator size="large" color="#0A9D5C" />
        <Text style={{ marginTop: 12, color: "#6B7280" }}>
          {t("editInfo.loading")}
        </Text>
      </View>
    );
  }

  if (!species) {
    return (
      <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView edges={["top"]}>
          <Pressable onPress={() => router.back()} style={{ margin: 16 }}>
            <Ionicons name="chevron-back" size={24} color="#0A9D5C" />
          </Pressable>
        </SafeAreaView>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            padding: 32,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: "#1F2937",
              marginBottom: 8,
            }}
          >
            {t("detail.notFoundTitle")}
          </Text>
          <Text style={{ color: "#6B7280", textAlign: "center" }}>
            {t("editInfo.notFoundDescription")}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <SafeAreaView edges={["top"]}>
        <View
          style={{ paddingHorizontal: 16, paddingTop: 4, paddingBottom: 10 }}
        >
          <Pressable
            onPress={handleDiscard}
            className="w-10 h-10 rounded-full bg-white items-center justify-center"
            style={({ pressed }) => ({
              opacity: pressed ? 0.7 : 1,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            })}
          >
            <Ionicons name="chevron-back" size={22} color="#0A9D5C" />
          </Pressable>
          <View style={{ marginTop: 10, paddingHorizontal: 4 }}>
            <Text style={{ fontSize: 20, fontWeight: "700", color: "#1F2937" }}>
              {t("editInfo.title")}
            </Text>
            <Text
              style={{ marginTop: 4, color: "#6B7280", fontStyle: "italic" }}
            >
              {species.scientific_name}
            </Text>
          </View>
        </View>
      </SafeAreaView>

      {/* Admin Badge */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#FEF3C7",
          paddingHorizontal: 20,
          paddingVertical: 16,
          gap: 10,
        }}
      >
        <Ionicons name="shield-checkmark" size={14} color="#D97706" />
        <Text style={{ fontSize: 13, color: "#92400E", fontWeight: "600" }}>
          {t("editInfo.adminMode")}
        </Text>
      </View>

      {/* Form */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 140 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* BASIC INFORMATION */}
          <SectionHeader
            title={t("editInfo.sections.basicInformation")}
            icon="information-outline"
          />
          <View
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 16,
              padding: 16,
              borderWidth: 1,
              borderColor: "#E5E7EB",
            }}
          >
            <TextFieldInput
              label={t("editInfo.fields.commonName")}
              value={form.name}
              onChangeText={(v) => updateField("name", v)}
              placeholder={t("editInfo.placeholders.commonName")}
            />
            <TextFieldInput
              label={t("editInfo.fields.scientificName")}
              value={form.scientific_name}
              onChangeText={(v) => updateField("scientific_name", v)}
              placeholder={t("editInfo.placeholders.scientificName")}
            />
            <TextFieldInput
              label={t("editInfo.fields.imageUrl")}
              value={form.image}
              onChangeText={(v) => updateField("image", v)}
              placeholder={t("editInfo.placeholders.imageUrl")}
              keyboardType="url"
            />
            <TextFieldInput
              label={t("detail.about")}
              value={form.about}
              onChangeText={(v) => updateField("about", v)}
              placeholder={t("editInfo.placeholders.about")}
              multiline
              numberOfLines={4}
            />
            <TextFieldInput
              label={t("detail.characteristics")}
              value={form.characteristics}
              onChangeText={(v) => updateField("characteristics", v)}
              placeholder={t("editInfo.placeholders.characteristics")}
              multiline
              numberOfLines={3}
            />
            <TextFieldInput
              label={t("detail.behavior")}
              value={form.behavior}
              onChangeText={(v) => updateField("behavior", v)}
              placeholder={t("editInfo.placeholders.behavior")}
            />
            <TextFieldInput
              label={t("detail.ecologicalRole")}
              value={form.ecological_role}
              onChangeText={(v) => updateField("ecological_role", v)}
              placeholder={t("editInfo.placeholders.ecologicalRole")}
            />
          </View>

          {/* CLASSIFICATION */}
          <SectionHeader title={t("detail.classification")} icon="sitemap" />
          <View
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 16,
              padding: 16,
              borderWidth: 1,
              borderColor: "#E5E7EB",
            }}
          >
            <TextFieldInput
              label={t("detail.family")}
              value={form.family}
              onChangeText={(v) => updateField("family", v)}
              placeholder={t("editInfo.placeholders.family")}
            />
            <TextFieldInput
              label={t("detail.subfamily")}
              value={form.subfamily}
              onChangeText={(v) => updateField("subfamily", v)}
              placeholder={t("editInfo.placeholders.subfamily")}
            />
            <TextFieldInput
              label={t("detail.genus")}
              value={form.genus}
              onChangeText={(v) => updateField("genus", v)}
              placeholder={t("editInfo.placeholders.genus")}
            />
          </View>

          {/* TAGS & ATTRIBUTES */}
          <SectionHeader
            title={t("editInfo.sections.tagsAndAttributes")}
            icon="tag-multiple-outline"
          />
          <View
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 16,
              padding: 16,
              borderWidth: 1,
              borderColor: "#E5E7EB",
            }}
          >
            <TextFieldInput
              label={t("editInfo.fields.tags")}
              value={form.tags}
              onChangeText={(v) => updateField("tags", v)}
              hint={t("editInfo.hints.commaSeparated")}
              placeholder={t("editInfo.placeholders.tags")}
            />
            <TextFieldInput
              label={t("editInfo.fields.colors")}
              value={form.colors}
              onChangeText={(v) => updateField("colors", v)}
              hint={t("editInfo.hints.commaSeparated")}
              placeholder={t("editInfo.placeholders.colors")}
            />
            <TextFieldInput
              label={t("detail.habitat")}
              value={form.habitat}
              onChangeText={(v) => updateField("habitat", v)}
              hint={t("editInfo.hints.commaSeparated")}
              placeholder={t("editInfo.placeholders.habitat")}
            />
            <TextFieldInput
              label={t("editInfo.fields.lookalikes")}
              value={form.lookalikes}
              onChangeText={(v) => updateField("lookalikes", v)}
              hint={t("editInfo.hints.lookalikes")}
              placeholder={t("editInfo.placeholders.lookalikes")}
            />
          </View>

          {/* DISTRIBUTION */}
          <SectionHeader
            title={t("editInfo.sections.distribution")}
            icon="earth"
          />
          <View
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 16,
              padding: 16,
              borderWidth: 1,
              borderColor: "#E5E7EB",
            }}
          >
            <TextFieldInput
              label={t("editInfo.fields.countriesRegions")}
              value={form.distribution}
              onChangeText={(v) => updateField("distribution", v)}
              hint={t("editInfo.hints.commaSeparated")}
              placeholder={t("editInfo.placeholders.distribution")}
            />
            <TextFieldInput
              label={t("editInfo.fields.provinces")}
              value={form.provinces}
              onChangeText={(v) => updateField("provinces", v)}
              hint={t("editInfo.hints.commaSeparated")}
              placeholder={t("editInfo.placeholders.provinces")}
            />
          </View>

          {/* RISK & SAFETY */}
          <SectionHeader
            title={t("common.riskSafety")}
            icon="alert-circle-outline"
          />
          <View
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 16,
              padding: 16,
              borderWidth: 1,
              borderColor: "#E5E7EB",
            }}
          >
            <RadioGroup
              label={t("common.medicalImportance")}
              options={MEDICAL_IMPORTANCE_OPTIONS}
              selected={form.medical_importance}
              onSelect={(v) => updateField("medical_importance", v)}
              getLabel={(v) => t(`common.riskValues.${v}`)}
            />
            <RadioGroup
              label={t("common.stingBite")}
              options={STING_OR_BITE_OPTIONS}
              selected={form.sting_or_bite}
              onSelect={(v) => updateField("sting_or_bite", v)}
              getLabel={(v) => t(`common.riskValues.${v}`)}
            />
            <ToggleRow
              label={t("editInfo.fields.hasVenom")}
              value={form.has_venom}
              onToggle={(v) => updateField("has_venom", v)}
              description={t("editInfo.fields.hasVenomDescription")}
            />
            <TextFieldInput
              label={t("editInfo.fields.venomDetails")}
              value={form.venom_details}
              onChangeText={(v) => updateField("venom_details", v)}
              placeholder={t("editInfo.placeholders.venomDetails")}
              multiline
              numberOfLines={2}
            />
            <TextFieldInput
              label={t("common.allergyRisk")}
              value={form.allergy_risk_note}
              onChangeText={(v) => updateField("allergy_risk_note", v)}
              placeholder={t("editInfo.placeholders.allergyRisk")}
              multiline
              numberOfLines={2}
            />
          </View>

          {/* ACCEPTED TAXON */}
          <SectionHeader
            title={t("editInfo.sections.acceptedTaxon")}
            icon="dna"
          />
          <View
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 16,
              padding: 16,
              borderWidth: 1,
              borderColor: "#E5E7EB",
            }}
          >
            <TextFieldInput
              label={t("detail.scientificName")}
              value={form.taxon_scientific_name}
              onChangeText={(v) => updateField("taxon_scientific_name", v)}
              placeholder={t("editInfo.placeholders.scientificName")}
            />
            <RadioGroup
              label={t("common.rank")}
              options={RANK_OPTIONS}
              selected={form.taxon_rank}
              onSelect={(v) => updateField("taxon_rank", v)}
              getLabel={(v) => t(`common.ranks.${v}`)}
            />
            <TextFieldInput
              label={t("common.synonyms")}
              value={form.taxon_synonyms}
              onChangeText={(v) => updateField("taxon_synonyms", v)}
              hint={t("editInfo.hints.commaSeparated")}
              placeholder={t("editInfo.placeholders.synonyms")}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100">
        <SafeAreaView edges={["bottom"]}>
          <View className="flex-row px-4 py-3 gap-3">
            <View style={{ flex: 1 }}>
              <PrimaryButton
                title={t("editInfo.discard")}
                onPress={handleDiscard}
                variant="outlined"
                fullWidth
                style={{ borderColor: "#D1D5DB", shadowColor: "transparent" }}
                textStyle={{ color: "#6B7280", fontWeight: "600" }}
              />
            </View>
            <View style={{ flex: 2 }}>
              <PrimaryButton
                title={
                  isSaving ? t("common.saving") : t("editInfo.saveChanges")
                }
                onPress={handleSave}
                disabled={isSaving || !hasChanges}
                icon={isSaving ? undefined : "save-outline"}
                fullWidth
                style={{
                  backgroundColor: "#0A9D5C",
                  shadowColor: "#0A9D5C",
                }}
                textStyle={{ color: "#FFFFFF", fontWeight: "700" }}
              />
            </View>
          </View>
        </SafeAreaView>
      </View>
    </View>
  );
}
