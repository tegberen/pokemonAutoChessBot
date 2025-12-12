const { SlashCommandBuilder } = require('discord.js');
const https = require('https');
import { savePokemonCatch } from '../services/pokemonService';
// const
const SHINY_RATE = 0.005;
// add ifaces
interface WikiSearchResult {
  query?: {
    search?: Array<{ pageid: number }>;
  };
}

interface WikiPageResult {
  query: {
    pages: {
      [key: string]: {
        original?: {
          source: string;
        };
        thumbnail?: {
          source: string;
        };
      };
    };
  };
}

interface PokeAPIResponse {
  name: string;
  sprites: {
    other: {
      'official-artwork': {
        front_default: string | null;
		front_shiny: string | null;
      };
    };
  };
}

const pokemonList = [
  216, // Teddiursa
  217, // Ursaring
  901, // Ursaluna
  613, // Cubchoo
  614, // Beartic
  674, // Pancham
  675, // Pangoro
  759, // Stufful
  760, // Bewear
  891, // Kubfu
  892, // Urshifu


  52,  // Meowth
  53,  // Persian
  196, // Espeon
  243, // Raikou
  300, // Skitty
  301, // Delcatty
  403, // Shinx
  404, // Luxio
  405, // Luxray
  431, // Glameow
  432, // Purugly
  509, // Purrloin
  510, // Liepard
  667, // Litleo
  668, // Pyroar
  677, // Espurr
  678, // Meowstic
  725, // Litten
  726, // Torracat
  727, // Incineroar
  805, // Solgaleo
  807, // Zeraora
  861, // Perrserker
  906, // Sprigatito
  907, // Floragato
  908, // Meowscarada
  941, // Chien-Pao

  58,  // Growlithe
  59,  // Arcanine
  209, // Snubbull
  210, // Granbull
  229, // Houndour
  230, // Houndoom
  235, // Smeargle
  244, // Entei
  261, // Poochyena
  262, // Mightyena
  309, // Electrike
  310, // Manectric
  447, // Riolu
  448, // Lucario
  506, // Lillipup
  507, // Herdier
  508, // Stoutland
  676, // Furfrou
  744, // Rockruff
  745, // Lycanroc
  818, // Nickit
  819, // Thievul
  835, // Yamper
  836, // Boltund
  888, // Zacian
  889, // Zamazenta
  900, // Maschiff
  901, // Mabosstiff
  926, // Fidough
  927, // Dachsbun
  971, // Greavard
  972, // Houndstone

  60,  // Poliwag
  61,  // Poliwhirl
  62,  // Poliwrath
  186, // Politoed
  194, // Wooper
  195, // Quagsire
  453, // Croagunk
  454, // Toxicroak
  535, // Tympole
  536, // Palpitoad
  537, // Seismitoad
  656, // Froakie
  657, // Frogadier
  658, // Greninja
  928, // Bellibolt
  979, // Tadbulb
  980, // Wooper (Paldea)
  981, // Clodsire

  56,  // Mankey
  57,  // Primeape
  979, // Annihilape
  190, // Aipom
  424, // Ambipom
  288, // Slakoth
  289, // Vigoroth
  290, // Slaking
  390, // Chimchar
  391, // Monferno
  392, // Infernape
  511, // Pansage
  512, // Simisage
  513, // Pansear
  514, // Simisear
  515, // Panpour
  516, // Simipour
  555, // Darmanitan (Standard Mode)
  765, // Oranguru
  766,  // Passimian

  5,    // Charmeleon
  95,   // Onix
  208,  // Steelix
  23,   // Ekans
  24,   // Arbok
  252,  // Treecko
  253,  // Grovyle
  254,  // Sceptile
  336,  // Seviper
  352,  // Kecleon
  495,  // Snivy
  496,  // Servine
  497,  // Serperior
  559,  // Scraggy
  560,  // Scrafty
  694,  // Helioptile
  695,  // Heliolisk
  757,  // Salandit
  758,  // Salazzle
  816,  // Sobble
  817,  // Drizzile
  818,  // Inteleon
  843,  // Silicobra
  844,   // Sandaconda

  41,   // Zubat
  42,   // Golbat
  169,  // Crobat
  527,  // Woobat
  528,  // Swoobat
  714,  // Noibat
  715,  // Noivern

  19,   // Rattata
  20,   // Raticate
  25,   // Pikachu
  26,   // Raichu
  172,  // Pichu
  161,  // Sentret
  162,  // Furret
  298,  // Azurill
  183,  // Marill
  184,  // Azumarill
  505,  // Patrat
  506,  // Watchog
  735,  // Gumshoos
  926,  // Fidough
  927,  // Dachsbun
  
]

