import React, { useState } from "react";
import { View, ScrollView } from "react-native";
import SectionHeader from "@/components/molecule/SectionHeader";
import CardItem from "@/components/molecule/CardItem";
import AntTopicModal from "@/components/organism/modal/AntTopicModal";
import { ANT_TOPICS, AntTopic } from "../../constants/AntTopics";
import { useTranslatedTopic } from "../../constants/AntTopicsI18n";
import { useTranslation } from "react-i18next";

function TopicCard({
  topic,
  onPress,
}: Readonly<{
  topic: AntTopic;
  onPress: (topic: AntTopic) => void;
}>) {
  const translated = useTranslatedTopic(topic);
  return (
    <CardItem
      variant="species"
      name={translated?.title ?? topic.title}
      scientificName={undefined}
      imageUri={topic.heroImage === "placeholder" ? undefined : topic.heroImage}
      accentColor={topic.accentColor}
      onPress={() => onPress(topic)}
      showMore={false}
      isTopic
    />
  );
}

export default function AntTopicsSection() {
  const [selectedTopic, setSelectedTopic] = useState<AntTopic | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { t } = useTranslation();

  const handlePress = (topic: AntTopic) => {
    setSelectedTopic(topic);
    setModalVisible(true);
  };

  return (
    <>
      <View className="mb-2">
        <SectionHeader
          title={t("home.antTopics.title")}
          subtitle={t("home.antTopics.subtitle")}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingLeft: 20, paddingRight: 10, gap: 12 }}
        >
          {ANT_TOPICS.map((topic) => (
            <View key={topic.id} style={{ width: 200 }}>
              <TopicCard topic={topic} onPress={handlePress} />
            </View>
          ))}
        </ScrollView>
      </View>

      <AntTopicModal
        topic={selectedTopic}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </>
  );
}
