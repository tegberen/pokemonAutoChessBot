const { SlashCommandBuilder } = require('discord.js');
const https = require('https');
import { savePokemonCatch } from '../services/pokemonService';
// const
const DLC_CATCH_RATE = 0.4;
const TREASURE_RATE = 1.0;

const URL = 'https://raw.githubusercontent.com/tegberen/pokemonAutoChessBot/src/assets/';

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

const fishList = [
	"African glass catfish",
	"African lungfish",
	"Aholehole",
	"Airbreathing catfish",
	"Airsac catfish",
	"Alaska blackfish",
	"Albacore",
	"Alewife",
	"Alfonsino",
	"Alligatorfish",
	"Alligator gar",
	"Amberjack",
	"American sole",
	"Amur pike",
	"Anchovy",
	"Anemonefish",
	"Angelfish",
	"Angler",
	"Angler catfish",
	"Anglerfish",
	"Antarctic cod",
	"Antarctic icefish",
	"Antenna codlet",
	"Arapaima",
	"Archerfish",
	"Arctic char",
	"Armored gurnard",
	"Armored searobin",
	"Armorhead",
	"Armorhead catfish",
	"Armoured catfish",
	"Arowana",
	"Arrowtooth eel",
	"Asian carp",
	"Asiatic glassfish",
	"Atka mackerel",
	"Atlantic bonito",
	"Atlantic cod",
	"Atlantic herring",
	"Atlantic salmon",
	"Atlantic saury",
	"Atlantic sharpnose shark",
	"Atlantic silverside",
	"Australasian salmon",
	"Australian grayling",
	"Australian herring",
	"Australian lungfish",
	"Australian prowfish",
	"Ayu",
	"Baikal oilfish",
	"Bala shark",
	"Ballan wrasse",
	"Bamboo shark",
	"Banded killifish",
	"Bandfish",
	"Bangus",
	"Banjo",
	"Banjo catfish",
	"Barb",
	"Barbel",
	"Barbeled dragonfish",
	"Barbeled houndshark",
	"Barbel-less catfish",
	"Barfish",
	"Barracuda",
	"Barracudina",
	"Barramundi",
	"Barred danio",
	"Barreleye",
	"Basking shark",
	"Bass",
	"Basslet",
	"Bat ray",
	"Batfish",
	"Beachsalmon",
	"Beaked salmon",
	"Beaked sandfish",
	"Beardfish",
	"Beluga sturgeon",
	"Bengal danio",
	"Betta",
	"Bichir",
	"Bicolor goat fish",
	"Bigeye",
	"Bigeye squaretail",
	"Bighead carp",
	"Bigmouth buffalo",
	"Bigscale",
	"Bigscale pomfret",
	"Billfish",
	"Bitterling",
	"Black angelfish",
	"Black bass",
	"Black dragonfish",
	"Black mackerel",
	"Black neon tetra",
	"Black scabbardfish",
	"Black scalyfin",
	"Black sea bass",
	"Black swallower",
	"Black tetra",
	"Black triggerfish",
	"Blackchin",
	"Blackfin tuna",
	"Blackfish",
	"Blacktip reef shark",
	"Bleak",
	"Blenny",
	"Blind goby",
	"Blind shark",
	"Blobfish",
	"Blowfish",
	"Blue catfish",
	"Blue danio",
	"Blue eye trevalla",
	"Blue shark",
	"Blue triggerfish",
	"Blue whiting",
	"Blue-redstripe danio",
	"Bluefin tuna",
	"Bluefish",
	"Bluegill",
	"Blue gourami",
	"Bluntnose knifefish",
	"Bluntnose minnow",
	"Boafish",
	"Boarfish",
	"Bobtail snipe eel",
	"Bocaccio",
	"Boga",
	"Bombay duck",
	"Bonefish",
	"Bonito",
	"Bonnethead shark",
	"Bonnetmouth",
	"Bonytail",
	"Bonytongue",
	"Bowfin",
	"Boxfish",
	"Bramble shark",
	"Bream",
	"Brill",
	"Bristlemouth",
	"Bristlenose catfish",
	"Broadband dogfish",
	"Bronze corydoras",
	"Brook lamprey",
	"Brook stickleback",
	"Brook trout",
	"Brotula",
	"Brown trout",
	"Buffalo fish",
	//"Bull shark",
	"Bull trout",
	"Bullhead",
	"Bullhead shark",
	"Bumblebee goby",
	"Burbot",
	"Buri",
	"Burma danio",
	"Burrowing goby",
	"Butterfish",
	"Butterfly ray",
	"Butterflyfish",
	"California flyingfish",
	"California halibut",
	"Canary rockfish",
	"Candiru",
	"Candlefish",
	"Capelin",
	"Cardinal tetra",
	"Cardinalfish",
	"Carp",
	"Carpetshark",
	"Carpsucker",
	"Cat shark",
	"Catalufa",
	"Catfish",
	"Catla",
	"Cavefish",
	"Celebes rainbowfish",
	"Central mudminnow",
	"Chain pickerel",
	"Channel bass",
	"Channel catfish",
	"Char",
	"Cherry salmon",
	"Chimaera",
	"Chinook salmon",
	"Cherubfish",
	"Chub",
	"Chubsucker",
	"Chum salmon",
	"Cichlid",
	//"Cisco",
	"Climbing catfish",
	"Climbing gourami",
	"Climbing perch",
	"Clingfish",
	"Clown loach",
	"Clown triggerfish",
	"Clownfish",
	"Cobbler",
	"Cobia",
	"Cod",
	"Codlet",
	"Codling",
	"Coelacanth",
	"Coffinfish",
	"Coho salmon",
	"Coley",
	"Collared carpetshark",
	"Collared dogfish",
	"Colorado squawfish",
	"Combfish",
	"Combtail gourami",
	"Combtooth blenny",
	"Common carp",
	"Common tunny",
	"Conger eel",
	"Convict blenny",
	"Convict cichlid",
	"Cookiecutter shark",
	"Coolie loach",
	"Cornetfish",
	"Cow shark",
	"Cowfish",
	"Cownose ray",
	"Crappie",
	"Creek chub",
	"Crestfish",
	"Crevice kelpfish",
	"Croaker",
	"Crocodile icefish",
	"Crocodile shark",
	"Crucian carp",
	"Cuckoo wrasse",
	//"Cusk",
	"Cusk-eel",
	"Cutlassfish",
	"Cutthroat eel",
	"Cutthroat trout",
	"Dab",
	"Dace",
	"Daggertooth pike conger",
	"Damselfish",
	"Danio",
	"Dartfish",
	"Dealfish",
	"Death Valley pupfish",
	"Deep-sea eel",
	"Deep-sea smelt",
	"Deepwater cardinalfish",
	"Deepwater flathead",
	"Deepwater stingray",
	"Delta smelt",
	"Demoiselle",
	"Denticle herring",
	"Desert pupfish",
	"Devario",
	"Devil ray",
	"Dhufish",
	//"Discus",
	"Dogfish",
	"Dogfish shark",
	"Dogteeth tetra",
	"Dojo loach",
	"Dolly Varden trout",
	"Dolphin fish",
	"Dorab wolf-herring",
	"Dorado",
	"Dory",
	"Dottyback",
	"Dragon goby",
	"Dragonet",
	"Dragonfish",
	"Driftfish",
	"Driftwood catfish",
	//"Drum",
	"Duckbill",
	"Duckbill eel",
	"Dusky grouper",
	"Dusky shark",
	"Dwarf gourami",
	"Dwarf loach",
	"Eagle ray",
	"Earthworm eel",
	"Eel",
	"Eel cod",
	"Eel-goby",
	"Eelpout",
	"Eeltail catfish",
	"Elasmobranch",
	"Electric catfish",
	"Electric eel",
	"Electric knifefish",
	"Electric ray",
	"Elephant fish",
	"Elephantnose fish",
	"Elver",
	"Ember parrotfish",
	"Emerald catfish",
	//"Emperor",
	"Emperor angelfish",
	"Emperor bream",
	"Escolar",
	"Eucla cod",
	"Eulachon",
	"European chub",
	"European eel",
	"European flounder",
	"European minnow",
	"European perch",
	"False brotula",
	"False cat shark",
	"False moray",
	"False trevally",
	"Fangtooth",
	"Fathead sculpin",
	"Featherback",
	"Fierasfer",
	"Filefish",
	"Finback cat shark",
	"Fingerfish",
	"Fire bar danio",
	"Fire goby",
	"Firefish",
	"Flabby whale fish",
	"Flagblenny",
	"Flagfin",
	"Flagfish",
	"Flagtail",
	"Flashlight fish",
	"Flatfish",
	"Flathead",
	"Flathead catfish",
	"Flier",
	"Flounder",
	"Flying fish",
	"Flying gurnard",
	"Footballfish",
	"Forehead brooder",
	"Four-eyed fish",
	"French angelfish",
	"Freshwater eel",
	"Freshwater hatchetfish",
	"Freshwater shark",
	"Frigate mackerel",
	"Frilled shark",
	"Frogfish",
	"Frogmouth catfish",
	"Fusilier fish",
	"Galjoen fish",
	"Ganges shark",
	"Gar",
	"Garden eel",
	//"Garibaldi",
	"Garpike",
	"Ghost fish",
	"Ghost flathead",
	"Ghost knifefish",
	"Ghost pipefish",
	"Ghost shark",
	"Ghoul",
	"Giant danio",
	"Giant gourami",
	"Giant sea bass",
	"Gibberfish",
	"Gila trout",
	"Gizzard shad",
	"Glass catfish",
	"Glass knifefish",
	"Glassfish",
	"Glowlight danio",
	"Goatfish",
	"Goblin shark",
	"Goby",
	"Golden dojo",
	"Golden loach",
	"Golden shiner",
	"Golden trout",
	"Goldeye",
	"Goldfish",
	"Gombessa",
	"Goosefish",
	"Gopher rockfish",
	"Gourami",
	"Grass carp",
	"Graveldiver",
	"Gray mullet",
	"Gray reef shark",
	"Grayling",
	"Great white shark",
	"Green spotted puffer",
	"Green swordtail",
	"Greeneye",
	"Greenling",
	//"Grenadier",
	"Ground shark",
	"Grouper",
	"Grunion",
	"Grunt",
	"Grunt sculpin",
	"Grunter",
	//"Gudgeon",
	"Guitarfish",
	"Gulf menhaden",
	"Gulper",
	"Gulper eel",
	"Gunnel",
	"Guppy",
	"Gurnard",
	"Haddock",
	"Hagfish",
	"Hairtail",
	"Hake",
	"Halfbeak",
	"Halfmoon",
	"Halibut",
	"Halosaur",
	//"Hamlet",
	"Hammerhead shark",
	"Hammerjaw",
	"Handfish",
	"Hardhead catfish",
	"Harelip sucker",
	"Hatchetfish",
	"Hawkfish",
	//"Herring",
	"Herring smelt",
	"Hickory Shad",
	"Hillstream loach",
	"Hog sucker",
	"Hoki",
	"Horn shark",
	"Horsefish",
	"Houndshark",
	"Huchen",
	"Humuhumunukunukuapua'a",
	//"Hussar",
	"Icefish",
	"Ide",
	"Ilish",
	"Inanga",
	"Inconnu",
	"Jack",
	//"Jack Dempsey",
	"Jackfish",
	"Japanese eel",
	//"Javelin",
	"Jawfish",
	"Jellynose fish",
	"Jewel tetra",
	"Jewelfish",
	"Jewfish",
	"John Dory",
	"Kafue pike",
	"Kahawai",
	"Kaluga",
	"Kanyu",
	"Kelp perch",
	"Kelpfish",
	"Killifish",
	"King of the herrings",
	"King-of-the-salmon",
	"Kingfish",
	"Kissing gourami",
	"Knifefish",
	"Knifejaw",
	"Koi",
	"Kokanee",
	"Kokopu",
	"Kuhli loach",
	"Labyrinth fish",
	"Ladyfish",
	"Lake chub",
	"Lake trout",
	"Lake whitefish",
	"Lampfish",
	"Lamprey",
	"Lancetfish",
	"Lanternfish",
	"Largemouth bass",
	"Leaffish",
	"Leatherjacket",
	"Lefteye flounder",
	"Lemon shark",
	"Lemon sole",
	"Lemon tetra",
	"Lenok",
	"Leopard danio",
	"Lightfish",
	"Limia",
	"Lined sole",
	"Ling",
	"Ling cod",
	"Lionfish",
	"Livebearer",
	"Lizardfish",
	//"Loach",
	"Loach catfish",
	"Loach goby",
	"Loach minnow",
	"Longfin",
	//"Longfin dragonfish",
	"Longfin escolar",
	"Longfin smelt",
	"Long-finned char",
	"Long-finned pike",
	"Long-finned sand diver",
	"Longjaw mudsucker",
	"Longneck eel",
	"Longnose chimaera",
	"Longnose dace",
	"Longnose lancetfish",
	"Longnose sucker",
	"Longnose whiptail catfish",
	"Long-whiskered catfish",
	"Loosejaw",
	"Lost River sucker",
	"Louvar",
	"Loweye catfish",
	"Luderick",
	"Luminous hake",
	"Lumpsucker",
	"Lungfish",
	"Mackerel",
	"Mackerel shark",
	"Madtom",
	"Mahi-mahi",
	"Mahseer",
	"Mail-cheeked fish",
	"Mako shark",
	"Mandarinfish",
	"Manefish",
	"Man-of-war fish",
	"Manta ray",
	"Marblefish",
	"Marine hatchetfish",
	"Marlin",
	"Masu salmon",
	"Medaka",
	"Medusafish",
	"Megamouth shark",
	"Menhaden",
	"Merluccid hake",
	"Mexican golden trout",
	"Midshipman fish",
	"Milkfish",
	"Minnow",
	"Minnow of the deep",
	"Modoc sucker",
	"Mojarra",
	"Mola mola",
	"Monkeyface prickleback",
	"Monkfish",
	"Mooneye",
	"Moonfish",
	"Moorish idol",
	"Mora",
	"Moray eel",
	"Morid cod",
	"Morwong",
	"Moses sole",
	"Mosquitofish",
	"Mouthbrooder",
	"Mozambique tilapia",
	"Mrigal",
	"Mud catfish",
	"Mud minnow",
	"Mudfish",
	"Mudskipper",
	"Mudsucker",
	"Mullet",
	"Mummichog",
	"Murray cod",
	"Muskellunge",
	"Mustache triggerfish",
	"Mustard eel",
	"Naked-back knifefish",
	"Nase",
	"Needlefish",
	"Neon tetra",
	"New World rivuline",
	"New Zealand sand diver",
	//"New Zealand smelt",
	"Nibble fish",
	"Noodlefish",
	"North American darter",
	"North American freshwater catfish",
	"North Pacific daggertooth",
	"Northern anchovy",
	"Northern clingfish",
	"Northern lampfish",
	"Northern pike",
	"Northern sea robin",
	"Northern squawfish",
	"Northern stargazer",
	"Notothen",
	"Nurse shark",
	"Nurseryfish",
	"Oarfish",
	"Ocean perch",
	"Ocean sunfish",
	"Oceanic whitetip shark",
	"Oilfish",
	"Old World knifefish",
	"Oldwife",
	"Olive flounder",
	"Opah",
	"Opaleye",
	"Orange roughy",
	"Orangespine unicorn fish",
	"Orangestriped triggerfish",
	"Orbicular batfish",
	"Orbicular velvetfish",
	"Oregon chub",
	"Orfe",
	"Oriental loach",
	"Oscar",
	"Owens pupfish",
	"Pacific albacore",
	"Pacific cod",
	"Pacific hake",
	"Pacific herring",
	"Pacific lamprey",
	"Pacific rudderfish",
	"Pacific salmon",
	"Pacific saury",
	"Pacific trout",
	"Pacific viperfish",
	"Paddlefish",
	"Pancake batfish",
	"Panga",
	"Paradise fish",
	"Parasitic catfish",
	"Parore",
	"Parrotfish",
	"Peacock flounder",
	"Peamouth",
	"Pearl danio",
	"Pearl perch",
	"Pearleye",
	"Pearlfish",
	"Pelagic cod",
	"Pelican eel",
	"Pelican gulper",
	"Pencil catfish",
	"Pencilfish",
	"Pencilsmelt",
	"Peppered corydoras",
	"Perch",
	"Peters' elephantnose fish",
	"Pickerel",
	"Pigfish",
	"Pike",
	"Pike conger",
	"Pike eel",
	"Pikeblenny",
	"Pikeperch",
	"Pilchard",
	"Pilot fish",
	"Pineapplefish",
	"Pineconefish",
	"Pink salmon",
	"Píntano",
	"Pipefish",
	"Piranha",
	"Pirarucu",
	"Pirate perch",
	"Plaice",
	"Platy",
	"Platyfish",
	"Pleco",
	"Plownose chimaera",
	"Poacher",
	"Pollock",
	"Pollyfish",
	"Pomfret",
	"Pompano",
	"Pompano dolphinfish",
	"Ponyfish",
	"Popeye catalufa",
	"Porbeagle shark",
	"Porcupinefish",
	"Porgy",
	"Port Jackson shark",
	"Powen",
	"Prickleback",
	"Pricklefish",
	"Prickly shark",
	"Prowfish",
	"Pufferfish",
	"Pumpkinseed",
	"Pupfish",
	"Pygmy sunfish",
	"Queen danio",
	"Queen parrotfish",
	"Queen triggerfish",
	"Quillback",
	"Quillfish",
	"Rabbitfish",
	"Raccoon butterfly fish",
	"Ragfish",
	"Rainbow trout",
	"Rainbowfish",
	"Rasbora",
	"Ratfish",
	//"Rattail",
	"Ray",
	"Razorback sucker",
	"Razorfish",
	"Red grouper",
	"Red salmon",
	"Red snapper",
	"Redfin perch",
	"Redfish",
	"Redhorse sucker",
	"Redlip blenny",
	"Redmouth whalefish",
	"Redtooth triggerfish",
	"Red velvetfish",
	"Red whalefish",
	"Reedfish",
	"Reef triggerfish",
	"Remora",
	"Requiem shark",
	"Ribbon eel",
	"Ribbon sawtail fish",
	"Ribbonfish",
	"Rice eel",
	"Ricefish",
	"Ridgehead",
	"Riffle dace",
	"Righteye flounder",
	"Rio Grande perch",
	"River loach",
	"River shark",
	"River stingray",
	"Rivuline",
	"Roach",
	"Roanoke bass",
	"Rock bass",
	"Rock beauty",
	"Rock cod",
	"Rock gunnel",
	"Rocket danio",
	"Rockfish",
	"Rockling",
	"Rockweed gunnel",
	"Rohu",
	//"Ronquil",
	"Roosterfish",
	"Ropefish",
	"Rough scad",
	"Rough sculpin",
	"Roughy",
	//"Roundhead",
	//"Round herring",
	"Round stingray",
	"Round whitefish",
	//"Rudd",
	"Rudderfish",
	"Ruffe",
	"Russian sturgeon",
	"Sábalo",
	"Sabertooth",
	"Saber-toothed blenny",
	"Sabertooth fish",
	"Sablefish",
	"Sacramento blackfish",
	"Sacramento splittail",
	"Sailfin silverside",
	"Sailfish",
	"Salamanderfish",
	"Salmon",
	"Salmon shark",
	"Sandbar shark",
	"Sandburrower",
	"Sand dab",
	"Sand diver",
	"Sand eel",
	"Sandfish",
	"Sand goby",
	"Sand knifefish",
	"Sand lance",
	"Sandperch",
	"Sandroller",
	"Sand stargazer",
	"Sand tiger",
	"Sand tilefish",
	"Sarcastic fringehead",
	"Sardine",
	"Sargassum fish",
	"Sauger",
	"Saury",
	"Saw shark",
	"Sawfish",
	"Sawtooth eel",
	"Scabbard fish",
	"Scaly dragonfish",
	"Scat",
	"Scissortail rasbora",
	"Scorpionfish",
	"Sculpin",
	"Scup",
	"Sea bass",
	"Sea bream",
	"Sea catfish",
	"Sea chub",
	//"Sea devil",
	"Sea dragon",
	//"Sea lamprey", fsk 18
	"Sea raven",
	"Sea snail",
	"Sea toad",
	"Seahorse",
	"Seamoth",
	"Searobin",
	"Sergeant major",
	"Sevan trout",
	"Shad",
	"Shark",
	"Sharksucker",
	"Sharpnose puffer",
	"Sheatfish",
	"Sheepshead",
	"Sheepshead minnow",
	"Shiner",
	"Shortnose chimaera",
	"Shortnose sucker",
	"Shovelnose sturgeon",
	"Shrimpfish",
	"Siamese fighting fish",
	"Sillago",
	"Silver carp",
	"Silver dollar",
	"Silver dory",
	"Silver hake",
	"Silverside",
	"Silvertip tetra",
	"Sind danio",
	"Sixgill ray",
	"Sixgill shark",
	"Skate",
	"Skilfish",
	"Skipjack tuna",
	"Slender mola",
	"Slender snipe eel",
	"Sleeper",
	"Sleeper shark",
	"Slickhead",
	"Slimehead",
	"Slimy mackerel",
	"Slimy sculpin",
	"Slipmouth",
	"Smalleye squaretail",
	"Smalltooth sawfish",
	"Smelt",
	"Smelt-whiting",
	"Smooth dogfish",
	"Snailfish",
	"Snake eel",
	"Snake mackerel",
	"Snakehead",
	"Snapper",
	"Snipe eel",
	"Snipefish",
	//"Snook",
	"Snubnose eel",
	"Snubnose parasitic eel",
	"Sockeye salmon",
	"Soldierfish",
	"Sole",
	"South American darter",
	"South American lungfish",
	"Southern Dolly Varden",
	"Southern flounder",
	"Southern hake",
	"Southern sandfish",
	"Southern smelt",
	"Spadefish",
	"Spaghetti eel",
	"Spanish mackerel",
	"Spearfish",
	"Speckled trout",
	"Spiderfish",
	"Spikefish",
	"Spinefoot",
	"Spiny basslet",
	"Spiny dogfish",
	"Spiny dwarf catfish",
	"Spiny eel",
	"Spinyfin",
	"Splitfin",
	"Spookfish",
	"Spotted climbing perch",
	"Spotted danio",
	"Spottail pinfish",
	"Sprat",
	"Springfish",
	"Squarehead catfish",
	"Squaretail",
	"Squawfish",
	"Squeaker",
	"Squirrelfish",
	"Staghorn sculpin",
	"Stargazer",
	"Starry flounder",
	"Steelhead",
	"Stickleback",
	"Stingfish",
	"Stingray",
	"Stonecat",
	"Stonefish",
	"Stoneroller minnow",
	"Stream catfish",
	"Striped bass",
	"Striped burrfish",
	"Sturgeon",
	"Sucker",
	"Suckermouth armored catfish",
	"Summer flounder",
	"Sundaland noodlefish",
	"Sunfish",
	"Surf sardine",
	"Surfperch",
	"Surgeonfish",
	//"Swallower",
	"Swamp-eel",
	"Swampfish",
	"Sweeper",
	"Swordfish",
	"Swordtail",
	"Tadpole cod",
	"Tadpole fish",
	//"Tailor",
	"Taimen",
	"Tang",
	"Tapetail",
	"Tarpon",
	"Tarwhine",
	"Telescopefish",
	"Temperate bass",
	"Temperate ocean-bass",
	"Temperate perch",
	"Tench",
	"Tenpounder",
	"Tenuis",
	"Tetra",
	"Thorny catfish",
	"Thornfish",
	"Threadfin",
	"Threadfin bream",
	"Thread-tail",
	"Three spot gourami",
	"Threespine stickleback",
	"Three-toothed puffer",
	"Thresher shark",
	"Tidewater goby",
	"Tiger barb",
	"Tigerfish",
	"Tigerperch",
	"Tiger shark",
	"Tiger shovelnose catfish",
	"Tilapia",
	"Tilefish",
	"Titan triggerfish",
	"Toadfish",
	"Tommy ruff",
	"Tompot blenny",
	"Tonguefish",
	"Tope",
	"Topminnow",
	//"Torpedo",
	"Torrent catfish",
	"Torrent fish",
	"Trahira",
	"Treefish",
	"Trevally",
	"Triggerfish",
	"Triplefin blenny",
	"Triplespine",
	"Tripletail",
	"Tripod fish",
	"Trout",
	"Trout cod",
	"Trout-perch",
	//"Trumpeter",
	"Trumpetfish",
	"Trunkfish",
	"Tubeblenny",
	"Tube-eye",
	"Tube-snout",
	"Tubeshoulder",
	"Tui chub",
	"Tuna",
	"Turbot",
	"Two spotted goby",
	"Uaru",
	"Unicorn fish",
	"Upside-down catfish",
	"Vanjaram",
	"Velvet belly lanternshark",
	"Velvet catfish",
	"Velvetfish",
	"Vendace",
	"Vermilion snapper",
	"Vimba",
	"Viperfish",
	"Wahoo",
	"Walking catfish",
	"Wallago",
	"Walleye",
	"Walleye pollock",
	"Walu",
	"Warmouth",
	"Warty angler",
	"Waryfish",
	"Waspfish",
	"Weasel shark",
	"Weatherfish",
	"Weever",
	"Weeverfish",
	"Wels catfish",
	"Whale catfish",
	"Whalefish",
	"Whale shark",
	"Whiff",
	"Whitebait",
	"White croaker",
	"Whitefish",
	"White marlin",
	"White shark",
	"Whitetip reef shark",
	"Whiting",
	"Wobbegong",
	"Wolf-eel",
	"Wolffish",
	"Wolf-herring",
	"Worm eel",
	"Wormfish",
	"Wrasse",
	"Wrymouth",
	"X-ray tetra",
	"Yellow-and-black triplefin",
	"Yellowback fusilier",
	"Yellowbanded perch",
	"Yellow bass",
	"Yellowedge grouper",
	"Yellow-edged moray",
	"Yellow-eye mullet",
	"Yellowhead jawfish",
	"Yellowfin croaker",
	"Yellowfin cutthroat trout",
	"Yellowfin grouper",
	"Yellowfin tuna",
	"Yellowfin pike",
	"Yellowfin surgeonfish",
	"Yellow jack",
	"Yellowmargin triggerfish",
	"Yellow moray",
	"Yellow perch",
	"Yellowtail",
	"Yellowtail amberjack",
	"Yellowtail barracuda",
	"Yellowtail clownfish",
	"Yellowtail horse mackerel",
	"Yellowtail kingfish",
	"Yellowtail snapper",
	"Yellow tang",
	"Yellow weaver",
	"Yellowtail catfish",
	"Zander",
	//"Zebra bullhead shark",
	"Zebra danio",
	"Zebrafish",
	"Zebra lionfish",
	"Zebra loach",
	"Zebra oto",
	"Zebra pleco",
	"Zebra shark",
	"Zebra tilapia",
	"Swedish fish", // mythical pull,
 	"<:pantsgrab:1442317852697821204>" //avo
];
const pokemonFishIds = [
	7, // Squirtle
	8, // Wartortle
	9, // Blastoise
	54, // Psyduck
	55, // Golduck
	60, // Poliwag
	61, // Poliwhirl
	62, // Poliwrath
	72, // Tentacool
	73, // Tentacruel
	79, // Slowpoke
	80, // Slowbro
	86, // Seel
	87, // Dewgong
	90, // Shellder
	91, // Cloyster
	98, // Krabby
	99, // Kingler
	116, // Horsea
	117, // Seadra
	118, // Goldeen
	119, // Seaking
	120, // Staryu
	121, // Starmie
	129, // Magikarp
	130, // Gyarados
	131, // Lapras
	134, // Vaporeon
	138, // Omanyte
	139, // Omastar
	140, // Kabuto
	141, // Kabutops
	158, // Totodile
	159, // Croconaw
	160, // Feraligatr
	170, // Chinchou
	171, // Lanturn
	183, // Marill
	184, // Azumarill
	186, // Politoed
	194, // Wooper
	195, // Quagsire
	199, // Slowking
	211, // Qwilfish
	222, // Corsola
	223, // Remoraid
	224, // Octillery
	226, // Mantine
	230, // Kingdra
	245, // Suicune
	258, // Mudkip
	259, // Marshtomp
	260, // Swampert
	270, // Lotad
	271, // Lombre
	272, // Ludicolo
	278, // Wingull
	279, // Pelipper
	283, // Surskit
	318, // Carvanha
	319, // Sharpedo
	320, // Wailmer
	321, // Wailord
	339, // Barboach
	340, // Whiscash
	341, // Corphish
	342, // Crawdaunt
	349, // Feebas
	350, // Milotic
	363, // Spheal
	364, // Sealeo
	365, // Walrein
	366, // Clamperl
	367, // Huntail
	368, // Gorebyss
	369, // Relicanth
	370, // Luvdisc
	382, // Kyogre
	393, // Piplup
	394, // Prinplup
	395, // Empoleon
	400, // Bibarel
	418, // Buizel
	419, // Floatzel
	422, // Shellos
	423, // Gastrodon
	456, // Finneon
	457, // Lumineon
	458, // Mantyke
	484, // Palkia
	489, // Phione
	490, // Manaphy
	493, // Arceus
	501, // Oshawott
	502, // Dewott
	503, // Samurott
	535, // Tympole
	536, // Palpitoad
	537, // Seismitoad
	550, // Basculin
	564, // Tirtouga
	565, // Carracosta
	592, // Frillish
	593, // Jellicent
	602,
	603,
	604,
	647, // Keldeo
	688, // Binacle
	689, // Barbaracle
	690, // Skrelp
	692, // Clauncher
	693, // Clawitzer
	721, // Volcanion
	728, // Popplio
	729, // Brionne
	730, // Primarina
	746, // Wishiwashi
	747, // Mareanie
	748, // Toxapex
	751, // Dewpider
	752, // Araquanid
	767, // Wimpod
	768, // Golisopod
	771, // Pyukumuku
	773, // Silvally
	788, // Tapu Fini
	816, // Sobble
	817, // Drizzile
	818, // Inteleon
	833, // Chewtle
	834, // Drednaw
	846, // Arrokuda
	847, // Barraskewda
	882, // Dracovish
	883, // Arctovish
	902, // Basculegion
	963,
	964, //palafin
	976, // veluza
	977, //dondozo
	978,
	493 //arceus
];