const exploreList = [
    "American Black Bear",
    "Brown Bear",
    "Giant Panda",
    "Asian Black Bear",
    "Sun Bear",
    "Sloth Bear",
    "Spectacled Bear",
    "Cinnamon Bear",
    "Kodiak Bear",
    "Kermode Bear",
    "Spirit Bear",
    "Grizzly Bear",
    "Marsican Brown Bear",
    "Himalayan Brown Bear",
    "Eurasian Brown Bear",
    "Syrian Brown Bear",
    "Kamchatka Brown Bear",
    "Tibetan Blue Bear",
    "Gobi Bear",
    "Glacier Bear",
    "Mexican Black Bear",
    "Kenai Black Bear",
    "California Black Bear",
    "Red Panda",
    "Raccoon",
    "Grey Wolf",
    "Cougar",
    "Coyote",
    "Moose",
    "Bobcat",
    "Wolverine",
    "Red Fox",
    "Groundhog",
    "Reindeer",
    "Elk",
    "Ocelot",
    "Canadian Lynx",
    "Ermine",
    "White-Tailed Deer",
    "Florida Panther",
    "Eastern Gray Squirrel",
    "Red Wolf",
    "American Badger",
    "Virginia Opossum",
    "Mule Deer",
    "American Mink",
    "Jaguarundi",
    "Mountain Goat",
    "Gray Fox",
    "Eastern Fox Squirrel",
    "Least Weasel",
    "American Marten",
    "Northwestern Wolf",
    "American Beaver",
    "American Red Squirrel",
    "Water Moccasin",
    "Copperhead",
    "Corn Snake",
    "Gila Monster",
    "Timber Rattlesnake",
    "Cane Toad",
    "Common Garter Snake",
    "Milk Snake",
    "Ring-Necked Snake",
    "Western Rat Snake",
    "American Five-Lined Skink",
    "American Anole",
    "California Kingsnake",
    "Western Diamondback Rattlesnake",
    "Tiger Salamander",
    "Eastern Diamondback Rattlesnake",
    "Eastern Hognose Snake",
    "American Red Squirrel",
    "Eastern Indigo Snake",
    "Eastern Racer",
    "Nine-Banded Armadillo",
    "North American Porcupine",
    "Star-Nose Mole",
    "Brown Snake",
    "Black-Tailed Jackrabbit",
    "American Toad",
    "Eastern Wolf",
    "Gray Treefrog",
    "Snowshoe Hare",
    "Eastern Cottontail",
    "Yellow-Bellied Slider",
    "Red-Eared Slider",
    "Striped Skunk",
    "Spring Peeper",
    "Gopher Tortoise",
    "Eastern Rat Snake",
    "Florida Softshell Turtle",
    "Wood Frog",
    "Rubber Boa",
    "Gopher Snake",
    "Eastern Milk Snake",
    "Little Brown Bat",
    "Alaska Moose",
    "Gray Ratsnake",
    "Black-Tailed Deer",
    "Mexican Free-Tailed Bat",
    "Mexican Gray Wolf",
    "Mojave Rattlesnake",
    "Texas Rat Snake",
    "Western Fence Lizard",
    "Yellow-Bellied Marmot",
    "Ribbon Snake",
    "Spotted Salamander",
    "Wood Bison",
    "Eastern Kingsnake",
    "Eastern Newt",
    "Prairie Rattlesnake",
    "White-Nosed Coati",
    "Coachwhip",
    "Island Fox",
    "Pygmy Rattlesnake",
    "Pacific Gopher Snake",
    "Black-Tailed Rattlesnake",
    "Key Deer",
    "Northern Flying Squirrel",
    "Eastern Garter Snake",
    "Scarlet Kingsnake",
    "Eastern Chipmunk",
    "Collard Peccary",
    "New Mexico Whiptail",
    "Wood Turtle",
    "Mountain Beaver",
    "Blanding's Turtle",
    "Plain-Bellied Water Snake",
    "Eastern Fence Lizard",
    "Swamp Rabbit",
    "Eastern Pine Snake",
    "Pacific Tree Frog",
    "Eastern Coral Snake",
    "Southern Alligator Lizard",
    "Western Gray Squirrel",
    "Western Rattlesnake",
    "Rough-Skinned Newt",
    "Southern Flying Squirrel",
    "Roosevelt Elk",
    "Boreal Woodland Caribou",
    "Northern Short-Tailed Shrew",
    "Rough Green Snake",
    "Desert Rosy Boa",
    "Eastern Deer Mouse",
    "Texas Spiny Lizard",
    "White-tailed Jackrabbit",
    "Western Skink",
    "Eastern Meadow Vole",
    "Northern Leopard Frog",
    "Douglas Squirrel",
    "Prairie Kingsnake",
    "Big Brown Bat",
    "Pickerel Frog",
    "Abert's Squirrel",
    "Desert Iguana",
    "Pond Slider",
    "Speckled Kingsnake",
    "Desert Cottontail",
    "Checkered Garter Snake",
    "Common Collard Lizard",
    "Eastern Elk",
    "Green Frog",
    "Desert Horned Lizard",
    "Texas Brown Snake",
    "Tule Elk",
    "Broad-Headed Skink",
    "Common Box Turtle",
    "Northern Alligator Lizard",
    "Blue Spotted Salamander",
    "Spotted Turtle",
    "Eastern Worm Snake",
    "White-Footed Mouse",
    "California Mountain Kingsnake",
    "California Newt",
    "Western Terrestrial Garter Snake",
    "Arctic Ground Squirrel",
    "Northern Red Belly Snake",
    "Rainbow Snake",
    "Sitka Deer",
    "Olympic Marmot",
    "Marsh Rabbit",
    "Texas Corral Snake",
    "Pygmy Rabbit",
    "Eastern Mole",
    "Glossy Snake",
    "Florida Cottonmouth",
    "Bushy-Tailed Woodrat",
    "Interior Alaskan Wolf",
    "Porcupine Caribou",
    "Hoary Bat",
    "Western Toad",
    "Richardson's Ground Squirrel",
    "British Columbia Wolf",
    "Eastern Spotted Skunk",
    "Indiana Bat",
    "Evening Bat",
    "Squirrel Tree Frog",
    "Little Brown Skink",
    "Northern Red-Legged Frog",
    "Western Whiptail",
    "Jefferson Salamander",
    "Woodland Vole",
    "Camas Pocket Gopher",
    "Southern Bog Lemming",
    "Striped Whipsnake",
    "Round-Tailed Muskrat",
    "Northern Green Frog",
    "Crotalus Willardi",
    "Pine Woods Snake",
    "Manitoban Elk",
    "American Pygmy Shrew",
    "Kirtland's Snake",
    "North American Cougar",
    "Tiger Rattlesnake",
    "Butler's Garter Snake",
    "Desert Kingsnake",
    "New England Cottontail",
    "Rough Earth Snake",
    "Great Plains Rat Snake",
    "Southern Hog Nose Snake",
    "Brown Basilisk",
    "Western Ground Snake",
    "Great Basin Gophersnake Rock Squirrel",
    "Eastern Mud Turtle",
    "Southern Pacific Rattlesnake",
    "Mountain Cottontail",
    "Woodland Jumping Mouse",
    "Northern Rocky Mountain Wolf",
    "Silver-Haired Bat",
    "Sharp-Tailed Snake",
    "Townsend's Big-Eared Bat",
    "Black-Crested Titmouse",
    "Gunnison's Prairie Dog",
    "Slender Glass Lizard",
    "Chicken Turtle",
    "Gray Bat",
    "Red Diamond Rattlesnake",
    "Southeastern Crown Snake",
    "Western Moose",
    "Least Chipmunk",
    "Western Chorus Frog",
    "Botta's Pocket Gopher",
    "Long-Toed Salamander",
    "Alexander Archipelago Wolf",
    "Blackeck Garter Snake",
    "California Mule Deer",
    "Scarlet Snake",
    "Marbled Salamander",
    "Greater Short-Horned Lizard",
    "Tricolored Bat",
    "Columbian Ground Squirrel",
    "Kaibab Squirrel",
    "Smooth Earth Snake",
    "Texas Toad",
    "California Tiger Salamander",
    "California Slender Salamander",
    "Rock Rattlesnake",
    "Southwestern Blackhead Snake",
    "Northern Cricket Frog",
    "Ensatina Pallid Bat",
    "Western Ground Snake",
    "Brown Basilisk",
    "Southern Hognose Snake",
    "Great Plains Rat Snake",
    "Rough Earth Snake",
    "New England Cottontail",
    "Desert Kingsnake",
    "Butler's Garter Snake",
    "Tiger Rattlesnake",
    "North American Cougar",
    "Kirtland's Snake",
    "American Water Shrew",
    "American Pygmy Shrew",
    "Manitoban Elk",
    "Pine Woods Snake",
    "Crotalus Willardi",
    "Northern Green Frog",
    "Round-Tailed Muskrat",
    "Striped Whipsnake",
    "Southern Bog Lemming",
    "Camas Pocket Gopher",
    "Woodland Vole",
    "Jefferson Salamander",
    "Western Whiptail",
    "Northern Red-Legged Frog",
    "Little Brown Skink",
    "Squirrel Tree Frog",
    "Evening Bat",
    "Brown Vine Snake",
    "Pallid Bat",
    "Ensatina",
    "Rock Rattlesnake",
    "Phantasmal Poison Dart Frog",
    "Yellow-Banded Poison Dart Frog",
    "Red-Headed Poison Dart Frog",
    "Green and Black Poison Dart Frog",
    "Strawberry Poison Dart Frog",
    "Dyeing Poison Dart Frog",
    "Amazonian Poison Dart Frog",
    "Blue Poison Dart Frog",
    "Granular Poison Dart Frog",
    "Golden Poison Dart Frog",
    "Red-Eyed Tree Frog",
    "Vietnamese Mossy Frogs",
    "Bearded Dragon",
    "Emerald Tree Boa",
    "Green Anaconda",
    "Eyelash Viper",
    "Green Iguana",
    "Chameleon",
    "Green Anole",
    "Komodo Dragon",
    "Asian Monitor Lizard",
    "Howler Monkey",
    "Spider Monkey",
    "Woolly Monkey",
    "Golden Lion Marmoset",
    "Capuchin Monkey",
    "Squirrel monkey",
    "Crested Black Macaque",
    "Silverback Gorilla",
    "Orangutan",
    "Bonobo",
    "Chimpanzee",
    "North American Least Shrew",
    "White-Tailed Antelope Squirrel",
    "Great Plains Skink",
    "Sierra Nevada Red Fox",
    "Southeastern Five-Lined Skink",
    "Southern Short-Tailed Shrew",
    "Red Milk Snake",
    "Northwestern Salamander",
    "Hispid Cotton Rat",
    "Ortnate Tree Lizard",
    "Florida Sand Skink",
    "Pig Frog",
    "Cinereus Shrew",
    "Alaskan Hare",
    "Giant Ameiva",
    "Northern Pocket Gopher",
    "Virginia Big-Eared Bat",
    "Gastrophryne Carolinensis",
    "Aquatic Garter Snake",
    "Short-Tailed Snake",
    "Northern Slimy Salamander",
    "Northwestern Garter Snake",
    "Striped Mud Turtle",
    "Tropidoclonion",
    "Appalachian Cottontail",
    "Delmarva Fox Squirrel",
    "Northern Long-Eared Bat",
    "Colombian White-Tailed Deer",
    "Boreal Chorus Frog",
    "Grand Canyon Rattlesnake",
    "Columbia Spotted Frog",
    "Lesser Long-Nosed Bat",
    "Ornate Shrew",
    "Western Fox Snake",
    "American Shrew Mole",
    "California Deermouse",
    "Humboldt's Flying Squirrel",
    "Red-Bellied Newt",
    "Desert Woodrat",
    "Oak Toad",
    "Merriam's Kangaroo Rat",
    "Spotted Bat",
    "Bird-Voiced Tree Frog",
    "Western Harvest Mouse",
    "Arizona Gray Squirrel",
    "Pine Barrens Tree Frog",
    "Hairy-Tailed Mole",
    "California Giant Salamander",
    "Mexican Burrowing Toad",
    "Greater Long-Nosed Bat",
    "Townsend's Chipmunk",
    "Oregon Spotted Frog",
    "Mountain Yellow-Legged Frog",
    "Western Black-Headed Snake",
    "Dryophytes Gratiosus",
    "Scaphiopus Holbrookii",
    "Uinta Chipmunk",
    "Texas Alligator Lizard",
    "Southern Red-Backed Vole",
    "Tundra Vole",
    "Middle American Indigo Snake",
    "Humboldt Marten",
    "Houston Toad",
    "Prarie Skink",
    "Rafinesque's Big-Eared Bat",
    "Alashan Wapiti",
    "Boreal Toad",
    "Florida Mouse",
    "Golden Mouse",
    "Oryzomys Couesi",
    "Sistrurus Catenatus Tergeminus",
    "Ambystoma Talpoideum",
    "Pantherophis Bairdi",
    "Couch's Spadefoot Toad",
    "Yuma Myotis",
    "Cope's Gray Treefrog",
    "Carphophis Vermis",
    "California Leaf-Nosed Bat",
    "Plestiodon Egregius",
    "Anniella Pulchra",
    "Plestiodon Anthracinus",
    "Arboreal Salamander",
    "Coast Horned Lizard",
    "Pacific Pocket Mouse",
    "Two-Striped Garter Snake",
    "Four-Toed Salamander",
    "Brush Mouse",
    "Canyon Bat",
    "Sistrurus Catenatus Edwardsii",
    "New Mexico Spadefoot Toad",
    "Ghost-Faced Bat",
    "Red Hills Salamander",
    "Eastern Small-Footed Myotis",
    "Mexican Long-Tongued Bat",
    "California Tree Frog",
    "California Myotis",
    "Mexican Fox Squirrel",
    "Northern Red-Backed Vole",
    "Shortened Garter Snake",
    "Red-Tailed Chipmunk",
    "Mink Frog",
    "Pine Woods Tree Frog",
    "Montane Vole",
    "Cotton Mouse",
    "Mazama Pocket Gopher",
    "Oldfield Mouse",
    "Alpine Chipmunk",
    "Lodgepole Chipmunk",
    "Cliff Chipmunk",
    "Southeastern Pocket Gopher",
    "Long-Tailed Vole",
    "Smoky Shrew",
    "Western Mastiff Bat",
    "Flordia Bonneted Bat",
    "Desert Red Bat",
    "Small-Mouth Salamander",
    "Northern Bog Lemming",
    "Elliot's Short-Tailed Shrew",
    "Broad-Footed Mole",
    "Townsend's Mole",
    "Western Jumping Mouse",
    "California Kangaroo Rat",
    "Incilius Nebulifer",
    "Hopi Chipmunk",
    "Allen's Chipmunk",
    "Narrow-Headed Garter Snake",
    "Plestiodon Gilberti",
    "Yellow-Faced Pocket Gopher",
    "Desert Night Lizard",
    "Sonoma Chipmunk",
    "Palmer's Chipmunk",
    "Red Tree Vole",
    "Texas Spotted Whiptail",
    "Long-Eared Chipmunk",
    "Crotalus Pricei",
    "Sierra Newt",
    "Cascade Red Fox",
    "Seminole Bat",
    "Northern Yellow Bat",
    "Coast Mole",
    "Mount Graham Red Squirrel",
    "Long-Tailed Shrew",
    "Madrean Alligator Lizard",
    "Thamnophis Sirtalis Semifasciatus",
    "Pacific Jumping Mouse",
    "Long-Eared Myotis",
    "Vagrant Shrew",
    "Crawford's Gray Shrew",
    "Southeastern Myotis",
    "Upland Chorus Frog",
    "Rock Vole",
    "Water Vole",
    "Merriam's Chipmunk",
    "Velvety Free-Tailed Bat",
    "Arizona Toad",
    "Rio Grande Leopard Frog",
    "Sceloporus Occidentalis Bocourtii",
    "Foothill Yellow-Legged Frog",
    "Eastern Harvest Mouse",
    "Gray-Collared Chipmunk",
    "Frosted Flatwoods Salamander",
    "Long-Legged Myotis",
    "Drymobius Margaritiferus",
    "Plestiodon Multivirgatus",
    "Sceloporus Poinsettii",
    "Morro Bay Kangaroo Rat",
    "Yellow-Cheeked Chipmunk",
    "Little Grass Frog",
    "Channel Islands Spotted Skunk",
    "Crawfish Frog",
    "Western Small-Footed Bat",
    "Southern Cricket Frog",
    "Gray-Footed Chipmunk",
    "Common Mexican Tree Frog",
    "Sierra Garter Snake",
    "Sagebrush Vole",
    "Cascade Golden-Mantled Ground Squirrel",
    "Great Basin Pocket Mouse",
    "Townsend's Vole",
    "Fringed Myotis",
    "Marsh Shrew",
    "Big Free-Tailed Bat",
    "Ozark Big-Eared Bat",
    "Idaho Ground Squirrel",
    "Common Checkered Whiptail",
    "California Night Snake",
    "Cheat Mountain Salamander",
    "Desert Pocket Gopher",
    "Cave Myotis",
    "Panamint Chipmunk",
    "Little Striped Whiptail",
    "Pinyon Mouse",
    "Striped Newt",
    "Streamside Salamander",
    "Granite Spiny Lizard",
    "Tantilla Gracilis",
    "Siskiyou Chipmunk",
    "Creeping Vole",
    "Western Heather Vole",
    "Montane Shrew",
    "Wehrle's Salamander",
    "Plains Black-Headed Snake",
    "Agile Kangaroo Rat",
    "Southern Yellow Bat",
    "Southern Red-Backed Salamander",
    "Southern Pocket Gopher",
    "Rhineura",
    "Mexican Box Turtle",
    "Trowbridge's Shrew",
    "Chihuahuan Spotted Whiptail",
    "Tundra Shrew",
    "Flattened Musk Turtle",
    "Florida Crowned Snake",
    "Western Redback Salamander",
    "Eastern Glass Lizard",
    "Pacific Shrew",
    "Panamint Alligator Lizard",
    "Mountain Chorus Frog",
    "Smith Island Cottontail",
    "Mountain Pocket Gopher",
    "Ringed Salamander",
    "Sceloporus Variabilis",
    "Santa Cruz Long-Toed Salamander",
    "Taiga Vole",
    "Southeastern Shrew",
    "Heermann's Kangaroo Rat",
    "Lampropeltis Knoblochi",
    "California Pocket Mouse",
    "Robust Cottontail",
    "Canyon Mouse",
    "Cedros Island Mule Deer",
    "San Diego Mountain Kingsnake",
    "Western Red-Backed Vole",
    "Red-Cheeked Salamander",
    "Merriam's Shrew",
    "Northwestern Deer Mouse",
    "Arizona Myotis",
    "Gray-Tailed Vole",
    "Southern Chorus Frog",
    "Velvety Fruit-Eating Bat",
    "Sceloporus Jarrovii",
    "Sphaerodactylus Notatus",
    "Mexican Vole",
    "Dwarf Shrew",
    "Keen's Myotis",
    "Great Lakes Wolf",
    "Idaho Pocket Gopher",
    "Key Largo Cotton Mouse",
    "Columbia Torrent Salamander",
    "Mimic Glass Lizard",
    "Sceloporus Grammicus",
    "Florida Bog Frog",
    "Allen's Big-Eared Bat",
    "Dwarf Salamander",
    "Sceloporus Occidentalis Becki",
    "Island Glass Lizard",
    "Pygmy Salamander",
    "White-Footed Vole",
    "Southwestern Fence Lizard",
    "San Bernardino Kangaroo Rat",
    "Texas Mouse",
    "Van Dyke's Salamander",
    "Eastern Heather Vole",
    "Arizona Cotton Rat",
    "Plestiodon Tetragrammus",
    "Banded Rock Lizard",
    "Clouded Salamander",
    "Merriam's Ground Squirrel",
    "Western Yellow Bat",
    "Chadwick Beach Cotton Mouse",
    "Mexican Spiny Pocket Mouse",
    "Olive-Backed Pocked Mouse",
    "Lowland Burrowing Tree Frog",
    "Preble's Shrew",
    "Western Slimy Salamander",
    "California Red Tree Mouse",
    "Plestiodon Callicephalus",
    "Anniella Stebbinsi",
    "White-Eared Pocket Mouse",
    "Yonahlossee Salamander",
    "Black-Eared Mouse",
    "Wright's Mountain Tree Frog",
    "San Diego Pocket Mouse",
    "Baird's Shrew",
    "Fog Shrew",
    "Rim Rock Crown Snake",
    "Nelson's Pocket Mouse",
    "Southwestern Myotis",
    "Desmognathus Auriculatus",
    "Inyo Shrew",
    "Arizona Pocket Mouse",
    "Black-Bellied Slender Salamander",
    "Narrow-Faced Kangaroo Rat",
    "Ornate Chorus Frog",
    "Granite Night Lizard",
    "Trinity Bristle Snail",
    "Manzano Mountain Cottontail",
    "Mabee's Salamander",
    "Prarie Shrew",
    "Yellow-Nosed Cotton Rat",
    "Arizona Shrew",
    "Louisiana Slimy Salamander",
    "Strecker's Chorus Frog",
    "Coastal Range Newt",
    "White-Ankled Mouse",
    "Dulzura Kangaroo Rat",
    "Underwood's Bonneted Bat",
    "Prince of Wales Flying Squirrel",
    "Hurter's Spadefoot Toad",
    "Ficimia Streckeri",
    "New Mexico Shrew",
    "Urosaurus Nigricaudus",
    "Mexican Narrow-Mouthed Toad",
    "Gray Checkered Whiptail",
    "Holbrookia Propinqua",
    "Northern Pygmy Mouse",
    "Leptodactylus Fragilis",
    "Sacramento Mountain Salamander",
    "Olympic Shrew",
    "Tawny-Bellied Cotton Rat",
    "Northern Rock Mouse",
    "Siskiyou Mountains Salamander",
    "Gila Spotted Whiptail",
    "Shenandoah Mountain Salamander",
    "Osgood's Mouse",
    "Dark-Nosed Small-Footed Myotis",
    "Bezy's Night Lizard",
    "Brimley's Chorus Frog",
    "Canyon Spotted Whiptail",
    "Kern Canyon Slender Salamander",
    "Rena Dissecta",
    "Tehachapi Slender Salamander",
    "Scott Bar Salamander",
    "Rich Mountain Salamander",
    "Plateau Striped Whiptail",
    "Colorado Checkered Whiptail",
    "Sequoyah Slimy Salamander",
    "Hell Hollow Slender Salamander",
    "Selvin's Bunchgrass Lizard",
    "Giant Spotted Whiptail",
    "Blue Ridge Dusky Salamander",
    "Carolina Mountain Dusky Salamander",
    "Relictual Slender Salamander",
    "San Gabriel Slender Salamander",
    "Tellico Salamander",
    "Santa Lucia Mountains Slender Salamander",
    "Carolina Mountain Dusky Salamander",
    "Relictual Slender Salamander",
    "Carolina Mountain Dusky Salamander",
    "Relictual Slender Salamander",
    "San Gabriel Slender Salamander",
    "Tellico Salamander",
    "Santa Lucia Mountains Slender Salamander",
    "Kings River Slender Salamander",
    "Chamberlain's Dwarf Salamander",
    "Sequoia Slender Salamander",
    "Grizzly Bear",
    "Allegheny Woodrat",
    "Dusky-Footed Woodrat",
    "Silky Anteater",
    "Giant Anteater",
    "Northern Tamandua",
    "Southern Tamandua",
];

