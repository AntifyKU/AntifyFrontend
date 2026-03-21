import React from 'react';
import { View } from 'react-native';
import Badge from '@/components/atom/badge/Badge';
import { RiskInfo } from '@/types/api';
import { useTranslation } from "react-i18next";

interface RiskTagsProps {
    riskInfo?: RiskInfo;
    size?: 'small' | 'medium';
}

export default function RiskTags({ riskInfo, size = 'small' }: RiskTagsProps) {
    const { t } = useTranslation();

    if (!riskInfo) return null;

    const tags = [];

    // Venom tag
    if (riskInfo.venom?.has_venom) {
        tags.push(
            <Badge
                key="venom"
                label={t("badges.Venomous")}
                onPress={() => { }}
                size={size}
                showCloseIcon={false}
                icon="alert-circle"
                iconType="material-community"
                iconColor="#FFFFFF"
                selectedBackgroundColor="#ef4444" // red-500
                isSelected={true}
            />
        );
    }

    // Medical importance tag
    if (riskInfo.medical_importance === 'medically_significant') {
        tags.push(
            <Badge
                key="medical"
                label={t("badges.Medically Significant")}
                onPress={() => { }}
                size={size}
                showCloseIcon={false}
                icon="hospital-box-outline"
                iconType="material-community"
                iconColor="#FFFFFF"
                selectedBackgroundColor="#f97316" // orange-500
                isSelected={true}
            />
        );
    } else if (riskInfo.medical_importance === 'can_cause_allergic_reaction') {
        tags.push(
            <Badge
                key="allergy"
                label={t("badges.Allergy Risk")}
                onPress={() => { }}
                size={size}
                showCloseIcon={false}
                icon="alert-octagon-outline"
                iconType="material-community"
                iconColor="#FFFFFF"
                selectedBackgroundColor="#f97316" // orange-500
                isSelected={true}
            />
        );
    }

    // Sting or bite tag (only if not already highly warned)
    if (tags.length === 0) {
        if (riskInfo.sting_or_bite === 'sting') {
            tags.push(
                <Badge
                    key="sting"
                    label={t("badges.Stings")}
                    onPress={() => { }}
                    size={size}
                    showCloseIcon={false}
                    icon="lightning-bolt-outline"
                    iconType="material-community"
                    iconColor="#FFFFFF"
                    selectedBackgroundColor="#f59e0b" // amber-500
                    isSelected={true}
                />
            );
        } else if (riskInfo.sting_or_bite === 'bite_only') {
            tags.push(
                <Badge
                    key="bite"
                    label={t("badges.Bites")}
                    onPress={() => { }}
                    size={size}
                    showCloseIcon={false}
                    icon="tooth-outline"
                    iconType="material-community"
                    iconColor="#FFFFFF"
                    selectedBackgroundColor="#eab308" // yellow-500
                    isSelected={true}
                />
            );
        }
    }

    if (tags.length === 0) return null;

    return (
        <View className="flex-row flex-wrap mt-1">
            {tags}
        </View>
    );
}
