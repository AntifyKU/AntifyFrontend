// Centralized ant species data for the Antify app
// Contains real ant species information to replace placeholder text

export type AntSpecies = {
    id: string;
    name: string;
    scientificName: string;
    classification: {
        family: string;
        subfamily: string;
        genus: string;
    };
    tags: string[];
    about: string;
    characteristics: string;
    colors: string[];
    habitat: string[];
    distribution: string[];
    behavior: string;
    ecologicalRole: string;
    image: string;
    matchPercentage?: number;
};

// Complete ant species database
export const antSpeciesData: AntSpecies[] = [
    {
        id: "1",
        name: "Yellow Crazy Ant",
        scientificName: "Anoplolepis gracilipes",
        classification: {
            family: "Formicidae",
            subfamily: "Formicinae",
            genus: "Anoplolepis",
        },
        tags: ["Invasive", "Aggressive", "Tropical"],
        about: "The Yellow Crazy Ant is one of the world's most invasive ant species. Named for their erratic, rapid movements when disturbed, these ants form supercolonies that can devastate local ecosystems by preying on native insects and small animals.",
        characteristics: "Workers are 4-5mm long with a slender yellowish-brown body. They have extremely long legs and antennae relative to body size. Their movements are characteristically erratic and 'crazy' when disturbed.",
        colors: ["Yellow", "Brown"],
        habitat: ["Tropical Forests", "Coastal Areas", "Urban Gardens"],
        distribution: ["Central", "South", "East"],
        behavior: "Forms massive supercolonies with multiple queens. They spray formic acid when threatened and can blind or kill small animals. Highly aggressive towards native ant species.",
        ecologicalRole: "Considered a major pest species. They disrupt ecosystems by displacing native ants and preying on invertebrates, bird chicks, and small reptiles.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Anoplolepis_gracilipes_casent0103300_head_1.jpg/800px-Anoplolepis_gracilipes_casent0103300_head_1.jpg",
    },
    {
        id: "2",
        name: "Weaver Ant",
        scientificName: "Oecophylla smaragdina",
        classification: {
            family: "Formicidae",
            subfamily: "Formicinae",
            genus: "Oecophylla",
        },
        tags: ["Tree-dwelling", "Beneficial", "Edible"],
        about: "Weaver ants are remarkable architects that construct elaborate nests by weaving leaves together using silk produced by their larvae. They are highly territorial and used in biological pest control for fruit orchards across Southeast Asia.",
        characteristics: "Workers range from 5-10mm. Major workers have large mandibles and are orange-brown. They have strong legs for gripping leaves and excellent vision for hunting prey.",
        colors: ["Orange", "Red-brown"],
        habitat: ["Tropical Trees", "Orchards", "Mangroves"],
        distribution: ["Central", "East", "South"],
        behavior: "Highly social with complex division of labor. Workers form living chains to bridge gaps between leaves. They are aggressive defenders and will bite intruders while spraying formic acid.",
        ecologicalRole: "Important biological pest control agents. Used in Thailand and Southeast Asia to protect mango, citrus, and cashew orchards from harmful insects.",
        image: "https://upload.wikimedia.org/wikipedia/commons/5/55/Red_Weaver_Ant%2C_Oecophylla_smaragdina.jpg",
    },
    {
        id: "3",
        name: "Red Imported Fire Ant",
        scientificName: "Solenopsis invicta",
        classification: {
            family: "Formicidae",
            subfamily: "Myrmicinae",
            genus: "Solenopsis",
        },
        tags: ["Venomous", "Invasive", "Dangerous"],
        about: "Red Imported Fire Ants are highly aggressive invasive ants known for their painful, burning stings. Originally from South America, they have spread worldwide and cause significant agricultural damage and public health concerns.",
        characteristics: "Workers vary from 2-6mm with a reddish-brown head and thorax. The darker abdomen has a prominent stinger. They are polymorphic with different worker sizes.",
        colors: ["Red", "Black"],
        habitat: ["Grasslands", "Urban Areas", "Agricultural Fields"],
        distribution: ["Central", "South"],
        behavior: "Extremely aggressive when their mound is disturbed. Workers swarm and sting repeatedly, injecting venom that causes burning pain. Can be fatal to people with allergies.",
        ecologicalRole: "Considered a major agricultural and ecological pest. They damage crops, kill small wildlife, and outcompete native ant species.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Fire_ants02.jpg/1200px-Fire_ants02.jpg",
    },
    {
        id: "4",
        name: "Carpenter Ant",
        scientificName: "Camponotus pennsylvanicus",
        classification: {
            family: "Formicidae",
            subfamily: "Formicinae",
            genus: "Camponotus",
        },
        tags: ["Wood-dwelling", "Large", "Nocturnal"],
        about: "Carpenter ants are among the largest ants found in Thailand. Unlike termites, they don't eat wood but excavate it to create their nests. They prefer damaged or moist wood and can cause structural damage to buildings.",
        characteristics: "Large ants measuring 6-13mm. They have a smooth, rounded thorax and powerful mandibles. Color ranges from black to reddish-brown depending on species.",
        colors: ["Black", "Dark Brown"],
        habitat: ["Dead Wood", "Tree Hollows", "Buildings"],
        distribution: ["North", "Central", "East"],
        behavior: "Primarily nocturnal, they forage for food at night. They create satellite colonies and can travel long distances from the main nest. They don't sting but can bite powerfully.",
        ecologicalRole: "Important decomposers that help break down dead wood in forest ecosystems. They contribute to nutrient cycling and create habitat for other organisms.",
        image: "https://upload.wikimedia.org/wikipedia/commons/f/fb/Carpenter_ant_Tanzania_crop.jpg",
    },
    {
        id: "5",
        name: "Black Garden Ant",
        scientificName: "Lasius niger",
        classification: {
            family: "Formicidae",
            subfamily: "Formicinae",
            genus: "Lasius",
        },
        tags: ["Common", "Household", "Harmless"],
        about: "The Black Garden Ant is one of the most common ant species found in Thai gardens and homes. They are attracted to sweet foods and often form trails into kitchens. Despite being a nuisance, they are harmless to humans.",
        characteristics: "Small ants measuring 3-5mm. Workers are uniformly dark brown to black. Queens are much larger at 8-9mm and have wings during mating flights.",
        colors: ["Black", "Dark Brown"],
        habitat: ["Gardens", "Lawns", "Under Stones"],
        distribution: ["North", "Central", "South", "East", "West"],
        behavior: "Form well-organized colonies with a single queen. They farm aphids for honeydew and are active foragers during warm weather. Flying ants emerge in summer for mating.",
        ecologicalRole: "Important soil aerators and seed dispersers. They control pest populations by preying on small insects and contribute to soil health.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Lasius_niger_01.jpg/1200px-Lasius_niger_01.jpg",
    },
    {
        id: "6",
        name: "Pharaoh Ant",
        scientificName: "Monomorium pharaonis",
        classification: {
            family: "Formicidae",
            subfamily: "Myrmicinae",
            genus: "Monomorium",
        },
        tags: ["Tiny", "Indoor Pest", "Medical Concern"],
        about: "Pharaoh ants are tiny tropical ants that have become a major pest in heated buildings worldwide. They are particularly problematic in hospitals where they can spread pathogens and contaminate sterile equipment.",
        characteristics: "Very small at only 1.5-2mm. They have a yellowish to light brown body with a darker abdomen. Almost invisible to the naked eye when moving.",
        colors: ["Yellow", "Light Brown"],
        habitat: ["Buildings", "Hospitals", "Food Storage"],
        distribution: ["Central", "South"],
        behavior: "Form multiple colonies through budding rather than swarming. They prefer warm, humid environments and are attracted to proteins and sweets. Colonies can split when disturbed.",
        ecologicalRole: "Considered a pest species with no beneficial role. They can contaminate food supplies and medical equipment, spreading bacteria between locations.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Monomorium_pharaonis_casent0173986_head_1.jpg/800px-Monomorium_pharaonis_casent0173986_head_1.jpg",
    },
    {
        id: "7",
        name: "Bullet Ant",
        scientificName: "Paraponera clavata",
        classification: {
            family: "Formicidae",
            subfamily: "Paraponerinae",
            genus: "Paraponera",
        },
        tags: ["Extremely Painful", "Large", "Rainforest"],
        about: "The Bullet Ant has the most painful sting of any insect, described as feeling like being shot. Indigenous tribes in South America use them in warrior initiation rituals. The pain can last up to 24 hours.",
        characteristics: "One of the largest ants at 18-25mm. They are entirely black with a robust body and large mandibles. The large stinger can inject powerful venom.",
        colors: ["Black"],
        habitat: ["Tropical Rainforests", "Tree Bases"],
        distribution: ["South"],
        behavior: "Primarily arboreal, living in tree bases. They are solitary foragers and not aggressive unless the nest is threatened. The warning behavior includes stridulation sounds.",
        ecologicalRole: "Predators of various arthropods. They help control insect populations in rainforest ecosystems and serve as prey for larger animals.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Paraponera_clavata.jpg/1200px-Paraponera_clavata.jpg",
    },
    {
        id: "8",
        name: "Leafcutter Ant",
        scientificName: "Atta cephalotes",
        classification: {
            family: "Formicidae",
            subfamily: "Myrmicinae",
            genus: "Atta",
        },
        tags: ["Farmer Ant", "Social", "Tropical"],
        about: "Leafcutter ants are remarkable farmers that cut and carry leaf fragments to underground fungus gardens. They cultivate a specific fungus species that they've domesticated over millions of years of evolution.",
        characteristics: "Highly polymorphic with workers ranging from 2-14mm. Soldiers have massive heads with powerful cutting mandibles. Reddish-brown coloration with spines on the thorax.",
        colors: ["Red-brown", "Orange"],
        habitat: ["Tropical Forests", "Plantations"],
        distribution: ["South"],
        behavior: "Form massive colonies with millions of workers and complex caste systems. They create well-defined foraging trails and can defoliate entire trees. The fungus they cultivate is their sole food source.",
        ecologicalRole: "Major ecosystem engineers that affect plant community composition. Their underground nests improve soil aeration and nutrient cycling over large areas.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Leaf_cutter_ants.jpg/1200px-Leaf_cutter_ants.jpg",
    },
];