const dlcFishList = [
  "North Atlantic right whale",
  "North Pacific right whale",
  "Southern right whale",
  "Bowhead whale",
  "Common minke whale,",
  "Antarctic minke whale",
  "Sei whale",
  "Bryde's whale",
  "Omura's whale",
  "Blue whale",
  "Fin whale",
  "Humpback whale",
  "Pygmy right whale",
  "Gray whale",
  "Sperm whale",
  "Pygmy sperm whale",
  "Dwarf sperm whale",
  "Arnoux's beaked whale",
  "Baird's beaked whale",
  "Sato's beaked whale",
  "Northern bottlenose whale",
  "Southern bottlenose whale",
  "Tropical bottlenose whale",
  "Sowerby's beaked whale",
  "Andrews' beaked whale",
  "Hubbs' beaked whale",
  "Blainville's beaked whale",
  "Gervais' beaked whale",
  "Ginkgo-toothed beaked whale",
  "Gray's beaked whale",
  "Hector's beaked whale",
  "Deraniyagala's beaked whale",
  "Strap-toothed whale",
  "True's beaked whale",
  "Perrin's beaked whale",
  "Pygmy beaked whale",
  "Stejneger's beaked whale",
  "Spade-toothed whale",
  "Shepherd's beaked whale",
  "Cuvier's beaked whale",
  "Ganges river dolphin",
  "Indus river dolphin",
  "Amazon river dolphin",
  "Baiji",
  "La Plata dolphin",
  "Beluga",
  "Narwhal",
  "Dusky dolphin",
  "Pacific white-sided dolphin",
  "Peale's dolphin",
  "Commerson's dolphin",
  "Hourglass dolphin",
  "Chilean dolphin",
  "Heaviside's dolphin",
  "Hector's dolphin",
  "Long-beaked common dolphin",
  "Short-beaked common dolphin",
  "Pygmy killer whale",
  "Short-finned pilot whale",
  "Long-finned pilot whale",
  "Risso's dolphin",
  "Fraser's dolphin",
  "White-beaked dolphin",
  "Atlantic white-sided dolphin",
  "Northern right whale dolphin",
  "Southern right whale dolphin",
  "Irrawaddy dolphin",
  "Australian snubfin dolphin",
  "Orca",
  "Melon-headed whale",
  "False killer whale",
  "Atlantic humpback dolphin",
  "Indo-Pacific humpbacked dolphin",
  "Australian humpback dolphin",
  "Tucuxi",
  "Guiana dolphin",
  "Pantropical spotted dolphin",
  "Clymene dolphin",
  "Striped dolphin",
  "Atlantic spotted dolphin",
  "Spinner dolphin",
  "Rough-toothed dolphin",
  "Indo-Pacific bottlenose dolphin",
  "Common bottlenose dolphin",
  "Indo-Pacific finless porpoise",
  "Narrow-ridged finless porpoise",
  "Spectacled porpoise",
  "Harbour porpoise",
  "Vaquita",
  "Burmeister's porpoise",
  "Dall's porpoise",
  "Amazonian manatee",
  "West Indian manatee",
  "African manatee",
  "Dugong",
  "Steller's sea cow",
  "Brown fur seal",
  "South American fur seal",
  "New Zealand fur seal",
  "Galápagos fur seal",
  "Antarctic fur seal",
  "Juan Fernández fur seal",
  "Guadalupe fur seal",
  "Subantarctic fur seal",
  "Northern fur seal",
  "Steller sea lion",
  "Australian sea lion",
  "South American sea lion",
  "New Zealand sea lion",
  "California sea lion",
  "Japanese sea lion",
  "Galápagos sea lion",
  "Walrus",
  "Hooded seal",
  "Bearded seal",
  "Grey seal",
  "Ribbon seal",
  "Leopard seal",
  "Weddell seal",
  "Crabeater seal",
  "Southern elephant seal",
  "Northern elephant seal",
  "Mediterranean monk seal",
  "Hawaiian monk seal",
  "Caribbean monk seal",
  "Ross seal",
  "Harp seal",
  "Harbor seal",
  "Spotted seal",
  "Ringed seal",
  "Caspian seal",
  "Baikal seal",
  "Polar bear",
  "Sea otter",
  "Marine otter",
  "Sea mink",
  "Megalodon",
  "Plesiosaur",
  "Dunkleosteus",
  "Mosasaurus",
  "Basilosaurus",
  "Helicoprion",
  "Nautilus",
  "Liopleurodon",
  "Pilosaurus",
  "Archelon",
  "Ichthyosauria",
  "Elasmosaurus",
  "Nothosaurus",
  "Dakosaurus",
  "Xiphactinus",
  "Tylosaurus",
  "Trilobite",
  "Lion’s mane jelly",
  "Atolla jelly",
  "Blue jelly",
  "Flower hat jelly",
  "Fried egg jelly",
  "Black sea nettle",
  "Cannonball jelly",
  "Crystal jelly",
  "Portuguese man o’ war",
  "Sea nettle",
  //"Cauliflower jelly",
  "Irukandji jelly",
  "Upside-down jelly",
  "Box jelly",
  "Comb jelly",
  "Cigar jelly",
  "Circular jelly",
  "Peacock mantis shrimp",
  "King crab",
  "Ghost crab",
  "Dungeness crab",
  "Pea crab",
  "Fiddler crab",
  "Japanese spider crab",
  "Spider crab",
  "Mole crab",
  "Snow crab",
  "Chesapeake blue crab",
  "Giant mud crab",
  "Chinese mitten crab",
  "Yeti crab",
  "Florida stone crab",
  "Jonah crab",
  "Tasmanian giant crab",
  "European spider crab",
  "Striped shore crab",
  "Red rock crab",
  "Floral egg crab",
  "Stone crab",
  "Blue crab",
  "Hard shell Maine lobster",
  "Soft shell Maine lobster",
  "Canadian lobster",
  "European lobster",
  "Florida spiny lobster",
  "Norwegian lobster",
  "California spiny lobster",
  "Mediterranean lobster",
  "New Zealand rock lobster",
  "Eastern rock lobster",
  "South African lobster",
  "Tristan lobster",
  "Chinese spiny lobster",
  "Ornate rock lobster",
  "Western rock lobster",
  "Scalloped spiny lobster",
  "Giant tiger prawn",
  "Caridean shrimp",
  "Cherry shrimp",
  "Whiteleg shrimp",
  "White shrimp",
  "Mediterranean red shrimp",
  "Alistado red shrimp",
  "Rock shrimp",
  "Pink shrimp",
  "Tiger shrimp",
  "Chinese white shrimp",
  "Brown shrimp",
  "Atlantic northern shrimp",
  "Spot shrimp",
  "Aesop shrimp",
  "Banana prawn",
  "Blue shrimp",
  "Crayfish"
];

