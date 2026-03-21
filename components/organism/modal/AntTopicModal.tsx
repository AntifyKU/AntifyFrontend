import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  ScrollView,
  Pressable,
  Image,
  StatusBar,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { ScreenHeader } from "@/components/molecule/ScreenHeader";
import { AntTopic, TopicSection } from "@/constants/AntTopics";
import { useTranslatedTopic } from "@/constants/AntTopicsI18n";

interface AntTopicModalProps {
  readonly topic: AntTopic | null;
  readonly visible: boolean;
  readonly onClose: () => void;
}

function RichText({ text, style }: Readonly<{ text: string; style?: object }>) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <Text style={style}>
      {parts.map((part, i) => {
        const key = `${part}-${i}`;
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <Text key={key} style={styles.bold}>
              {part.slice(2, -2)}
            </Text>
          );
        }
        return <Text key={key}>{part}</Text>;
      })}
    </Text>
  );
}

function ImagePlaceholder({
  imageKey,
  caption,
}: Readonly<{
  imageKey: string;
  caption?: string | null;
}>) {
  return (
    <View style={styles.imageWrapper}>
      <View style={styles.placeholderBox}>
        <Ionicons name="image-outline" size={28} color="#6ee7b7" />
        <Text style={styles.placeholderKey}>[IMG: {imageKey}]</Text>
      </View>
      {caption ? (
        <View style={styles.captionRow}>
          <Text style={styles.caption}>{caption}</Text>
        </View>
      ) : null}
    </View>
  );
}

function SectionImage({
  uri,
  imageKey,
  caption,
}: Readonly<{
  uri: string;
  imageKey: string;
  caption?: string | null;
}>) {
  const [ratio, setRatio] = useState(1);

  useEffect(() => {
    Image.getSize(uri, (w, h) => {
      setRatio(w / h);
    });
  }, [uri]);

  if (uri === "placeholder") {
    return <ImagePlaceholder imageKey={imageKey} caption={caption} />;
  }
  return (
    <View style={styles.imageWrapper}>
      <Image
        source={{ uri }}
        style={{ width: "100%", aspectRatio: ratio }}
        resizeMode="cover"
      />
      {caption ? (
        <View style={styles.captionRow}>
          <Text style={styles.caption}>{caption}</Text>
        </View>
      ) : null}
    </View>
  );
}

