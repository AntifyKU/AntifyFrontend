import React from "react";
import { View } from "react-native";
import Badge from "@/components/atom/badge/Badge";
import { RiskInfo } from "@/types/api";
import { useTranslation } from "react-i18next";

interface RiskTagsProps {
  riskInfo?: RiskInfo;
  size?: "small" | "medium";
}

export default function RiskTags({
  riskInfo,
  size = "small",
}: Readonly<RiskTagsProps>) {
  const { t } = useTranslation();

  if (!riskInfo) return null;

  const tags = [];

  if (riskInfo.venom?.has_venom) {
    tags.push(
      <Badge
        key="venom"
        label={t("badge.venomous")}
        onPress={() => {}}
        size={size}
        showCloseIcon={false}
        icon="alert-circle"
        iconType="material-community"
        iconColor="#FFFFFF"
        selectedBackgroundColor="#ef4444"
        isSelected={true}
      />,
    );
  }

  if (riskInfo.medical_importance === "medically_significant") {
    tags.push(
      <Badge
        key="medical"
        label={t("badge.medically_significant")}
        onPress={() => {}}
        size={size}
        showCloseIcon={false}
        icon="hospital-box-outline"
        iconType="material-community"
        iconColor="#FFFFFF"
        selectedBackgroundColor="#f97316"
        isSelected={true}
      />,
    );
  } else if (riskInfo.medical_importance === "can_cause_allergic_reaction") {
    tags.push(
      <Badge
        key="allergy"
        label={t("badge.allergy_risk")}
        onPress={() => {}}
        size={size}
        showCloseIcon={false}
        icon="alert-octagon-outline"
        iconType="material-community"
        iconColor="#FFFFFF"
        selectedBackgroundColor="#f97316"
        isSelected={true}
      />,
    );
  }

  if (tags.length === 0) {
    if (riskInfo.sting_or_bite === "sting") {
      tags.push(
        <Badge
          key="sting"
          label={t("badge.stings")}
          onPress={() => {}}
          size={size}
          showCloseIcon={false}
          icon="lightning-bolt-outline"
          iconType="material-community"
          iconColor="#FFFFFF"
          selectedBackgroundColor="#f59e0b"
          isSelected={true}
        />,
      );
    } else if (riskInfo.sting_or_bite === "bite_only") {
      tags.push(
        <Badge
          key="bite"
          label={t("badge.bites")}
          onPress={() => {}}
          size={size}
          showCloseIcon={false}
          icon="tooth-outline"
          iconType="material-community"
          iconColor="#FFFFFF"
          selectedBackgroundColor="#eab308"
          isSelected={true}
        />,
      );
    }
  }

  if (tags.length === 0) return null;

  return <View className="flex-row flex-wrap mt-1">{tags}</View>;
}