const fishTreasures = [
  { name: "an Infernape Sitting Cutie", imageUrl: `${URL}ape_hat.jpg` },
  { name: "Avo’s Bidoof Hat", imageUrl: `${URL}avo_hat.jpg` },
  { name: "a Basketball Signed by Larry Bird", imageUrl: `${URL}basketball.webp` },
  { name: "a Bowling Ball Signed by Keldaan", imageUrl: `${URL}bowlingball.jpg` },
  { name: "The Ghost of Captain Cutler’s Diving Suit", imageUrl: `${URL}captain_cutler.webp` },
  { name: "a Box of Extra Toasty Cheez-Its", imageUrl: `${URL}cheez.webp` },
  { name: "a Chicken", imageUrl: `${URL}chicken.jpg` },
  { name: "a Gold-Plated Sand Dollar", imageUrl: `${URL}coin.webp` },
  { name: "a DieHard Platinum AGM Car Battery", imageUrl: `${URL}diehard.webp` },
  { name: "27.8 kg of Emeralds", imageUrl: `${URL}emeralds.jpg` },
  { name: "a Life Size Statue of Goku", imageUrl: `${URL}goku.webp` },
  { name: "a 2009 Honda Pilot", imageUrl: `${URL}honda.jpg` },
  { name: "a Triple-Scoop Chocolate Ice Cream Cone", imageUrl: `${URL}ice_choco.jpg` },
  { name: "Davy Jones’ Locker", imageUrl: `${URL}jones.webp` },
  { name: "a Domo Snapback Hat", imageUrl: `${URL}kawaii-hat-236.webp` },
  { name: "the Lego Power Miners Thunder Driller Set", imageUrl: `${URL}lego_set.jpg` },
  { name: "a Copy of Little Big Planet for the PS2", imageUrl: `${URL}little_planet.png` },
  { name: "Nautilus from League of Legends", imageUrl: `${URL}lol_figure.png` },
  { name: "the Entire Mariana Trench", imageUrl: `${URL}mariana_trench.webp` },
  { name: "the Nemo-Mobile", imageUrl: `${URL}nemo_car.jpg` },
  { name: "One Piece Volume 15", imageUrl: `${URL}op_book.jpg` },
  { name: "Pandora’s Box", imageUrl: `${URL}pandora.webp` },
  { name: "a Crown Zenith ETB", imageUrl: `${URL}pokemon_box.jpg` },
  { name: "an Engagement Ring Sandshrew Bought for Eli", imageUrl: `${URL}pokemon_ring.webp` },
  { name: "a Box of Brown Sugar Cinnamon Poptarts", imageUrl: `${URL}poptart.webp` },
  { name: "a Big Rubber Boot", imageUrl: `${URL}rubber_boot.webp` },
  { name: "a Scooby Doo USB Stick", imageUrl: `${URL}scooby_usb.jpg` },
  { name: "a Statue of Cthulu", imageUrl: `${URL}sea_demon.jpg` },
  { name: "a Snowboard with a Shark Eating Pizza on it", imageUrl: `${URL}skate.jpg` },
  { name: "a Copy of Disney’s Extreme Skate Adventure", imageUrl: `${URL}skate_game.jpg` },
  { name: "a Pineapple Shaped House", imageUrl: `${URL}spongebob_house.webp` },
  { name: "a Tire", imageUrl: `${URL}tire.jpg` },
  { name: "the Entire Titanic Ship", imageUrl: `${URL}titanic.webp` },
  { name: "Tort’s Half-Drank Gatorade", imageUrl: `${URL}tort_gatorade.jpg` },
  { name: "Maui’s Hook", imageUrl: `${URL}vaiana.jpg` },
  { name: "a Crisp Washington", imageUrl: `${URL}washington.jpg` },
  { name: "a Crate of Ancient Roman Wine", imageUrl: `${URL}wine_crate.jpg` },
];