function TabContent({
  sections,
  images,
  references,
  isReferenceTab,
}: Readonly<{
  sections: TopicSection[];
  images?: Record<string, string>;
  references?: any[];
  isReferenceTab?: boolean;
}>) {
  if (isReferenceTab && references) {
    return (
      <ScrollView
        showsVerticalScrollIndicator={true}
        contentContainerStyle={styles.tabScrollContent}
      >
        {references.map((ref, idx) => (
          <View key={`${ref.title}-${idx}`} style={styles.refItem}>
            <Text style={styles.refItemText}>
              <Text style={{ fontWeight: "600" }}>[{idx + 1}]</Text>{" "}
              {ref.author ? `${ref.author} ` : ""}
              {ref.year ? `(${ref.year}). ` : ""}
              <Text style={{ fontStyle: "italic" }}>{ref.title}</Text>
            </Text>
          </View>
        ))}
        <View style={{ height: 32 }} />
      </ScrollView>
    );
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.tabScrollContent}
    >
      {sections.map((section, idx) => {
        const imageUri =
          section.imageKey && images
            ? (images[section.imageKey] ?? null)
            : null;

        const sectionKey = `${section.heading}-${section.body}-${idx}`;
        return (
          <View key={sectionKey}>
            {section.heading ? (
              <Text style={styles.sectionHeading}>{section.heading}</Text>
            ) : null}

            <RichText text={section.body} style={styles.body} />

            {imageUri ? (
              <View className="mt-3">
                <SectionImage
                  uri={imageUri}
                  imageKey={section.imageKey!}
                  caption={section.imageCaption}
                />
              </View>
            ) : null}

            {idx < sections.length - 1 && (
              <View style={styles.sectionDivider} />
            )}
          </View>
        );
      })}
      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

export default function AntTopicModal({
  topic: rawTopic,
  visible,
  onClose,
}: AntTopicModalProps) {
  const { t } = useTranslation();
  const topic = useTranslatedTopic(rawTopic);
  const [activeTab, setActiveTab] = useState(0);

  React.useEffect(() => {
    setActiveTab(0);
  }, [topic?.id]);

  if (!topic) return null;

  // Tab labels are already translated by useTranslatedTopic
  const referencesLabel = t("common.ref_tabs.references");

  const tabsWithReferences =
    topic.references.length > 0
      ? [...topic.tabs, { label: referencesLabel, sections: [] }]
      : topic.tabs;

  const isReferenceTab =
    tabsWithReferences[activeTab]?.label === referencesLabel;

  const heroIsPlaceholder =
    !topic.heroImage || topic.heroImage === "placeholder";

  // Title & subtitle are already translated by useTranslatedTopic
  const displayTitle = topic.title;
  const displaySubtitle = topic.subtitle;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView className="flex-1 bg-white">
        <StatusBar barStyle="dark-content" />
        <View className="w-12 h-1 bg-gray-300 rounded-full mx-auto mt-3" />

        {/* Header */}
        <View className="py-6 border-b border-gray-200">
          <ScreenHeader
            title={displayTitle}
            leftIcon="close"
            onLeftPress={onClose}
          />
        </View>

        {/* Hero */}
        <View style={[styles.hero]}>
          {heroIsPlaceholder ? null : (
            <Image
              source={{ uri: topic.heroImage }}
              style={StyleSheet.absoluteFillObject}
              resizeMode="cover"
            />
          )}
          <View style={styles.heroGradient} />
          <View style={styles.heroTextContainer}>
            <Text style={styles.heroTitle}>{displayTitle}</Text>
            <Text style={styles.heroSubtitle}>{displaySubtitle}</Text>
          </View>
        </View>

        {/* Tabs */}
        <View style={{ borderBottomWidth: 1, borderBottomColor: "#f3f4f6" }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabBar}
          >
            {tabsWithReferences.map((tab, idx) => {
              const isActive = idx === activeTab;
              return (
                <Pressable
                  key={tab.label}
                  onPress={() => setActiveTab(idx)}
                  style={styles.tabItem}
                >
                  <Text
                    style={[
                      styles.tabLabel,
                      isActive
                        ? { color: "#0A9D5C", fontWeight: "700" }
                        : { color: "#6B7280" },
                    ]}
                  >
                    {tab.label}
                  </Text>

                  {isActive && <View style={styles.tabUnderline} />}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Content */}
        <View className="flex-1">
          <TabContent
            sections={tabsWithReferences[activeTab]?.sections ?? []}
            images={topic.images}
            references={topic.references}
            isReferenceTab={isReferenceTab}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  hero: {
    height: 160,
    justifyContent: "flex-end",
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  heroTextContainer: {
    padding: 16,
    paddingBottom: 16,
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#fff",
    lineHeight: 24,
  },
  heroSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginTop: 3,
    lineHeight: 16,
  },

  // Tabs
  tabBar: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginRight: 8,
    position: "relative",
  },
  tabLabel: {
    fontSize: 13,
  },
  tabUnderline: {
    position: "absolute",
    bottom: 0,
    left: 4,
    right: 4,
    height: 2,
    borderRadius: 1,
    backgroundColor: "#0A9D5C",
  },

  // Tab content
  tabScrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
    marginTop: 4,
  },
  body: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 22,
  },
  bold: {
    fontWeight: "700",
    color: "#111827",
  },
  sectionDivider: {
    height: 1,
    backgroundColor: "#d1d5db",
    marginVertical: 16,
  },

  // Images
  imageWrapper: {
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#f3f4f6",
    marginTop: 2,
  },
  sectionImage: {
    width: "100%",
    height: undefined,
    aspectRatio: 1.5,
  },
  placeholderBox: {
    width: "100%",
    height: 150,
    backgroundColor: "#d1fae5",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  placeholderKey: {
    fontSize: 11,
    fontWeight: "700",
    color: "#059669",
  },
  captionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#f9fafb",
  },
  caption: {
    fontSize: 11,
    color: "#6B7280",
    fontStyle: "italic",
    flex: 1,
    lineHeight: 15,
  },

  // References footer
  referencesBlock: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    backgroundColor: "#fafafa",
  },
  referencesHeader: {
    marginBottom: 10,
  },
  referencesLabel: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "700",
  },
  refItem: {
    flexDirection: "row",
    paddingVertical: 2,
  },
  refItemText: {
    fontSize: 12,
    color: "#4B5563",
    lineHeight: 18,
  },
});
