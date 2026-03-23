import { useTranslation } from "react-i18next";
import { AntTopic } from "@/constants/AntTopics";

/**
 * Maps each topic id to its i18n namespace key AND the ordered list of
 * tab keys / section keys that mirror the tabs[] array in the TS data file.
 *
 * The arrays MUST stay in the same order as the tabs / sections defined
 * in each topic's TS file so that index-based lookup stays in sync.
 */
const TOPIC_STRUCTURE: Record<
  string,
  {
    ns: string;
    tabs: { key: string; sections: string[] }[];
  }
> = {
  identification_tips: {
    ns: "identification_tips",
    tabs: [
      {
        key: "anatomy",
        sections: ["intro", "basicBodyStructure", "petiole", "eyes"],
      },
      {
        key: "features",
        sections: [
          "antennae",
          "mandibles",
          "workerSize",
          "sizeFieldGuide",
          "colorTexture",
          "behaviorHabitat",
        ],
      },
      {
        key: "fieldGuide",
        sections: ["photographyTips", "commonMistakes", "quickChecklist"],
      },
    ],
  },

  lifecycle: {
    ns: "lifecycle",
    tabs: [
      {
        key: "stages",
        sections: ["intro", "egg", "larva", "pupa", "adult"],
      },
      {
        key: "colony",
        sections: ["casteSystem", "nuptialFlight", "colonyFounding"],
      },
      {
        key: "growth",
        sections: ["colonyDevelopment", "temperature", "lifespan"],
      },
    ],
  },

  first_aid: {
    ns: "first_aid",
    tabs: [
      {
        key: "basics",
        sections: [
          "intro",
          "bitesVsStings",
          "normalReaction",
          "basicTreatment",
        ],
      },
      {
        key: "allergicReactions",
        sections: [
          "threeLevels",
          "recognizingAnaphylaxis",
          "emergencyResponse",
          "higherRisk",
        ],
      },
      {
        key: "speciesPrevention",
        sections: [
          "dangerousSpecies",
          "prevention",
          "longTermManagement",
          "specialSituations",
        ],
      },
    ],
  },

  home_management: {
    ns: "home_management",
    tabs: [
      {
        key: "prevention",
        sections: [
          "intro",
          "entryPoints",
          "foodSources",
          "waterSources",
          "outdoorBarriers",
        ],
      },
      {
        key: "treatment",
        sections: ["antTrail", "bait", "sprays", "naturalOptions"],
      },
      {
        key: "speciesGuide",
        sections: ["identifySpecies", "fireAnts", "professional"],
      },
    ],
  },

  fun_facts: {
    ns: "fun_facts",
    tabs: [
      {
        key: "strengthScale",
        sections: ["intro", "strength", "speedSenses", "trapJaw"],
      },
      {
        key: "civilizations",
        sections: ["farmers", "livestock", "architecture", "supercolony"],
      },
      {
        key: "weirdBiology",
        sections: [
          "zombieFungus",
          "explodingAnts",
          "silkWeaving",
          "navigation",
        ],
      },
    ],
  },

  hobbyist: {
    ns: "hobbyist",
    tabs: [
      {
        key: "gettingStarted",
        sections: ["intro", "firstQueen", "testTubeSetup", "foundingPhase"],
      },
      {
        key: "housing",
        sections: [
          "whenToMove",
          "formicariumTypes",
          "outworld",
          "tempHumidity",
        ],
      },
      {
        key: "feedingCare",
        sections: [
          "whatAntsEat",
          "proteinSources",
          "carbSources",
          "feedingSchedule",
          "beginnerSpecies",
        ],
      },
    ],
  },
};

/**
 * Returns a fully-translated copy of `topic`.
 *
 * - For topics registered in TOPIC_STRUCTURE, every translatable string
 *   (title, subtitle, tab labels, section headings, bodies, imageCaptions)
 *   is resolved via i18next using the current language.
 * - For topics NOT yet registered (future additions), the original EN
 *   strings are returned unchanged so the UI never breaks.
 *
 * Usage:
 *   const translatedTopic = useTranslatedTopic(topic);
 *   // pass `translatedTopic` to <AntTopicModal topic={translatedTopic} … />
 */
export function useTranslatedTopic(topic: AntTopic | null): AntTopic | null {
  const { t } = useTranslation();

  if (!topic) return null;

  const structure = TOPIC_STRUCTURE[topic.id];

  // Topic not yet migrated — return EN data as-is
  if (!structure) return topic;

  const { ns, tabs: tabStructure } = structure;

  return {
    ...topic,
    title: t(`${ns}.title`),
    subtitle: t(`${ns}.subtitle`),

    tabs: topic.tabs.map((tab, tabIdx) => {
      const tabMeta = tabStructure[tabIdx];

      // Safety: if the structure map is somehow out of sync, fall back gracefully
      if (!tabMeta) return tab;

      const tabKey = tabMeta.key;

      return {
        ...tab,
        label: t(`${ns}.tabs.${tabKey}.label`),

        sections: tab.sections.map((section, secIdx) => {
          const secKey = tabMeta.sections[secIdx];

          // Safety fallback for unmapped sections
          if (!secKey) return section;

          const base = `${ns}.tabs.${tabKey}.sections.${secKey}`;

          return {
            ...section,
            heading: section.heading === null ? null : t(`${base}.heading`),
            body: t(`${base}.body`),
            imageCaption:
              section.imageCaption === null ? null : t(`${base}.imageCaption`),
          };
        }),
      };
    }),
  };
}