module.exports = {
	data: new SlashCommandBuilder()
		.setName('fish')
		.setDescription('me olmec, you fish'),
  
	async execute(interaction: any) {
	await interaction.deferReply();
	
	try {
	
		const isPokemon = Math.random() < 0.005;
		
		if (isPokemon) {
			const pokemonId = pokemonFishIds[Math.floor(Math.random() * pokemonFishIds.length)];
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
			//check treasure
			const isTreasure = Math.random() < TREASURE_RATE;
			if (isTreasure) {
				const treasure = fishTreasures[Math.floor(Math.random() * fishTreasures.length)];
				const randomPrice = Math.floor(Math.random() * 1000000) + 1;
				
				return interaction.editReply({
				content: `Wow a rare treasure!!! You reeled in ${treasure.name}, it is worth $${randomPrice}! <:pog:1416513137536008272>`,
				files: [treasure.imageUrl]
				});
			}
					// dlc check
			const isDLC = Math.random() < DLC_CATCH_RATE;
			const fishArray = isDLC ? dlcFishList : fishList;
			const fish = fishArray[Math.floor(Math.random() * fishArray.length)];
			//const legallyEthically = isDLC ? " legally and ethically" : "";
			
			const searchData = await fetchWikipedia(
				`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(fish)}&format=json`
			) as WikiSearchResult;
			
			if (!searchData.query?.search?.[0]) {
				return interaction.editReply(`You caught a ${fish}, but it got away!`);
			}
			
			const pageId = searchData.query.search[0].pageid;
			const pageData = await fetchWikipedia(
				`https://en.wikipedia.org/w/api.php?action=query&pageids=${pageId}&prop=pageimages&piprop=original|thumbnail&pithumbsize=800&format=json`
			) as WikiPageResult;
			
			const weightRange = getWeightRange(fish);
			const randomWeight = weightRange.max < 1 
			  ? (Math.random() * (weightRange.max - weightRange.min) + weightRange.min).toFixed(1) // small case
			  : Math.floor(Math.random() * (weightRange.max - weightRange.min + 1)) + weightRange.min;
			
			const page = pageData.query.pages[pageId];
			const imageUrl = page.thumbnail?.source || page.original?.source;
			
			if (!imageUrl) {
				return interaction.editReply(`You legally and ethically caught a ${fish}, it weighs ${randomWeight}kg`);
			}

			const fileSize = await getFileSize(imageUrl);
			const MAX_SIZE = 25 * 1024 * 1024; //25mb
			
			if (fileSize > MAX_SIZE) {
				console.log(`img error`);
				return interaction.editReply({
				content: `You legally and ethically caught a ${fish}, it weighs ${randomWeight}kg`,
				});
			}
			
			return interaction.editReply({
				content: `You legally and ethically caught a ${fish}, it weighs ${randomWeight}kg`,
				files: [imageUrl]
			});
		}
		
	} catch (err) {
		console.error(err);
		return interaction.editReply("error fish img fetch");
	}
	}
};