module.exports = {
	data: new SlashCommandBuilder()
		.setName('explore')
		.setDescription('me olmec, you exlplore'),
  
	async execute(interaction: any) {
	await interaction.deferReply();
	
	try {
	
		const isPokemon = Math.random() < SHINY_RATE;
		
		if (isPokemon) {
			const pokemonId = pokemonList[Math.floor(Math.random() * pokemonList.length)];
			const randomWeight = Math.floor(Math.random() * 1000) + 1;
			
			const pokeData = await fetchPokeAPI(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`) as PokeAPIResponse;
			const imageUrl = pokeData.sprites.other['official-artwork'].front_shiny;
			const pokemonName = pokeData.name.charAt(0).toUpperCase() + pokeData.name.slice(1);
	        // Save to database
	        try {
	          await savePokemonCatch(interaction.user.id, {
	            pokemonId,
	            pokemonName,
	            weight: randomWeight,
	            imageUrl,
	            caughtAt: new Date()
	          });
	        } catch (dbError) {
	          console.error('Failed to save Pokémon to database:', dbError);
	          // Continue anyway - user still gets the Pokémon in chat
	        }
			if (!imageUrl) {
				return interaction.editReply(`Super rare mythical pull. You caught a shiny ${pokemonName}! It weighs ${randomWeight}kg <:pog:1416513137536008272>`);
			}
			
			return interaction.editReply({
				content: `Super rare mythical pull. You caught a shiny ${pokemonName}! It weighs ${randomWeight}kg <:pog:1416513137536008272>`,
				files: [imageUrl]
			});
		
		} else {
			const animal = exploreList[Math.floor(Math.random() * exploreList.length)];
			
			const searchData = await fetchWikipedia(
				`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(animal)}&format=json`
			) as WikiSearchResult;
			
			if (!searchData.query?.search?.[0]) {
				return interaction.editReply(`You caught a ${animal}, but it got away!`);
			}
			
			const pageId = searchData.query.search[0].pageid;
			const pageData = await fetchWikipedia(
				`https://en.wikipedia.org/w/api.php?action=query&pageids=${pageId}&prop=pageimages&piprop=original|thumbnail&pithumbsize=800&format=json`
			) as WikiPageResult;
			
			const weightRange = getWeightRange(animal);
			const randomWeight = weightRange.max < 1 
			  ? (Math.random() * (weightRange.max - weightRange.min) + weightRange.min).toFixed(1) // small case
			  : Math.floor(Math.random() * (weightRange.max - weightRange.min + 1)) + weightRange.min;
			
			const page = pageData.query.pages[pageId];
			const imageUrl = page.thumbnail?.source || page.original?.source;
			
			if (!imageUrl) {
				return interaction.editReply(`You explored the wilderness and found a ${animal}, it weighs ${randomWeight}kg`);
			}

			const fileSize = await getFileSize(imageUrl);
			const MAX_SIZE = 25 * 1024 * 1024; //25mb
			
			if (fileSize > MAX_SIZE) {
				console.log(`img error`);
				return interaction.editReply({
				content: `You explored the wilderness and found a ${animal}, it weighs ${randomWeight}kg`,
				});
			}
			
			return interaction.editReply({
				content: `You explored the wilderness and found a ${animal}, it weighs ${randomWeight}kg`,
				files: [imageUrl]
			});
		}
		
	} catch (err) {
		console.error(err);
		return interaction.editReply("error animal img fetch");
	}
	}
};

