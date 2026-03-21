import { AntTopic } from "../AntTopics";

export const IDENTIFY_TOPIC: AntTopic = {
  id: "identification_tips",
  accentColor: "#0A7C4E",
  title: "How to Identify Ants Like a Pro",
  subtitle:
    "Master the key anatomical features that separate ant species, even the ones that look nearly identical.",
  heroImage:
    "https://res.cloudinary.com/denlxho1c/image/upload/v1774103741/tips/51818_q5oano.jpg",
  images: {
    morphology:
      "https://res.cloudinary.com/denlxho1c/image/upload/v1774105689/tips/Ant-anatomy_l9jmmz.jpg",
    petiole:
      "https://res.cloudinary.com/denlxho1c/image/upload/v1774106352/tips/Worker_ant_anatomy_Formicinae_-_Myrmicinae_ASU_AAB_rr5cvf.jpg",
    mandibles:
      "https://res.cloudinary.com/denlxho1c/image/upload/v1774107297/tips/Gemini_Generated_Image_ji515ji515ji515j_uovmx1.png",
    head: "https://www.shutterstock.com/image-photo/extreme-macro-closeup-ants-compound-600nw-2648201073.jpg",
    polymorphic:
      "https://res.cloudinary.com/denlxho1c/image/upload/v1774107988/tips/Gemini_Generated_Image_rwl1cyrwl1cyrwl1_pf8uje.png",
    size_range: "https://cdn.domyown.com/images/content/ant_size.jpg",
    weaver_nest:
      "https://photos.smugmug.com/Ants/Natural-History/Ant-Nests/i-BCDtBTS/2/Nc7n5qcGtFVTdmQjsNn8Tvs2s25TP3L8d3mVgpX75/XL/Oecophylla8-XL.jpg",
  },
  tabs: [
    {
      label: "Anatomy",
      sections: [
        {
          heading: null,
          body: "Ants are among the most diverse insects on Earth with **over 20,000 species worldwide**. There are more than 500 recorded in Thailand alone, and hundreds more still awaiting discovery. Identifying them correctly is not easy, but it is absolutely learnable once you know what to look for.",
          imageKey: null,
          imageCaption: null,
        },
        {
          heading: "Basic Body Structure",
          body: "Like all insects, ants have three main regions: the **Head**, the **Mesosoma** (thorax), and the **Metasoma** (abdomen). What makes ants unique is the narrow waist called the **Petiole** that sits between the mesosoma and the metasoma.\n\nThe **Head** holds compound eyes, ocelli (in some castes), antennae, and mandibles. The **Mesosoma** carries all six legs and wings in reproductive castes. The **Gaster** (bulbous rear) contains digestive organs and, in stinging species, the venom apparatus.",
          imageKey: "morphology",
          imageCaption:
            "External anatomy of an ant including head, mesosoma, petiole, and gaster labelled",
        },
        {
          heading: "The Petiole (Most Important Feature)",
          body: "The petiole is always the **first thing** a myrmecologist checks. It immediately divides ants into two large camps:\n\n**Single node ants** have one petiole segment. This includes Formicinae (Camponotus, Oecophylla, Formica) and Dolichoderinae (Tapinoma, Linepithema).\n\n**Double node ants** have both a petiole and a postpetiole. This group is dominated by Myrmicinae, the largest ant subfamily, which includes fire ants (Solenopsis), leafcutter ants (Atta), and hundreds more.\n\nAlso note the **node shape**. A thin scale-shaped node (weaver ants) versus a thick rounded nodiform node (fire ants) adds another layer of precision.",
          imageKey: "petiole",
          imageCaption:
            "Single node petiole (Formicinae) VS Double node petiole plus postpetiole (Myrmicinae)",
        },
        {
          heading: "Eyes",
          body: "Eye size reflects how an ant lives.\n\n**Large eyes** on the sides of the head belong to fast surface-active ants that navigate primarily by vision: Camponotus, Oecophylla, and Polyrhachis.\n\n**Small or vestigial eyes** are the hallmark of underground or army ant species. Driver ant workers (Dorylus) are effectively blind, navigating entirely by pheromone trails.\n\n**Ocelli** are three tiny simple eyes on top of the head. They are always present in queens and males for solar navigation. In workers, their presence or absence is itself diagnostic.",
          imageKey: "head",
          imageCaption:
            "Frontal view showing large compound eyes and geniculate antennae",
        },
      ],
    },
    {
      label: "Features",
      sections: [
        {
          heading: "Antennae",
          body: "**Segment count:** Most ants have 12 antennal segments, but Myrmicinae often have 10 to 12. Counting requires a 10x loupe or macro photo.\n\n**Antennal club:** The enlarged tip segments are highly diagnostic. A **three-segment club** (Camponotus), four-segment, or no club at all each point to different genera.\n\n**Geniculate (elbowed) shape:** All ant antennae have a long first segment (the scape) followed by a sharp bend. This single feature separates ants from all other insects at a glance.",
          imageKey: null,
          imageCaption: null,
        },
        {
          heading: "Mandibles",
          body: "**Triangular toothed mandibles** are most common. They belong to generalist species that handle varied food, nest materials, and prey.\n\n**Trap-jaw mandibles** (Odontomachus, Anochetus) can open nearly 180 degrees and snap shut at **64 to 145 meters per second**. This is the fastest recorded animal movement, generating force enough to launch the ant into the air.\n\n**Linear mandibles** are typical of specialist predators in Ponerinae that hunt centipedes and elongated larvae.\n\n**Edentate (toothless) mandibles** are found in army ants. They are designed for cutting rather than gripping.",
          imageKey: "mandibles",
          imageCaption:
            "Morphological and Functional Diversity of Ant Mandibles",
        },
        {
          heading: "Worker Size & Polymorphism",
          body: "Worker size is one of the most useful and fastest field diagnostics — you can assess it at a glance without any equipment.\n\n**Monomorphic colonies** have workers all roughly the same size. This applies to the majority of ant species, including most Ponerinae, Tapinoma, and Lasius.\n\n**Polymorphic colonies** contain dramatically different size classes within the same colony:\n\n1. **Minor workers** are the smallest caste, primarily focused on brood care and nest maintenance.\n2. **Media workers** are mid-sized and make up the bulk of foragers.\n3. **Major workers or soldiers** are the largest, with disproportionately large heads and powerful mandibles used for defense and food processing.\n\n**Why size varies so much:** Caste is determined during the larval stage, not genetically fixed. Larvae that receive more and richer food develop into larger workers. A colony actively controls its worker size ratio based on current needs — more soldiers when under threat, more minors when brood is abundant.",
          imageKey: "polymorphic",
          imageCaption:
            "Atta cephalotes major soldier (left) alongside minor worker (right) from the same species",
        },
        {
          heading: "Size as a Field Guide",
          body: "Knowing the typical size range of common Thai species helps narrow down an identification quickly:\n\n**Very small (1–2 mm):** Ghost ant (Tapinoma melanocephalum), Pharaoh ant (Monomorium pharaonis), thief ant (Solenopsis fugax). These are the ants that invade kitchens and are often barely visible to the naked eye.\n\n**Small to medium (2–5 mm):** Fire ant (Solenopsis geminata), black garden ant (Lasius niger), most Pheidole workers. The most commonly encountered size range in urban and suburban environments.\n\n**Medium to large (5–10 mm):** Weaver ant workers (Oecophylla smaragdina), many Camponotus species, trap-jaw ant (Odontomachus). Easy to observe behavioral details without magnification.\n\n**Large (10–20 mm):** Carpenter ant majors (Camponotus gigas can reach 20 mm), bulldog ant (Myrmecia), Dinoponera queens. These are the ants that genuinely startle people on first encounter.\n\n**Important caveat:** Size alone is never sufficient for identification. A large black ant could be Camponotus, Polyrhachis, or Diacamma. Always combine size with petiole node count and other structural features.",
          imageKey: "size_range",
          imageCaption:
            "Size comparison: crazy ant (1.5 mm) to carpenter ant (12.7 mm) against a ruler",
        },
        {
          heading: "Color, Texture & Hair",
          body: "Color is the most immediately noticeable feature but **most misleading used alone**. The same species varies considerably across geographic ranges, and callow workers (freshly eclosed) are always paler than mature individuals.\n\n**Metallic coloration** in Polyrhachis creates a distinctive sheen. Some species show blue-green or bronze iridescence visible from a distance.\n\n**Two-tone patterns** — red head with black gaster, or pale abdominal banding — are useful secondary confirmers once structural features are checked.\n\n**Pilosity (body hair):** presence, length, direction (erect versus appressed), and density are all used in species-level identification keys.",
          imageKey: null,
          imageCaption: null,
        },
        {
          heading: "Behavior & Habitat Clues",
          body: "**Nest type:**\n\nFirst, an underground entrance hole or crater mound is used by the majority of species.\n\nSecond, excavated wood galleries are used by carpenter ants (Camponotus) which excavate soft wood but **do not eat it**.\n\nThird, **silk leaf nests** are used by weaver ants (Oecophylla smaragdina) which bind leaves with silk from their own larvae. No other Thai ant does this.\n\nFourth, hollow plant stems are used by Crematogaster and Azteca in obligate plant mutualisms.\n\n**Smell:** Tapinoma releases a sharp **rotten coconut odor** when crushed. Lasius fuliginosus has a sweet apple-like scent.",
          imageKey: "weaver_nest",
          imageCaption:
            "Oecophylla smaragdina silk leaf nest is the most reliable single behavioral ID feature in Thai forests",
        },
      ],
    },
    {
      label: "Field Guide",
      sections: [
        {
          heading: "Photography Tips",
          body: "**Three essential angles:**\n\n1. **Dorsal** (top-down) view for body proportions, node count, and head shape.\n2. **Lateral** (side-on) view for petiole node profile and mesosoma curve.\n3. **Frontal or face** view for eye size, mandible shape, and antennal insertions.\n\n**Best practices:**\n\nFirst, use a plain contrasting background like a white card or moist white tile.\nSecond, a brief cool-down (not freezing) slows ants for sharper photos.\nThird, record GPS and date because locality data is scientifically valuable and helps confirm species with restricted distributions.",
          imageKey: null,
          imageCaption: null,
        },
        {
          heading: "Common Mistakes",
          body: "**Mistake 1: Color alone.** Color varies too much within a species. Always check structural features first.\n\n**Mistake 2: Single photo angle.** Petiole node count cannot be reliably assessed from dorsal only. You need a lateral view.\n\n**Mistake 3: Confusing castes.** Queens have a larger mesosoma with wing scars. Males have large eyes and wasp-like proportions. Never identify a colony from a male alone.\n\n**Mistake 4: Missing the postpetiole.** In double node ants, the segments can press together and look like one. A flat postpetiole pressed against the gaster is still two nodes.\n\n**Mistake 5: Using size alone.** A large ant is not necessarily Camponotus. Many genera overlap in size range. Size is a starting point, not a conclusion.",
          imageKey: null,
          imageCaption: null,
        },
        {
          heading: "Quick Field Checklist",
          body: "Work through these steps in order when you encounter an unknown ant:\n\n1. **Estimate size.** Very small, small, medium, or large? This immediately narrows possible genera.\n2. **Count the petiole nodes.** Are there one or two?\n3. **Assess node shape.** Is it thin and scale-like, or thick and rounded?\n4. **Check worker size variation.** Are they monomorphic or polymorphic?\n5. **Look at the head.** How large are the eyes? Is an antennal club present?\n6. **Observe mandible shape.** Are they triangular, linear, or trap-jaw?\n7. **Note nest type and foraging behavior.**\n8. **Photograph** dorsal, lateral, and face views on a plain background.\n9. **Use Antify** to submit your photos for AI-assisted species matching.",
          imageKey: null,
          imageCaption: null,
        },
      ],
    },
  ],
  references: [
    {
      title: "AntWeb: The World's Largest Online Ant Database",
      url: "https://www.antweb.org",
      author: "California Academy of Sciences",
      year: "2024",
    },
    {
      title: "Identification at AntWiki",
      url: "https://www.antwiki.org/wiki/Identification",
      author: "AntWiki Contributors",
      year: "2023",
    },
    {
      title: "The Ants",
      url: "https://www.hup.harvard.edu/books/9780674040755",
      author: "Hölldobler, B. & Wilson, E.O.",
      year: "1990",
    },
    {
      title: "The phylogeny and evolution of ants",
      url: "https://escholarship.org/uc/item/0bc0z1gh",
      author: "Ward, P.S.",
      year: "2014",
    },
    {
      title: "AntCat: An Online Catalog of the Ants of the World",
      url: "https://antcat.org",
      author: "Bolton, B.",
      year: "2023",
    },
    {
      title: "Ants of Southeast Asia: Identification Notes",
      url: "https://www.antbase.net/english/ants-of-southeast-asia/keys.html",
      author: "Yamane, Sk. et al.",
      year: "2018",
    },
  ],
};
