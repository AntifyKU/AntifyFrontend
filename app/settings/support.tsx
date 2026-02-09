import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  Linking,
  Alert,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import Constants from "expo-constants";
import { ScreenHeader } from "@/components/molecule/ScreenHeader";
import { MenuItem } from "@/components/atom/MenuItem";
import PrimaryButton from "@/components/atom/button/PrimaryButton";
import { Section } from "@/components/atom/Section";

type SupportScreen = "main" | "about" | "howto" | "contact" | "terms";

export default function SupportInfoScreen() {
  const [currentScreen, setCurrentScreen] = useState<SupportScreen>("main");
  const appVersion = Constants.expoConfig?.version || "1.0.0";
  const email = "antifyapplication@gmail.com";

  const handleContactEmail = async () => {
    const url = `mailto:${email}`;
    const canOpen = await Linking.canOpenURL(url);
    if (!canOpen) {
      Alert.alert("Email not available", "No email app found on this device.");
      return;
    }
    await Linking.openURL(url);
  };

  const renderMainMenu = () => (
    <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
      <View className="py-4">
        <MenuItem
          icon="information-circle-outline"
          title="About Antify"
          description="Learn more about our mission"
          onPress={() => setCurrentScreen("about")}
          iconColor="#22A45D"
        />

        <MenuItem
          icon="help-circle-outline"
          title="How to Use"
          description="Get started with Antify"
          onPress={() => setCurrentScreen("howto")}
          iconColor="#22A45D"
        />

        <MenuItem
          icon="mail-outline"
          title="Contact"
          description="Get in touch with our team"
          onPress={() => setCurrentScreen("contact")}
          iconColor="#22A45D"
        />

        <MenuItem
          icon="document-text-outline"
          title="Terms & Privacy"
          description="View our policies"
          onPress={() => setCurrentScreen("terms")}
          iconColor="#22A45D"
        />

        {/* App Version */}
        <View className="mt-8 mb-6 rounded-2xl p-6 items-center">
          <Image
            source={require("@/assets/images/icon.png")}
            style={{ width: 140, height: 80 }}
          />
          <Text className="mt-4 text-base text-gray-500">App Version</Text>
          <Text className="text-xl font-bold text-gray-800 mt-1">
            {appVersion}
          </Text>
        </View>
      </View>
    </ScrollView>
  );

  const renderAbout = () => (
    <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
      <View className="py-6">
        {/* Logo/Icon */}
        <View className="items-center mb-8">
          <View className="w-24 h-24 rounded-full bg-[#22A45D] items-center justify-center mb-4">
            <Ionicons name="leaf" size={48} color="#FFFFFF" />
          </View>
          <Text className="text-2xl font-bold text-gray-800">Antify</Text>
          <Text className="text-sm text-gray-500 mt-1">
            Discover the World of Ants
          </Text>
        </View>

        {/* Mission */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-800 mb-3">
            Our Mission
          </Text>
          <Text className="text-base text-gray-600 leading-6">
            Antify is dedicated to helping people discover and identify ant
            species in Thailand. We combine cutting-edge AI technology with
            comprehensive species data to make ant identification accessible to
            everyone.
          </Text>
        </View>

        {/* Features */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-800 mb-3">
            What We Offer
          </Text>
          <FeatureItem
            icon="camera-outline"
            title="AI-Powered Identification"
            description="Identify ant species instantly using your camera"
          />
          <FeatureItem
            icon="book-outline"
            title="Comprehensive Database"
            description="Explore detailed information about Thai ant species"
          />
          <FeatureItem
            icon="location-outline"
            title="Location-Based Discovery"
            description="Find ant species in your area"
          />
          <FeatureItem
            icon="heart-outline"
            title="Personal Collection"
            description="Save and organize your discoveries"
          />
        </View>

        {/* Team/Credits */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-800 mb-3">
            Developed By
          </Text>
          <Text className="text-base text-gray-600 leading-6">
            Antify is developed with passion for entomology and technology. Our
            team consists of developers, biologists, and ant enthusiasts working
            together to create the best ant identification experience.
          </Text>
        </View>

        {/* Copyright */}
        <View className="items-center py-4 mb-4">
          <Text className="text-sm text-gray-400">
            © 2026 Antify. All rights reserved.
          </Text>
        </View>
      </View>
    </ScrollView>
  );

  const renderHowToUse = () => (
    <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
      <View className="py-6">
        <Text className="text-base text-gray-600 mb-6">
          Get started with Antify in just a few simple steps:
        </Text>

        {/* Step-by-step guide */}
        <StepItem
          title="Take a Photo"
          description="Use the camera button on the home screen to capture a clear photo of an ant. Make sure the ant is in focus and well-lit for best results."
          icon="camera-outline"
        />

        <StepItem
          title="AI Identification"
          description="Our AI will analyze the image and identify the ant species. Wait a few seconds for the results to appear."
          icon="sparkles-outline"
        />

        <StepItem
          title="Explore Details"
          description="View detailed information about the identified species, including scientific name, characteristics, habitat, and behavior."
          icon="information-circle-outline"
        />

        <StepItem
          title="Save to Collection"
          description="Add species to your personal collection or mark them as favorites for easy access later."
          icon="bookmark-outline"
        />

        <StepItem
          title="Discover More"
          description="Browse the species catalog, use filters to find specific ants, or explore species in your area."
          icon="compass-outline"
        />

        {/* Tips section */}
        <View className="mt-6 bg-[#E8F5E9] rounded-2xl p-5">
          <View className="flex-row items-center mb-3">
            <Ionicons name="bulb-outline" size={24} color="#22A45D" />
            <Text className="text-lg font-semibold text-gray-800 ml-2">
              Pro Tips
            </Text>
          </View>
          <TipItem text="Take photos in natural daylight for better accuracy" />
          <TipItem text="Get close to the ant but keep it in focus" />
          <TipItem text="Capture different angles for better identification" />
          <TipItem text="Use the location feature to find local species" />
        </View>
      </View>
    </ScrollView>
  );

  const renderContact = () => (
    <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
      <View className="py-6">
        <Text className="text-base text-gray-600 mb-6">
          Have questions, feedback, or need help? We'd love to hear from you!
        </Text>

        {/* Contact Methods */}
        <View className="mb-6">
          <MenuItem
            icon="mail-outline"
            title="Email Us"
            description={email}
            onPress={handleContactEmail}
            iconColor="#22A45D"
          />
        </View>

        {/* Feedback section */}
        <View className="bg-[#E8F5E9] rounded-2xl p-5">
          <View className="flex-row items-center mb-3">
            <Ionicons name="star-outline" size={24} color="#22A45D" />
            <Text className="text-lg font-semibold text-gray-800 ml-2">
              Love Antify?
            </Text>
          </View>
          <Text className="text-base text-gray-600 mb-4">
            Help us improve by leaving a review or sharing your feedback. Your
            input helps us make Antify better for everyone!
          </Text>
          <PrimaryButton
            title="Rate on App Store"
            icon="star"
            size="medium"
            onPress={() => {
              Alert.alert(
                "Rate Antify",
                "Thank you for your support! We'll redirect you to the App Store.",
                [{ text: "OK" }],
              );
              // Replace with actual App Store URL when published
              // Linking.openURL('https://apps.apple.com/app/antify/id...');
            }}
            style={{ shadowColor: "transparent", elevation: 0 }}
          />
        </View>
      </View>
    </ScrollView>
  );

  const renderTermsPrivacy = () => (
    <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
      <View className="py-6">
        {/* Terms of Service */}
        <View className="mb-8">
          <Text className="text-xl font-bold text-gray-800 mb-4">
            Terms of Service
          </Text>

          <Section
            title="1. Acceptance of Terms"
            content="By accessing and using Antify, you accept and agree to be bound by the terms and provision of this agreement."
          />

          <Section
            title="2. Use of Service"
            content="Antify is provided for personal, non-commercial use. You agree to use the app only for lawful purposes and in accordance with these Terms."
          />

          <Section
            title="3. User Content"
            content="You retain all rights to photos and content you upload. By uploading content, you grant Antify a license to use it solely for the purpose of species identification."
          />

          <Section
            title="4. AI Accuracy"
            content="While our AI strives for accuracy, species identification should be verified by experts for critical applications. We do not guarantee 100% accuracy."
          />

          <Section
            title="5. Account Termination"
            content="We reserve the right to terminate or suspend access to our service immediately, without prior notice, for conduct that we believe violates these Terms."
          />
        </View>

        {/* Privacy Policy */}
        <View className="mb-8">
          <Text className="text-xl font-bold text-gray-800 mb-4">
            Privacy Policy
          </Text>

          <Section
            title="Information We Collect"
            content="We collect information you provide directly (email, username), usage data (photos for identification), and device information (location if enabled)."
          />

          <Section
            title="How We Use Your Information"
            content="Your data is used to: provide and improve our services, identify ant species, personalize your experience, and communicate with you about updates."
          />

          <Section
            title="Data Storage"
            content="Your photos and personal data are stored securely in the cloud. We use industry-standard encryption and security measures to protect your information."
          />

          <Section
            title="Data Sharing"
            content="We do not sell your personal information. We may share anonymized data with researchers to improve ant species databases and AI accuracy."
          />

          <Section
            title="Your Rights"
            content="You have the right to access, update, or delete your personal data at any time through your account settings or by contacting us."
          />

          <Section
            title="Location Data"
            content="Location data is used only to show nearby species and is never shared without your consent. You can disable location services in your device settings."
          />
        </View>

        {/* Last Updated */}
        <View className="items-center py-4 mb-4">
          <Text className="text-sm text-gray-400">
            Last updated: February 2026
          </Text>
        </View>

        {/* Contact for Legal */}
        <View className="rounded-2xl p-5 mb-6">
          <Text className="text-base text-gray-600 text-center">
            Questions about our Terms or Privacy Policy?
          </Text>
          <Text
            className="text-base text-[#22A45D] font-semibold text-center mt-2"
            onPress={handleContactEmail}
          >
            Contact us at {email}
          </Text>
        </View>
      </View>
    </ScrollView>
  );

  const getScreenTitle = () => {
    switch (currentScreen) {
      case "about":
        return "About Antify";
      case "howto":
        return "How to Use";
      case "contact":
        return "Contact";
      case "terms":
        return "Terms & Privacy";
      default:
        return "Support & Info";
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View className="py-6">
        <ScreenHeader
          title={getScreenTitle()}
          leftIcon="chevron-back"
          onLeftPress={() => {
            if (currentScreen === "main") {
              router.back();
            } else {
              setCurrentScreen("main");
            }
          }}
        />
      </View>

      {/* Content */}
      {currentScreen === "main" && renderMainMenu()}
      {currentScreen === "about" && renderAbout()}
      {currentScreen === "howto" && renderHowToUse()}
      {currentScreen === "contact" && renderContact()}
      {currentScreen === "terms" && renderTermsPrivacy()}
    </SafeAreaView>
  );
}

// Helper Components

const FeatureItem = ({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) => (
  <View className="flex-row mb-4">
    <View className="w-10 h-10 rounded-full bg-[#E8F5E9] items-center justify-center mr-3">
      <Ionicons name={icon as any} size={20} color="#22A45D" />
    </View>
    <View className="flex-1">
      <Text className="text-base font-semibold text-gray-800">{title}</Text>
      <Text className="text-sm text-gray-600 mt-1">{description}</Text>
    </View>
  </View>
);

const StepItem = ({
  number,
  title,
  description,
  icon,
}: {
  number?: number;
  title: string;
  description: string;
  icon: string;
}) => (
  <View className="mb-6">
    <View className="flex-row items-center mb-2">
      {number && (
        <View className="w-8 h-8 rounded-full bg-[#22A45D] items-center justify-center mr-3">
          <Text className="text-white font-bold">{number}</Text>
        </View>
      )}
      <Ionicons name={icon as any} size={24} color="#22A45D" />
      <Text className="text-lg font-semibold text-gray-800 ml-2">{title}</Text>
    </View>
    <Text className="text-base text-gray-600 leading-6 ml-11">
      {description}
    </Text>
  </View>
);

const TipItem = ({ text }: { text: string }) => (
  <View className="flex-row items-start mb-2">
    <Text className="text-[#22A45D] mr-2">•</Text>
    <Text className="text-sm text-gray-700 flex-1">{text}</Text>
  </View>
);