// Explore page species list (shorter version for list display)
export const exploreSpeciesData = antSpeciesData.map(ant => ({
    id: ant.id,
    title: ant.name,
    description: ant.about.substring(0, 80) + "...",
    image: ant.image,
}));

// Quick discovery/filter categories
export const quickDiscoveryCategories = [
    { id: "1", name: "Venomous", icon: "alert", color: "#FF6B35" },
    { id: "2", name: "Forest", icon: "tree", color: "#328e6e" },
    { id: "3", name: "Household", icon: "home", color: "#3B82F6" },
    { id: "4", name: "Rare", icon: "sparkles", color: "#8B5CF6" },
];

// Featured species for home page (ant of the day)
export const featuredAntOfTheDay = antSpeciesData[1]; // Weaver Ant

export const featuredSpeciesList = [
    antSpeciesData[1], // Weaver Ant
    antSpeciesData[2], // Fire Ant
    antSpeciesData[3], // Carpenter Ant
];

// News items with real content
export const newsData = [
    {
        id: "1",
        title: "Extraordinary fossil reveals the oldest ant species known to science",
        description: "Scientists have discovered a 100-million-year-old ant fossil preserved in amber, shedding light on the early evolution of ants.",
        link: "https://edition.cnn.com/2025/04/24/science/fossil-oldest-known-ant/index.html",
        image: "https://media.cnn.com/api/v1/images/stellar/prod/ant-fossil-photograph-credit-anderson-lepeco.jpg?c=16x9&q=h_653,w_1160,c_fill/f_webp",
    },
    {
        id: "2",
        title: "Red fire ant invasion spreads across Australia, sends 23 to hospital",
        description: "Aggressive fire ants are expanding their territory in Queensland, prompting authorities to issue public health warnings.",
        link: "https://edition.cnn.com/2025/03/24/science/australia-fire-ants-spread-intl-scli/index.html",
        image: "https://media.cnn.com/api/v1/images/stellar/prod/gettyimages-1465224290.jpg?c=16x9&q=h_653,w_1160,c_fill/f_webp",
    },
    {
        id: "3",
        title: "New ant species discovered deep in the Amazon rainforest",
        description: "Researchers have identified a previously unknown ant species with unique hunting behaviors in remote Amazon regions.",
        link: "https://www.nationalgeographic.com",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Ants_on_the_ground.jpg/1280px-Ants_on_the_ground.jpg",
    },
    {
        id: "4",
        title: "How ant colony algorithms are revolutionizing AI and robotics",
        description: "Scientists study ant colonies to develop better algorithms for autonomous vehicles and swarm robotics systems.",
        link: "https://www.sciencedaily.com",
        image: "https://upload.wikimedia.org/wikipedia/commons/2/2c/Ant_feeding_on_honey.jpg",
    },
];

