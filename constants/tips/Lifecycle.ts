import { AntTopic } from "../AntTopics";

export const LIFECYCLE_TOPIC: AntTopic = {
  id: "lifecycle",
  accentColor: "#7c3aed",
  title: "The Ant Life Cycle",
  subtitle:
    "From a single egg to a colony of millions — the complete story of how an ant colony grows.",
  heroImage:
    "https://res.cloudinary.com/denlxho1c/image/upload/v1774101982/tips/unnamed_1_1_ghfnt2.jpg",
  images: {
    egg: "https://images.newscientist.com/wp-content/uploads/2017/08/04153415/1024hatarakiari2.jpg",
    larva:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMBV9X992pRfv2KcVFW86R8Nx2pcgFpkkK6Q&s",
    pupa: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEmpis6X1rpytx0yJoPL7igLbIgvuObguCUg&s",
    adult:
      "https://antastic.com.au/wp-content/uploads/2023/05/Ant-Life-Stage-Development.png",
    nuptial:
      "https://www.nhm.ac.uk/content/dam/nhm-www/discover/flying-ant-day/flying-ants-mating-in-web-full-width.jpg",
    caste_diagram:
      "https://res.cloudinary.com/denlxho1c/image/upload/v1774109646/tips/Gemini_Generated_Image_8soprf8soprf8sop_sdtfd5.png",
  },
  tabs: [
    {
      label: "Stages",
      sections: [
        {
          heading: null,
          body: "Ants are **holometabolous** insects, meaning they undergo complete metamorphosis. Their life cycle includes four stages: egg, larva, pupa, and adult. Each stage looks completely different and serves a unique role in development.",
          imageKey: null,
          imageCaption: null,
        },
        {
          heading: "Egg",
          body: "The queen lays **tiny, white eggs** that are usually less than 0.5 mm. Workers constantly clean and move them to prevent fungus and keep them safe.\n\nEggs take about **1 to 4 weeks** to hatch depending on temperature. Warmer conditions speed up development.\n\nThe queen determines the role of each egg. Fertilized eggs become workers or queens, while unfertilized eggs become males.",
          imageKey: "egg",
          imageCaption:
            "Small white ant eggs grouped together and cared for by workers",
        },
        {
          heading: "Larva",
          body: "Larvae are **soft, legless, and completely dependent** on workers. Their main role is to eat and grow.\n\nWorkers feed them continuously with liquid food or small prey. As they grow, larvae molt several times.\n\nThis stage is very important because **caste is decided here**. Larvae that receive more nutrition may develop into queens, while others become workers.",
          imageKey: "larva",
          imageCaption: "Larvae being fed and protected by worker ants",
        },
        {
          heading: "Pupa",
          body: "During the pupal stage, the ant transforms into its adult form. Inside, its body is completely reorganized.\n\nSome species have exposed pupae, while others form cocoons. These cocoons are often mistaken for eggs.\n\nPupae cannot move and rely entirely on workers for protection and proper conditions.",
          imageKey: "pupa",
          imageCaption:
            "Pupae developing into adult ants, either exposed or inside cocoons",
        },
        {
          heading: "Adult",
          body: "When development is complete, the ant emerges as a **callow**, which is pale and soft. Over time, its body hardens and darkens.\n\nYoung workers start with simple tasks such as caring for brood, then later move to more complex roles like foraging.\n\nCallows should not be used for identification because their color and structure are not fully developed.",
          imageKey: "adult",
          imageCaption:
            "Newly emerged ant compared with fully developed workers",
        },
      ],
    },
    {
      label: "Colony",
      sections: [
        {
          heading: "Caste System",
          body: "Ant colonies are divided into **different castes**, each with a specific role.\n\nQueens are responsible for reproduction and can live many years.\n\nWorkers handle tasks such as gathering food, caring for young, and defending the colony.\n\nMales exist only for reproduction and usually live for a short time.\n\nSome species also have larger workers specialized for defense.",
          imageKey: "caste_diagram",
          imageCaption: "Different castes within an ant colony",
        },
        {
          heading: "Nuptial Flight",
          body: "The **nuptial flight** is when new colonies begin. Winged males and queens leave the nest and mate.\n\nAfter mating, males die while queens land, remove their wings, and search for a place to start a colony.\n\nIn tropical regions like Thailand, this often happens after rain when conditions are ideal.",
          imageKey: "nuptial",
          imageCaption: "Winged ants leaving the nest during a nuptial flight",
        },
        {
          heading: "Colony Founding",
          body: "A queen starts a colony alone in a small chamber. She does not leave to find food and instead uses stored energy.\n\nShe lays eggs and raises the first workers by herself. These first workers are very small but essential.\n\nOnce they grow, they begin foraging and the colony starts to expand.",
        },
      ],
    },
    {
      label: "Growth",
      sections: [
        {
          heading: "Colony Development",
          body: "In the beginning, the colony is very small and fragile. Over time, the number of workers increases and the colony becomes stronger.\n\nEventually, mature colonies can produce new queens and males, allowing the cycle to continue.\n\nSome species can grow to thousands or even millions of individuals.",
          imageKey: null,
          imageCaption: null,
        },
        {
          heading: "Temperature",
          body: "Temperature strongly affects development speed. Warmer environments lead to faster growth.\n\nIn tropical regions, colonies can grow throughout the year, especially during seasons with abundant food.",
          imageKey: null,
          imageCaption: null,
        },
        {
          heading: "Lifespan",
          body: "Queens can live for many years, much longer than most insects.\n\nWorkers live shorter lives but still survive longer than many other insects.\n\nMales live only a short time after reproduction.\n\nAs long as the queen survives, the colony can continue to exist.",
          imageKey: null,
          imageCaption: null,
        },
      ],
    },
  ],
  references: [
    {
      title: "The Ants",
      author: "Hölldobler, B. & Wilson, E.O.",
      year: "1990",
    },
    {
      title: "The Superorganism",
      author: "Hölldobler, B. & Wilson, E.O.",
      year: "2009",
    },
    {
      title: "AntWiki Life History",
      url: "https://www.antwiki.org/wiki/Life_History",
      author: "AntWiki Contributors",
      year: "2023",
    },
    {
      title: "Ant Colony Optimization and Swarm Intelligence",
      author: "Dorigo, M. & Stützle, T.",
      year: "2004",
    },
  ],
};
