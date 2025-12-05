const { SlashCommandBuilder } = require('discord.js');
const https = require('https');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('testfish')
    .setDescription('testfish command'),
  
  async execute(interaction) {
    const fishList = [
      "Great white shark",
      "Clownfish",
      "Blue tang",
      "Goldfish",
      "Betta fish",
      "Guppy",
      "Angelfish",
      "Swordfish",
      "Tuna",
      "Salmon",
      "Manta ray",
      "Hammerhead shark",
      "Seahorse",
      "Pufferfish",
      "Lionfish"
    ];
    
    const fish = fishList[Math.floor(Math.random() * fishList.length)];
    await interaction.deferReply();
    
    try {
      const searchData = await fetchWikipedia(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(fish)}&format=json`);
      
      if (!searchData.query?.search?.[0]) {
        return interaction.editReply(`dont have the fish`);
      }
      
      const pageId = searchData.query.search[0].pageid;
      const pageData = await fetchWikipedia(`https://en.wikipedia.org/w/api.php?action=query&pageids=${pageId}&prop=pageimages&piprop=original&format=json`);
      
      const imageUrl = pageData.query.pages[pageId].original?.source;
      
      if (!imageUrl) {
        return interaction.editReply(`dont have the fish img`);
      }
      
      return interaction.editReply({
        content: `You caught a ${fish}.`,
        files: [imageUrl]
      });
      
    } catch (err) {
      console.error(err);
      return interaction.editReply("error fish img fetch");
    }
  },
};

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