// Collection items for user profile
export const collectionItemsData = [
    { id: "1", title: "Weaver Ant", subtitle: "Oecophylla smaragdina", image: antSpeciesData[1].image },
    { id: "2", title: "Fire Ant", subtitle: "Solenopsis invicta", image: antSpeciesData[2].image },
    { id: "3", title: "Carpenter Ant", subtitle: "Camponotus pennsylvanicus", image: antSpeciesData[3].image },
    { id: "4", title: "Black Garden Ant", subtitle: "Lasius niger", image: antSpeciesData[4].image },
    { id: "5", title: "Yellow Crazy Ant", subtitle: "Anoplolepis gracilipes", image: antSpeciesData[0].image },
    { id: "6", title: "Pharaoh Ant", subtitle: "Monomorium pharaonis", image: antSpeciesData[5].image },
];

// Favorite items for user profile
export const favoriteItemsData = [
    { id: "1", title: "Weaver Ant", description: "Remarkable architects that construct nests by weaving leaves together.", image: antSpeciesData[1].image },
    { id: "2", title: "Bullet Ant", description: "Has the most painful sting of any insect in the world.", image: antSpeciesData[6].image },
    { id: "3", title: "Leafcutter Ant", description: "Farmers that cultivate fungus gardens for food.", image: antSpeciesData[7].image },
    { id: "4", title: "Fire Ant", description: "Aggressive invasive species with painful venomous stings.", image: antSpeciesData[2].image },
];

// Identification results mock data
export const identificationResultsData = [
    {
        ...antSpeciesData[1],
        matchPercentage: 85,
    },
    {
        ...antSpeciesData[2],
        matchPercentage: 72,
    },
    {
        ...antSpeciesData[0],
        matchPercentage: 48,
    },
];

// Species list for help improve AI correction
export const speciesListForCorrection = antSpeciesData.map(ant => ({
    id: ant.id,
    name: ant.name,
    description: ant.scientificName,
    image: ant.image,
}));

// Get ant by ID helper function
export const getAntById = (id: string): AntSpecies | undefined => {
    return antSpeciesData.find(ant => ant.id === id);
};

// Filter options
export const filterOptions = {
    colors: ["Black", "Orange", "Red", "Yellow", "Brown"],
    sizes: ["Tiny (< 2mm)", "Small (2-5mm)", "Medium (5-10mm)", "Large (10-15mm)", "Giant (> 15mm)"],
    habitats: ["Urban", "Forest", "Desert", "Tropical", "Buildings"],
    distributions: ["North", "South", "East", "West", "Central"],
};