// check /dig
function getFileSize(url: string): Promise<number> {
  return new Promise((resolve, reject) => {
    https.get(url, { method: 'HEAD' }, (res) => {
      const size = parseInt(res.headers['content-length'] || '0', 10);
      resolve(size);
    }).on('error', reject);
  });
}

function fetchWikipedia(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'discord bot - animal command'
      }
    };
    https.get(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

function fetchPokeAPI(url: string): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'discord bot - animal command'
      }
    };
    https.get(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

function getWeightRange(animalName: string): { min: number; max: number } {
  const name = animalName.toLowerCase();
  
  if (name.includes('bear')) {
    return { min: 100, max: 700 };
  }

  //cats
  if (name.includes('cougar') || 
      name.includes('lynx') || 
      name.includes('bobcat') || 
      name.includes('jaguarundi') || 
      name.includes('ocelot')) {
    return { min: 10, max: 150 }; 
  }

  //dogs
  if (name.includes('wolf') || 
      name.includes('coyote') || 
      name.includes('fox') || 
      name.includes('red wolf') || 
      name.includes('gray wolf')) {
    return { min: 40, max: 120 };
  }
  //mammals
  if (name.includes('squirrel') || 
      name.includes('chipmunk') || 
      name.includes('rat') || 
      name.includes('mouse') ||
      name.includes('mole') ||
      name.includes('bat') ||
      name.includes('shrew') ||
      name.includes('vole')) {
    return { min: 0.1, max: 2 };
  }

  //reptiles 
  if (name.includes('snake') || 
      name.includes('lizard') || 
      name.includes('turtle') || 
      name.includes('boa') || 
      name.includes('rattlesnake') || 
      name.includes('gecko')) {
    return { min: 0.1, max: 100 };
  }

  //amphibians
  if (name.includes('frog') || 
      name.includes('salamander') || 
      name.includes('newt') || 
      name.includes('toad')) {
    return { min: 0.01, max: 1 };
  }

  //apes
  if (name.includes('monkey') || 
      name.includes('gorilla') || 
      name.includes('chimpanzee') || 
      name.includes('orangutan') || 
      name.includes('bonobo') || 
      name.includes('howler monkey') || 
      name.includes('capuchin monkey')) {
    return { min: 20, max: 200 };
  }


  return { min: 1, max: 1000 };
}
