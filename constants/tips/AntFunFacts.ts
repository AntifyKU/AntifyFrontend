import { AntTopic } from "../AntTopics";

export const FUN_FACTS_TOPIC: AntTopic = {
  id: "fun_facts",
  accentColor: "#db2777",
  title: "Mind-Blowing Ant Facts",
  subtitle:
    "Ants are the most successful land animals on Earth. Here's why they've dominated the planet for 130 million years — and why they'll probably outlast us all.",
  heroImage:
    "https://res.cloudinary.com/denlxho1c/image/upload/v1774104430/tips/unnamed_dqyz26.jpg",
  images: {
    ant_strength:
      "https://a-z-animals.com/media/2022/11/shutterstock_1586035714.jpg",
    leafcutter_farm:
      "https://journals.plos.org/plosone/article/figure/image?size=medium&id=10.1371/journal.pone.0009922.g001",
    army_ant_raft:
      "https://cdn.hswstatic.com/gif/fireantraft-flickrdorisratchford.jpg",
    trap_jaw_launch:
      "https://photos.smugmug.com/Ants/Making-a-Living/The-Trap-Jaw-Ants/i-RpzMmbM/2/NGgK5TzkbmJSPhSjdBJ6ZWspnZBsr9VM7HMwpvGFt/XL/bauri2j-XL.jpg",
    zombie_ant:
      "https://media.wired.com/photos/5933249f68cb3b3dc4097fa3/master/pass/HPL2a.jpg",
    weaver_silk:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-tZgnPaVKqb4eR4GEvtBV4oq8hdJMuO1-mQ&s",
    supercolony:
      "https://res.cloudinary.com/denlxho1c/image/upload/v1774112352/tips/200241711_i9t5rk.jpg",
  },
  tabs: [
    {
      label: "Strength & Scale",
      sections: [
        {
          heading: null,
          body: "There are an estimated **20 quadrillion ants** alive on Earth right now — that's 20,000,000,000,000,000 individuals. If you collected them all, their combined biomass would exceed that of all wild birds and wild mammals combined. Ants occupy nearly every terrestrial habitat on the planet, from Arctic tundra to tropical rainforest floors, and have been doing so for **130 million years**.",
          imageKey: null,
          imageCaption: null,
        },
        {
          heading: "Superhuman Strength",
          body: "Ants can carry **10 to 50 times their own body weight**, depending on species. The leafcutter ant (Atta) can carry a fragment of leaf weighing 50 times its own mass — equivalent to a human carrying a loaded delivery truck with their teeth.\n\nThis extraordinary strength isn't magic — it's physics. **Strength scales with cross-sectional area** (two-dimensional), while **body weight scales with volume** (three-dimensional). As animals get smaller, the ratio of muscle cross-section to body weight improves dramatically. A human-sized ant wouldn't be 50x stronger than a human — it would actually be weaker than us, because its exoskeleton couldn't support the mass.\n\nThe **Asian weaver ant (Oecophylla smaragdina)** has been measured holding **100 times its own body weight** suspended from a single point — a world record for relative load-bearing.",
          imageKey: "ant_strength",
          imageCaption:
            "Leafcutter ant carrying a leaf fragment 50x its body weight — equivalent to a human carrying a truck",
        },
        {
          heading: "Speed, Senses, and Communication",
          body: "**Speed:** The Saharan silver ant (Cataglyphis bombycina) holds the record for fastest ant — reaching **0.855 m/s**, or about 108 body lengths per second. A human running at the equivalent relative speed would sprint at roughly 650 km/h.\n\n**Chemical language:** Ants communicate almost entirely through pheromones. A single ant produces signals from up to **20 different glandular sources**, each encoding different messages — alarm, trail, identity, dominance, distress, death, and more. Ants can distinguish their colony from any other colony in the world by chemical signature alone.\n\n**Hearing without ears:** Ants have no ears. They detect sound as **substrate vibrations** through their legs and a specialized organ in their knees (the subgenual organ). Some species generate precise vibrational signals using their body as an instrument — called stridulation — to communicate underground where chemical signals disperse too slowly.",
          imageKey: null,
          imageCaption: null,
        },
        {
          heading: "The Trap-Jaw — Fastest Movement on Earth",
          body: "The trap-jaw ant (Odontomachus bauri) holds the record for the **fastest self-powered movement ever recorded in an animal**.\n\nThe mandibles are held open against a spring-loaded mechanism created by the jaw closing muscles pulling against each other. When trigger hairs on the mandible tip are touched, the lock releases and the jaws snap shut at **35–64 m/s** — covering the full range of motion in **0.13 milliseconds**. That's over **300 times faster than the blink of an eye**.\n\nThe force generated is sufficient to launch the ant itself into the air — a secondary use as a predator-escape mechanism. By striking the mandibles against the ground, the ant can jump **8 cm vertically** and **40 cm horizontally** — extraordinary for an insect a few millimeters long.\n\nAnother trap-jaw species, Mystrium camillae, has been measured at **90 m/s** — the fastest recorded movement of any animal on Earth.",
          imageKey: "trap_jaw_launch",
          imageCaption:
            "High-speed photograph of Odontomachus trap-jaw mandibles at the moment of strike",
        },
      ],
    },
    {
      label: "Civilizations",
      sections: [
        {
          heading: "The Original Farmers — 50 Million Years Before Humans",
          body: "**Leafcutter ants** (Atta and Acromyrmex) have been cultivating fungi for **50 million years** — the oldest and most sophisticated agricultural system on Earth.\n\nWorkers cut fresh plant material and carry it to underground fungus gardens. The fungus breaks down the cellulose in the leaves (which the ants themselves cannot digest) and produces nutritious swellings called **gongylidia** that the ants harvest as food. It is a fully co-evolved mutualism — the fungus species cultivated by leafcutters (Leucoagaricus gongylophorus) no longer exists in the wild and has become entirely dependent on the ants.\n\n**The scale is extraordinary.** A mature leafcutter colony of 8 million workers can strip a large tree of every leaf within 24 hours, processing hundreds of kilograms of plant material per year. Their underground farms can occupy chambers larger than a small room.\n\n**They also invented crop protection.** Workers carry antibiotic-producing bacteria (Pseudonocardia) on their cuticle that suppress harmful fungi competing with their crop — an independently developed antimicrobial farming practice that precedes human antibiotics by 50 million years.",
          imageKey: "leafcutter_farm",
          imageCaption:
            "Leafcutter ant fungus garden — the cultivated fungus (white) fills the entire chamber",
        },
        {
          heading: "Ant Livestock and Slavery",
          body: "Leafcutter ants are not the only farmers. **Approximately 50% of ant species engage in some form of mutualistic relationship with other insects**:\n\n**Aphid herding:** Many ant species (Lasius, Formica, Crematogaster) tend aphids like livestock. They stroke the aphids with their antennae to stimulate 'milking' — the production of a sugar-rich droplet called honeydew. In return, the ants protect aphids from predators and parasitoids, carry them to better feeding locations, and even bring them underground into the nest during winter. Some ant species have become so dependent on aphids that they carry aphid eggs into the nest each autumn, ensuring a fresh herd the following spring.\n\n**Slave-making ants:** Species like Polyergus (shining amazon ants) conduct raids on other ant species — fighting their way into a neighboring colony, killing or driving off the adults, and carrying the pupae back to their own nest. The kidnapped workers (which have no mechanism to distinguish their natal colony from any other) emerge and work normally for the raiding colony's benefit. Polyergus workers have mandibles so specialized for warfare that they cannot even feed themselves without slave workers to help them.",
          imageKey: null,
          imageCaption: null,
        },
        {
          heading: "Living Architecture",
          body: "**Army ants** (Eciton burchellii and Dorylus spp.) build structures from their own bodies — a phenomenon called **bivouacking** and **bridge formation**.\n\nEvery night, army ants form a living nest — called a bivouac — by linking their bodies together in chains and sheets, creating a structure that houses the queen and up to **700,000 workers** in a roughly spherical mass. Temperature inside is regulated by the living walls. When the colony moves, the structure disassembles in minutes.\n\nDuring raids, workers encountering a gap in the terrain immediately begin constructing a living bridge — workers grasp the substrate and each other, forming a stable platform that hundreds of thousands of workers then cross. **The bridge self-optimizes** over time: if workers are walking around a long detour to avoid a bridge, new ants stop and fill in the detour — shortening the total path. If the bridge is too wide (more ants stopping to form it than walking over it), it narrows again. This collective optimization happens with no central coordination.\n\nFire ants (Solenopsis invicta) form living **rafts** when floods hit. Workers interlock their bodies to create a water-repellent floating platform, with the queen protected in the interior. These rafts can survive on water for **weeks**.",
          imageKey: "army_ant_raft",
          imageCaption:
            "Fire ant living raft — waterproof structure formed by interlocked workers, queen protected at center",
        },
        {
          heading: "The Supercolony",
          body: "Most ant colonies behave with extreme aggression toward members of other colonies — even their own species. But some species have evolved a radically different social structure: the **unicolonial supercolony**, where individual colonies recognize each other as non-hostile and effectively function as a single distributed entity.\n\nThe **Argentine ant (Linepithema humile)** has formed what may be the largest cooperative structure in the animal kingdom. Introduced to Europe from South America, they have formed three enormous supercolonies:\n- The **Main European Supercolony** stretches over **6,000 km** along the Mediterranean coast from the Atlantic to northern Italy\n- The **Iberian Supercolony** runs along most of Portugal and Spain\n- The **Catalan Supercolony** in northeast Spain\n\nWorkers from any part of the Main Supercolony can be placed anywhere else in its 6,000 km range and will be treated as nestmates — because they share the same cuticular hydrocarbon signature.\n\nIn their native South America, Argentine ants are competitively normal — different colonies fight each other. It is the invasion of a new habitat (with no co-evolved competitors) that selected for the ultra-cooperative supercolony structure.",
          imageKey: "supercolony",
          imageCaption:
            "The Main European Argentine ant supercolony — 6,000 km of continuous cooperative territory",
        },
      ],
    },
    {
      label: "Weird Biology",
      sections: [
        {
          heading: "The Zombie Ant Fungus",
          body: "**Ophiocordyceps unilateralis** is a parasitic fungus that has evolved to manipulate the behavior of carpenter ants (Camponotus leonardi) with extraordinary precision.\n\n**The sequence:**\n1. Fungal spores attach to a foraging ant's cuticle and germinate, sending hyphae through the exoskeleton into the body cavity\n2. The fungus spreads through muscle tissue, releasing compounds that **hijack the ant's motor system** — not the brain\n3. At a precise time of day, the ant climbs 25–30 cm up a plant stem — the optimal height and temperature for fungal fruiting body development\n4. The ant bites down on a leaf vein with extraordinary force and **locks its mandibles permanently** — it can no longer release its grip\n5. The ant dies. The fungus produces a fruiting body from the back of the head that releases spores onto foraging ants passing below\n\n**The precision is remarkable.** The height, direction, and timing of the final climb are controlled by the fungus to maximize spore dispersal to the specific ant trails below. Different Ophiocordyceps species infect different ant species, and each has adapted to that host's specific microhabitat and behavior.\n\nHealthy colonies have evolved behavioral immunity: worker ants detect infected nestmates by chemical signature changes and carry them far from the colony before the spores are released.",
          imageKey: "zombie_ant",
          imageCaption:
            "Ophiocordyceps fruiting body erupting from the head of an infected carpenter ant",
        },
        {
          heading: "Ants That Explode",
          body: "**Camponotus saundersi**, a carpenter ant species from Malaysia and Brunei, has evolved one of the most extreme defense mechanisms in the animal kingdom: **autothysis**, or voluntary self-explosion.\n\nWorkers have enormously enlarged mandibular glands running the full length of the body, filled with a toxic, sticky substance. When the ant is threatened — particularly when the colony is under attack by another ant species — the worker can contract its body wall muscles with enough force to **rupture its own cuticle**, spraying the glandular contents in a radius of several centimeters.\n\nThe sticky, corrosive substance entangles and immobilizes attackers, and the toxic components kill or incapacitate them. The worker dies, but it takes multiple enemies with it — a form of altruistic sacrifice that protects the colony.\n\nThis behavior is not unique to Camponotus saundersi — at least **nine species** of ants across different genera have independently evolved autothysis, suggesting strong selective pressure for suicidal defense in social insects.",
          imageKey: null,
          imageCaption: null,
        },
        {
          heading: "Silk Weaving Without Silk Glands",
          body: "Adult ants have no silk glands — those were lost in the evolutionary transition from solitary wasp ancestors. Yet **weaver ants (Oecophylla smaragdina)** build nests entirely from silk.\n\nThey solved this problem by **using their own larvae as tools**.\n\nWhen constructing or repairing a nest, workers pull leaves together — sometimes forming chains of ants, each gripping the one ahead, to bridge the gap between two leaves. Other workers then pick up late-stage larvae (which still produce silk) and move them back and forth across the junction in a weaving motion, each pass depositing a thin silk thread that bonds the leaves together.\n\nThe larvae make no choice in this — they are completely passive tools in the operation. Workers appear to stimulate silk production by gently squeezing the larva. **A single large nest can require the cooperative effort of thousands of workers and larvae simultaneously.**\n\nThe nests are remarkably strong — able to survive tropical storms — and the colony may maintain 100–500 connected leaf nests spread across several trees in a defended territory.",
          imageKey: "weaver_silk",
          imageCaption:
            "Weaver ant workers pulling leaves together while others use larvae as silk dispensers to bind them",
        },
        {
          heading: "Navigation Without GPS",
          body: "**Desert ants (Cataglyphis fortis)** of the Sahara navigate across featureless terrain with precision that rivals modern engineering — using only their body as a measuring instrument.\n\n**Path integration:** Cataglyphis continuously calculates its position relative to the nest by tracking direction (using polarized light from the sky as a compass) and distance (by counting steps — confirmed by experiments that glued stilts to their legs or amputated sections of their legs, causing them to overshoot or undershoot the nest respectively). They maintain a constantly updated vector to home and can return in a perfectly straight line from hundreds of meters away after a randomly winding search.\n\n**Landmark learning:** On their first few foraging trips, workers learn visual landmarks near the nest entrance and use them for close-range homing. Distant landmarks are used for route following on established trails.\n\n**Solar compensation:** The sun moves 15° per hour across the sky. Cataglyphis has an internal circadian clock that automatically compensates for this movement — if confined underground for several hours and then released, they return home using the correct solar angle for the time of day, not the angle at the time of capture.\n\nThey also navigate in complete darkness using the magnetic field — though this is not the primary system.",
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
      title: "Global ant biomass — current biology",
      author: "Schultheiss, P. et al.",
      year: "2022",
    },
    {
      title: "Trap-jaw ant strike kinematics",
      author: "Patek, S.N. et al.",
      year: "2006",
    },
    {
      title: "Ophiocordyceps — zombie ant fungus",
      author: "Hughes, D.P. et al.",
      year: "2011",
    },
    {
      title: "Argentine ant supercolony structure",
      author: "Giraud, T. et al.",
      year: "2002",
    },
    {
      title: "Path integration in desert ants",
      author: "Wittlinger, M. et al.",
      year: "2006",
    },
    {
      title: "AntWiki — Weaver Ant Biology",
      url: "https://www.antwiki.org/wiki/Oecophylla_smaragdina",
      author: "AntWiki Contributors",
      year: "2023",
    },
  ],
};
