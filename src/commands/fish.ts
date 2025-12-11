const { SlashCommandBuilder } = require('discord.js');
const https = require('https');
import { savePokemonCatch } from '../services/pokemonService';
// const
const DLC_CATCH_RATE = 0.4;
const TREASURE_RATE = 0.025;

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
  { name: "a Crate of Ancient Roman Wine", imageUrl: "https://media.discordapp.net/attachments/1448588895234297998/1448589124746346558/wine-crate_orig.jpg?ex=693bcf40&is=693a7dc0&hm=a2d6f0dcac40f3003d9552a9e19b438280be953f7d7492158ee912245d83357b&=&format=webp&width=413&height=275" },
  { name: "the Entire Titanic Ship", imageUrl: "https://media.discordapp.net/attachments/1448588895234297998/1448589123710484532/titanic22.webp?ex=693bcf40&is=693a7dc0&hm=e1655ae4ba628294e0f185c32a05364c9133cfa8f7877d3cb3bb7eed6fc4bdc9&=&format=webp&width=1461&height=822" },
  { name: "a Copy of Disney’s Extreme Skate Adventure", imageUrl: "https://media.discordapp.net/attachments/1448588895234297998/1448589350454689865/71BiSy-BcSL._AC_UF10001000_QL80_.jpg?ex=693bcf76&is=693a7df6&hm=786b13171a62a99d37700432de5fd02a38e3d34e1560a0022fe8d0ff92b49cec&=&format=webp&width=1461&height=1461" },
  { name: "Pandora’s Box", imageUrl: "https://media.discordapp.net/attachments/1448588895234297998/1448589121114345494/Pandora27s_Box_28God_of_War29.webp?ex=693bcf3f&is=693a7dbf&hm=da684f22239d2ef0096373e177ca39b36751b1f8dc8601d05889a6fe4dd2f746&=&format=webp&width=750&height=495" },
  { name: "a Big Rubber Boot", imageUrl: "https://media.discordapp.net/attachments/1448588895234297998/1448589260692389963/L1110724.webp?ex=693bcf61&is=693a7de1&hm=788fbdd784607ea2624707f1fbf266ec7fd9d65533ca2466adb9489ebdf05e37&=&format=webp&width=1233&height=1641" },
  { name: "a Tire", imageUrl: "https://media.discordapp.net/attachments/1448588895234297998/1448589261522866176/montreal-eco-2-rightwhole-tiresDetailsFormat.jpg?ex=693bcf61&is=693a7de1&hm=ef3d8712386740bc39b63cab8cadbc878e0014c4aff08a071c03b89d9bcba9f9&=&format=webp&width=750&height=750" },
  { name: "Tort’s Half-Drank Gatorade", imageUrl: "https://media.discordapp.net/attachments/1448588895234297998/1448589310776315986/e74a6ecc4918a57d2d4edb10d9724d66_400x400.jpg?ex=693bcf6d&is=693a7ded&hm=a05cb18f0bef0d6ac485f6b565cac669c30569f2700b5a7b0a11645da0cbb939&=&format=webp&width=600&height=600" },
  { name: "Avo’s Bidoof Hat", imageUrl: "https://media.discordapp.net/attachments/1448588895234297998/1448589261807812701/P7818_741-09890_02.jpg?ex=693bcf61&is=693a7de1&hm=3f04178f3fd4812ae9893b0d2f6781aaa15dbede3c40e13ecb3c5bcf8fbc2bd6&=&format=webp&width=1461&height=1461" },
  { name: "the Lego Power Miners Thunder Driller Set", imageUrl: "https://media.discordapp.net/attachments/1448588895234297998/1448589350806753331/71nigMskvL._AC_UF8941000_QL80_.jpg?ex=693bcf76&is=693a7df6&hm=fb90ce1b4f645798ba1d6f71e0961e15e16426c91bd16eaa7cd1a63a9db395cb&=&format=webp&width=1341&height=1103" },
  { name: "a Basketball Signed by Larry Bird", imageUrl: "https://media.discordapp.net/attachments/1448588895234297998/1448589121495892010/PBA-007464.webp?ex=693bcf40&is=693a7dc0&hm=aeb778321caab3d012450fa75ac26a8d0c1f355db6dd388a7753d40e22de7203&=&format=webp&width=750&height=750" },
  { name: "a Statue of Cthulu", imageUrl: "https://media.discordapp.net/attachments/1448588895234297998/1448589258473603072/idol-verde-.jpg?ex=693bcf60&is=693a7de0&hm=e0edcfc817ee25c32eee3d1519a2cbdcfb0c2f3f5f511a14552c1be4bac5841e&=&format=webp&width=1230&height=1640" },
  { name: "The Ghost of Captain Cutler’s Diving Suit", imageUrl: "https://media.discordapp.net/attachments/1448588895234297998/1448589256732966975/Ghost_of_Captain_Cutler_2.webp?ex=693bcf60&is=693a7de0&hm=47542de922481be1cdefaa608c72ff3ba9cae2e4e37709e6b7b58c36cf02c600&=&format=webp&width=540&height=1017" },
  { name: "a Crown Zenith ETB", imageUrl: "https://media.discordapp.net/attachments/1448588895234297998/1448589351423442954/81Z56bb4QwL.jpg?ex=693bcf76&is=693a7df6&hm=b39209d46c87c45a20c06a212422d45b818bd8262364bf130a5479904cb42650&=&format=webp&width=1461&height=1397" },
  { name: "Nautilus from League of Legends", imageUrl: "https://media.discordapp.net/attachments/1448588895234297998/1448589351805128817/357px-Nautilus_Render.png?ex=693bcf76&is=693a7df6&hm=3bb02ddb061ccb0ba70279164f2c7ff46920095af1292aad05a2e380415d9ae4&=&format=webp&quality=lossless&width=536&height=749" },
  { name: "a Triple-Scoop Chocolate Ice Cream Cone", imageUrl: "https://media.discordapp.net/attachments/1448588895234297998/1448589349397463072/8e310165-3980-44c1-8c31-4b75160726a6_570.jpg?ex=693bcf76&is=693a7df6&hm=321429767f343db6cb796b6e5342005392718c1540a4ddb6fdd3c530eadb3575&=&format=webp&width=398&height=855" },
  { name: "a Scooby Doo USB Stick", imageUrl: "https://media.discordapp.net/attachments/1448588895234297998/1448589121818722374/pen-drive-16gb-emtec-hb106-scooby-doo-usb-20-ecmmd16ghb106-ecmmd16ghb106_99208898_1200x630.jpg?ex=693bcf40&is=693a7dc0&hm=467451d392f5b8c0c410aa0abc8b0cd650b287ab5f28ff20a0140443d3a4d70a&=&format=webp&width=1461&height=767" },
  { name: "a 2009 Honda Pilot", imageUrl: "https://media.discordapp.net/attachments/1448588895234297998/1448589306993180814/2009_honda_pilot_angularfront.jpg?ex=693bcf6c&is=693a7dec&hm=f3fec64305a2496b58b0da0ba93fe5f8715d0bebbeb3e82c3676fe11f994e1e3&=&format=webp&width=960&height=720" },
  { name: "a Bowling Ball Signed by Keldaan", imageUrl: "https://media.discordapp.net/attachments/1448588895234297998/1448589122850521180/s-l400.jpg?ex=693bcf40&is=693a7dc0&hm=a1f5202e0cf98cc650c0867ea55c0d93488e8499171d91456278f8589fd5ee6c&=&format=webp&width=600&height=450" },
  { name: "the Entire Mariana Trench", imageUrl: "https://media.discordapp.net/attachments/1448588895234297998/1448589261153636472/marianatrench002-1.webp?ex=693bcf61&is=693a7de1&hm=87ae803038a6ee4593ec25ad759aad2220b03f068cc102bc84c9f5a34c0d2f74&=&format=webp&width=1461&height=1311" },
  { name: "an Infernape Sitting Cutie", imageUrl: "https://media.discordapp.net/attachments/1448588895234297998/1448589349905240116/61vlNVhFxQL._AC_UF8941000_QL80_.jpg?ex=693bcf76&is=693a7df6&hm=2430a1e21eb08cb610593c388b6e4eb5c206466ae2640ab0683dec4b5238b7d4&=&format=webp&width=1341&height=1487" },
  { name: "a Snowboard with a Shark Eating Pizza on it", imageUrl: "https://media.discordapp.net/attachments/1448588895234297998/1448589307408547956/2016-K2-World-Wide-WEapon-Snowboard.jpg?ex=693bcf6c&is=693a7dec&hm=8dfaee19c8ae0c9dde8737e8919a2f3e558a8ffe5455c6973349ea16ecd5ef3b&=&format=webp&width=1163&height=600" },
  { name: "27.8 kg of Emeralds", imageUrl: "https://media.discordapp.net/attachments/1448588895234297998/1448589259413127309/images.jpg?ex=693bcf60&is=693a7de0&hm=28b218ae356ab90d2fd76e9adc0884d4f5678e9d9e7e125d27c09f6db779a73c&=&format=webp&width=360&height=315" },
  { name: "a 12-Pack of Command Strips", imageUrl: "https://media.discordapp.net/attachments/1448588895234297998/1448589311573364788/fb38cdfd-8777-45d2-83d5-cda5e99fd612.avif?ex=693bcf6d&is=693a7ded&hm=fb2e110dbc5567a91cdfb9da1f0e6cd6837e7fb068105f2ec427056928c8800c&=&format=webp&quality=lossless&width=1461&height=1461" },
  { name: "a Copy of Little Big Planet for the PS2", imageUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAgCAYAAAD5VeO1AAAMRklEQVR4AQBdAKL/AHCFhf9whYT/cYWE/3GEhP9yhIT/c4OD/3SCg/91gYP/doGD/3eAgv94gIL/eH+C/3h/gv94f4L/eH+D/3eAg/93gIP/doCD/3WBhP90gYT/dIGE/3OChP9zgoX/AF0Aov8AcIWE/3CFhP9xhYT/cYSE/3KEhP9zg4P/dIKD/3WBg/92gYL/d4CC/3iAgv94f4L/eH+C/3h/gv94f4L/d4CC/3eAg/92gIP/dYGD/3WBhP90gYT/dIKE/3OChP8AXQCi/wBwhYT/cIWE/3GFhP9yhIP/c4SD/3SDg/91goL/doGC/3eBgv94gIL/eICB/3h/gf95f4H/eH+B/3h/gv94gIL/d4CC/3aAg/92gYP/dYGD/3SBg/90goP/dIKE/wBdAKL/AHGFg/9xhYP/cYWD/3KEg/9zg4L/dIOC/3WCgv92gYH/d4GB/3iAgf95gIH/eX+B/3l/gf95f4H/eX+B/3h/gf93gIH/d4CC/3aAgv91gYL/dYGC/3SBg/90goP/AF0Aov8AcYWC/3GFgv9yhYL/c4SC/3SDgv91g4H/doKB/3eBgP94gID/eYCA/3l/gP96f4D/en+A/3p/gP95f4D/eX+A/3iAgP93gID/d4CB/3aBgf92gYH/dYGB/3WBgf8AXQCi/wByhYH/coWB/3OEgf9zhIH/dIOB/3WCgP92goD/eIF//3iAf/95gH//en9+/3p/fv96f37/en9+/3p/fv96f3//eX9//3iAf/94gH//d4CA/3aBgP92gYD/doGA/wBdAKL/AHOFgP9zhYD/dISA/3SEgP91g3//doJ//3eCfv94gX7/eYB+/3p/ff97f33/e399/3t+ff97fn3/e399/3p/ff96f33/eX99/3iAfv94gH7/d4F+/3eBfv93gX7/AF0Aov8AdIR//3SEf/90hH//dYN+/3aDfv93gn3/eIF9/3mAff96gHz/e398/3x/e/98fnv/fH57/3x+e/98fnv/fH57/3t/e/96f3z/en98/3mAfP94gHz/eIB8/3iBfP8AXQCi/wB1hH3/dYR9/3aEff92g33/d4J8/3iCfP95gXv/eoB7/3t/ev98f3r/fX56/31+ef9+fnn/fX55/31+ef99fnn/fH55/3t/ef97f3r/en96/3qAev95gHr/eYB6/wBdAKL/AHaEfP92hHz/d4N8/3iDe/94gnv/eoF6/3uBev98gHn/fX95/35+eP9+fnj/f353/399d/9/fXf/fn13/35+d/99fnf/fX53/3x/d/97f3f/e394/3p/eP96gHj/AF0Aov8Ad4N6/3eDev94g3r/eYJ6/3qCef97gXn/fIB4/31/d/9+f3f/f352/4B9dv+AfXX/gH11/4B9df+AfXX/f311/399df9+fnX/fX51/31+df98f3X/fH91/3x/df8AXQCi/wB5g3n/eYN4/3mCeP96gnj/e4F3/3yAd/99gHb/fn91/39+df+AfXT/gX10/4F8c/+CfHP/gnxz/4F8cv+BfHL/gH1y/4B9cv9/fXL/fn5y/35+c/99fnP/fX5z/wBdAKL/AHqCd/96gnf/e4J2/3yBdv99gHX/foB1/39/dP+AfnP/gX1z/4J9cv+CfHL/g3xx/4N8cf+DfHD/g3xw/4J8cP+CfHD/gXxw/4F9cP+AfXD/f31w/39+cP9/fnD/AF0Aov8Ae4J1/3yBdf98gXX/fYB0/36AdP9/f3P/gH5y/4F9cf+CfXH/g3xw/4R8b/+Fe2//hXtu/4V7bv+Fe27/hHtt/4R7bf+DfG3/gnxt/4J8bf+BfW3/gX1t/4F9bf8AXQCi/wB9gXP/fYFz/36Ac/9/gHL/gH9y/4F+cf+CfnD/g31v/4R8b/+Fe27/hntt/4Z6bP+Gemz/hnpr/4Z6a/+Gemv/hXpr/4V7av+Ee2r/g3tq/4N8av+DfGr/gnxq/wBdAKL/AH+Acf9/gHH/f4Bx/4B/cP+BfnD/gn5v/4R9bv+FfG3/hntt/4d6bP+Hemv/iHlq/4h5av+IeWn/iHlp/4h5aP+Hemj/hnpo/4Z6aP+Fe2j/hXto/4R7aP+Ee2j/AF0Aov8AgH9w/4F/cP+Bf2//gn5v/4N9bv+EfW3/hXxs/4Z7a/+Hemv/iHpq/4l5af+KeWj/inhn/4p4Z/+KeGb/iXhm/4l5Zf+IeWX/iHll/4d6Zf+GemX/hnpl/4Z6Zf8AXQCi/wCCfm7/gn5u/4N+bv+DfW3/hH1s/4Z8a/+He2r/iHpq/4l5af+KeWj/i3hn/4t4Zv+Md2X/jHdk/4t3ZP+Ld2P/i3hj/4p4Y/+JeGL/iXhi/4h5Yv+IeWL/iHli/wBdAKL/AIN9bP+EfWz/hH1s/4V8a/+GfGv/h3tq/4h6af+KeWj/i3hn/4x4Zv+Md2X/jXdk/412Y/+NdmL/jXZh/412Yf+MdmH/jHdg/4t3YP+Ld2D/inhg/4p4YP+KeGD/AF0Aov8AhXxr/4V8a/+GfGr/h3tq/4h7af+Jemj/inln/4t4Zv+Md2X/jXdk/452Y/+PdmL/j3Vh/491YP+PdV//jnVf/451Xv+Ndl7/jXZe/4x2Xf+Md13/i3dd/4t3Xf8AXQCi/wCGe2r/h3tp/4d7af+Iemj/iXpn/4p5Zv+MeGX/jXdk/452Y/+PdmL/kHVh/5B0YP+RdF//kXRe/5B0Xf+QdF3/kHRc/491XP+PdVv/jnVb/411W/+Ndlv/jXZb/wBdAKL/AIh6aP+Iemj/iXpo/4p5Z/+LeWb/jHhl/413ZP+OdmP/j3Vi/5B0YP+RdF//knNe/5JzXf+Sc1z/knNb/5JzW/+Rc1r/kXNa/5B0Wf+QdFn/j3RZ/491Wf+PdVj/AF0Aov8AiXln/4p5Z/+KeWb/i3hm/4x4Zf+Nd2T/jnZj/5B1Yf+RdGD/knNf/5NzXv+Tclz/lHJb/5RyWv+Ucln/k3JZ/5NyWP+Sclj/knNX/5FzV/+Rc1f/kHNW/5B0Vv8AXQCi/wCLeWb/i3hm/4x4Zf+Md2T/jXdk/492Yv+QdWH/kXRg/5JzX/+Tcl3/lHJc/5VxW/+VcVr/lXFZ/5VxWP+VcVf/lHFW/5RxVv+TclX/k3JV/5JyVf+SclX/knJV/wBdAKL/AIx4Zf+Md2X/jXdk/452Y/+PdmP/kHVh/5F0YP+Sc1//k3Je/5RyXP+VcVv/lnBa/5ZwWP+WcFf/lnBW/5ZwVf+WcFX/lXBU/5RxVP+UcVP/k3FT/5NxU/+TcVP/AF0Aov8AjXdk/413ZP+OdmP/j3Zj/5B1Yv+RdGD/knNf/5NyXv+VcVz/lnFb/5ZwWv+XcFj/l29X/5hvVv+Xb1X/l29U/5dvU/+Wb1P/lnBS/5VwUv+VcFL/lHBR/5RxUf8AXQCi/wCOdmP/jnZj/491Y/+QdWL/kXRh/5JzYP+Tcl7/lHJd/5ZxXP+XcFr/l29Z/5hvV/+Yblb/mW5V/5huVP+YblP/mG5S/5dvUf+Xb1H/lm9R/5ZvUP+VcFD/lXBQ/wBdAKL/AI91Y/+PdWL/kHVi/5B0Yf+Rc2D/k3Nf/5RyXv+VcVz/lnBb/5dvWf+Yb1j/mW5W/5luVf+ZblT/mW1T/5luUv+ZblH/mG5Q/5huUP+Xb1D/l29P/5ZvT/+Wb0//AF0Aov8Aj3Vi/5B1Yv+QdGH/kXRh/5JzYP+Tcl7/lXFd/5ZwXP+Xb1r/mG9Z/5luV/+ablb/mm1U/5ptU/+abVL/mm1R/5ltUP+ZbVD/mG5P/5huT/+Xbk7/l25O/5duTv8AXQCi/wCQdWL/kHRi/5F0Yf+Sc2D/k3Nf/5RyXv+VcV3/lnBb/5hvWv+Zblj/mW5X/5ptVf+abVT/m21T/5tsUv+abVH/mm1Q/5ltT/+ZbU7/mG1O/5huTv+Ybk3/l25N/wBdAKL/AJB0Yv+QdGH/kXRh/5JzYP+Tcl//lHFe/5VxXP+XcFv/mG9Z/5luWP+abVb/mm1V/5tsVP+bbFL/m2xR/5tsUP+abE//mm1P/5ltTv+ZbU7/mG1N/5huTf+Ybk3/AV0Aov8AkHRh/5F0Yf+Rc2H/knNg/5NyX/+UcV7/lnBc/5dwW/+Yb1n/mW5Y/5ptVv+bbVX/m2xT/5tsUv+bbFH/m2xQ/5psT/+abE7/mW1O/5ltTf+YbU3/mG1N/5huTf8L8PBzYcCQBwAAAABJRU5ErkJggg==" },
  { name: "a Domo Snapback Hat", imageUrl: "https://media.discordapp.net/attachments/1448588895234297998/1448589260134551656/kawaii-hat-236.webp?ex=693bcf61&is=693a7de1&hm=8987ad3bef40595f9bae52dd825277e89aee182072c92ceb9d6360a19fbd55c0&=&format=webp&width=1200&height=1200" },
  { name: "Maui’s Hook", imageUrl: "https://media.discordapp.net/attachments/1448588895234297998/1448589308607856670/1714037920285.jpg?ex=693bcf6c&is=693a7dec&hm=da673fb48899d4620a28f039dc891cbec5f89bfd35bf577665b2844b7a2780fd&=&format=webp&width=1461&height=1461" },
  { name: "the Nemo-Mobile", imageUrl: "https://media.discordapp.net/attachments/1448588895234297998/1448589124096491651/tumblr_0c80d091931f4ec0fc43cbafba11f77a_4b498ff5_1280.jpg?ex=693bcf40&is=693a7dc0&hm=c449fe851587cc2e83620b91a94fde33ce2abc4d13258a0a8b520d79483befd9&=&format=webp&width=1461&height=1002" },
  { name: "a Pineapple Shaped House", imageUrl: "https://media.discordapp.net/attachments/1448588895234297998/1448589123337326653/SpongeBob27s_house.webp?ex=693bcf40&is=693a7dc0&hm=0013cc40e0df67ce3449ba62d99d7ee1fd14797a4c6e3508f643f8ceff59d3f1&=&format=webp&width=890&height=1466" },
  { name: "Davy Jone’s Locker", imageUrl: "https://media.discordapp.net/attachments/1448588895234297998/1448589309530865725/Born_Again_Krabs_060.webp?ex=693bcf6c&is=693a7dec&hm=5e677a15511fa73ace57dacb099cc360c7edb252d83886c78af0a9be1683e8e4&=&format=webp&width=1461&height=1109" },
  { name: "a Gold-Plated Sand Dollar", imageUrl: "https://media.discordapp.net/attachments/1448588895234297998/1448589258951622820/il_570xN.6246037963_rh6j.webp?ex=693bcf60&is=693a7de0&hm=c321a31bbcb16413632318ce7ee52e077e82b0d57f1ace524baacc73ac19c82e&=&format=webp&width=855&height=855" },
  { name: "a DieHard Platinum AGM Car Battery", imageUrl: "https://media.discordapp.net/attachments/1448588895234297998/1448589308285026454/10210828_gmp_h8agm_pri_larg.webp?ex=693bcf6c&is=693a7dec&hm=14c3d07237e01d498fa196cc2f1b112cbd7aedb489e0aa44eaaa743d01a8fcde&=&format=webp&width=675&height=675" },
  { name: "a Box of Extra Toasty Cheez-Its", imageUrl: "https://media.discordapp.net/attachments/1448588895234297998/1448589310449422386/c8ab3521-8266-46b2-b503-d572adc45b94.7900ef7d034e6676853b0f75d7a9dd93.webp?ex=693bcf6d&is=693a7ded&hm=97f4b8510485c09855de5467328a4b55a7ae319f5cbf1f19e51cdee127b68863&=&format=webp&width=1461&height=1461" },
  { name: "a Box of Brown Sugar Cinnamon Poptarts", imageUrl: "https://media.discordapp.net/attachments/1448588895234297998/1448589307958005832/553054f0-a582-4ca0-8a23-a4538d6188d5.7451ee3ba66a985a0c8a97a6c5eb1531.webp?ex=693bcf6c&is=693a7dec&hm=ee2ff1ecf10012c91174553a520d9d9a16c5694ea609ac1f007c3e9b81097610&=&format=webp&width=1152&height=1152" },
  { name: "an Engagement Ring Sandshrew Bought for Eli", imageUrl: "https://media.discordapp.net/attachments/1448588895234297998/1448589122431221760/pokemon1.967_1200x1200.webp?ex=693bcf40&is=693a7dc0&hm=1c22890398c0b47278a4d933e2ab45a10f3d14229ca43906de53ca92e24740ab&=&format=webp&width=1461&height=1461" },
  { name: "One Piece Volume 15", imageUrl: "https://media.discordapp.net/attachments/1448588895234297998/1448589352237269088/918fTISIcBL._AC_UF10001000_QL80_.jpg?ex=693bcf77&is=693a7df7&hm=8292c19451823dba6bec4a4ae9516d6dbbb7d5dcf3dce94efcd079e5f18751cc&=&format=webp&width=998&height=1500" },
  { name: "a Life Size Statue of Goku", imageUrl: "data:image/png;base64,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" },
  { name: "a Crisp Washington", imageUrl: "https://media.discordapp.net/attachments/1448588895234297998/1448589124440166461/US_one_dollar_bill_obverse_series_2009.jpg?ex=693bcf40&is=693a7dc0&hm=7820e9474efab8218ae9a96eb2efe9febfc65ef5fd43ee3a659fb9e047090ebb&=&format=webp&width=1461&height=624"},
]
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