//file size checker
function getFileSize(url: string): Promise<number> {
  return new Promise((resolve, reject) => {
    https.get(url, { method: 'HEAD' }, (res) => {
      const size = parseInt(res.headers['content-length'] || '0', 10);
      resolve(size);
    }).on('error', reject);
  });
}
// Helper function to fetch from Wikipedia API
function fetchWikipedia(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'discord bot - fish command'
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

// Add this helper function alongside your other helper functions
function fetchPokeAPI(url: string): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'discord bot - fish command'
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
// weight range
function getWeightRange(fishName: string): { min: number; max: number } {
  const name = fishName.toLowerCase();
  
  //sharks and whales
  if (name.includes('whale') || 
      name.includes('shark') && (name.includes('great white') || name.includes('basking') || 
      name.includes('whale shark') || name.includes('megalodon'))) {
    return { min: 1000, max: 100000 };
  }
  
  //jmts
  if (name.includes('seal') || 
      name.includes('sea lion') || 
      name.includes('walrus') ||
      name.includes('shark')) {
    return { min: 100, max: 10000 };
  }
  
  //seijas
  if (name.includes('jelly') ||
	  name.includes('shrimp') || 
      name.includes('prawn') || 
      name.includes('crab') && !name.includes('crabby') ||
      name.includes('lobster') && Math.random() < 0.3) { // 30% chance lobsters are small
    return { min: 0.1, max: 0.9 };
  }
  
  //mammal
  if (name.includes('tuna') || 
      name.includes('marlin') || 
      name.includes('swordfish') ||
      name.includes('sturgeon') ||
      name.includes('otter') ||
      name.includes('dolphin') ||
      name.includes('porpoise')) {
    return { min: 100, max: 1000 };
  }
  //fossils
  if (name.includes('megalodon') || 
      name.includes('mosasaurus') || 
      name.includes('plesiosaur') ||
      name.includes('dunkleosteus') ||
      name.includes('basilosaurus') ||
      name.includes('liopleurodon')) {
    return { min: 90000, max: 100000 };
  }
  
  return { min: 1, max: 100 };
}
