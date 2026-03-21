import { IDENTIFY_TOPIC } from "./tips/Identify";
import { LIFECYCLE_TOPIC } from "./tips/Lifecycle";
import { FIRST_AID_TOPIC } from "./tips/FirstAid";
import { HOME_MANAGEMENT_TOPIC } from "./tips/HomeManagement";
import { FUN_FACTS_TOPIC } from "./tips/AntFunFacts";
import { HOBBYIST_TOPIC } from "./tips/Hobbyist";

export type TopicCategory =
  | "identification"
  | "lifecycle"
  | "firstaid"
  | "home"
  | "fun"
  | "hobbyist"
  | "intelligence";

export interface TopicReference {
  title: string;
  url?: string;
  author?: string;
  year?: string;
}

export interface TopicSection {
  heading?: string | null;
  body: string;
  imageKey?: string | null;
  imageCaption?: string | null;
}

export interface TopicTab {
  label: string;
  sections: TopicSection[];
}

export interface AntTopic {
  id: string;
  accentColor: string;
  title: string;
  subtitle: string;
  heroImage?: string;
  images?: Record<string, string>;
  tabs: TopicTab[];
  references: TopicReference[];
}

export const ANT_TOPICS: AntTopic[] = [
  IDENTIFY_TOPIC,
  LIFECYCLE_TOPIC,
  FIRST_AID_TOPIC,
  HOME_MANAGEMENT_TOPIC,
  FUN_FACTS_TOPIC,
  HOBBYIST_TOPIC,
];
