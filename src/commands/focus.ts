import { 
  SlashCommandBuilder, 
  CommandInteraction, 
  GuildMember 
} from 'discord.js';
import https from 'https';

interface PokeAPIResponse {
  name: string;
  weight: number;
  sprites: {
    other: {
      'official-artwork': {
        front_default: string | null;
		front_shiny: string | null;
      };
    };
  };
}

// Store active focus sessions with start time
const activeFocusSessions = new Map<string, { timeout: NodeJS.Timeout; startTime: number }>();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('focus')
    .setDescription('Focus commands')
    .addSubcommand(subcommand =>
      subcommand
        .setName('start')
        .setDescription('Time yourself out from all channels for 90min!')
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('end')
        .setDescription('End your time-out session early')
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('status')
        .setDescription('Shows remaining minutes of the time-out.')
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('stats')
        .setDescription('View your block statistics')
    ),
  
  async execute(interaction: CommandInteraction) {
    const subcommand = interaction.options.data[0]?.name;

    if (subcommand === 'status') {
      return handleStatus(interaction);
    }

    if (subcommand === 'start') {
      return handleStart(interaction);
    }

    if (subcommand === 'end') {
      return handleEnd(interaction);
    }

    if (subcommand === 'stats') {
      return handleStats(interaction);
    }
  }
};

async function handleStatus(interaction: CommandInteraction) {
  const userId = interaction.user.id;
  const guildId = interaction.guild?.id;
  const sessionKey = `${guildId}-${userId}`;

  const session = activeFocusSessions.get(sessionKey);

  if (!session) {
    return interaction.reply({ 
      content: 'No active block.', 
      ephemeral: true 
    });
  }

  const elapsed = Date.now() - session.startTime;
  const remaining = (90 * 60 * 1000) - elapsed;
  const minutesLeft = Math.ceil(remaining / 60000);

  return interaction.reply({ 
    content: `Time-out active. ${minutesLeft} minutes remaining.`, 
    ephemeral: true 
  });
}

async function handleStart(interaction: CommandInteraction) {
  if (!interaction.guild || !interaction.member) {
    return interaction.reply({ 
      content: 'This command can only be used in a server.', 
      ephemeral: true 
    });
  }

  const member = interaction.member as GuildMember;
  const userId = interaction.user.id;
  const guildId = interaction.guild.id;
  const sessionKey = `${guildId}-${userId}`;

  if (activeFocusSessions.has(sessionKey)) {
    return interaction.reply({ 
      content: 'You already have an active block.', 
      ephemeral: true 
    });
  }

  const timeoutRole = interaction.guild.roles.cache.find(
    role => role.name === 'Focus Mode'
  );

  if (!timeoutRole) {
    return interaction.reply({ 
      content: 'The Focus Mode role is not set up. Contact an administrator.', 
      ephemeral: true 
    });
  }

  try {
    await member.roles.add(timeoutRole);

    await interaction.reply({ 
      content: `Block activated for 90 minutes. You cannot interact on the server.`,
      ephemeral: false 
    });

    const timeout = setTimeout(async () => {
      try {
        await member.roles.remove(timeoutRole);

        // Import dynamically to avoid circular deps
        const { saveFocusSession } = require('../services/focusService');
        await saveFocusSession(userId, 90);

        const randomPokemonId = Math.floor(Math.random() * 1025) + 1;
        const isShiny = Math.random() < (1 / 20);

        let sightingMessage = `<@${userId}> You can interact on the server again!\n`;

        try {
          const pokeData = await fetchPokeAPI(`https://pokeapi.co/api/v2/pokemon/${randomPokemonId}`) as PokeAPIResponse;
          const pokemonName = pokeData.name.charAt(0).toUpperCase() + pokeData.name.slice(1);
          const weight = pokeData.weight / 10; // converts to kg

          if (isShiny) {
            const imageUrl = pokeData.sprites.other['official-artwork'].front_shiny;

            sightingMessage += `Oh! You sighted a shiny ${pokemonName}! It was added to your collection. Weight: ${weight}kg`;

            if (imageUrl) {
              sightingMessage += `\n${imageUrl}`;
            }

            try {
              const { savePokemonCatch } = require('../services/pokemonService');
              await savePokemonCatch(userId, {
                pokemonId: randomPokemonId,
                pokemonName,
                weight,
                imageUrl,
                caughtAt: new Date()
              });
            } catch (dbError) {
              console.error('Failed to save shiny Pokémon:', dbError);
              sightingMessage += ' (Failed to save to collection)';
            }
          } else {
            const imageUrl = pokeData.sprites.other['official-artwork'].front_default;
            
            sightingMessage += `Oh! You sighted a ${pokemonName}. Too bad it's not shiny ... not worth collecting. Weight: ${weight}kg`;
            
            if (imageUrl) {
              sightingMessage += `\n${imageUrl}`;
            }
          }
        } catch (pokeError) {
          console.error('Failed to fetch Pokémon data:', pokeError);
          sightingMessage += `Oh! You sighted a Pokémon...but it got away!`;
        }

        const channel = interaction.channel;
        if (channel && channel.isTextBased()) {
          await channel.send(sightingMessage);
        }

        activeFocusSessions.delete(sessionKey);
      } catch (error) {
        console.error('Error completing focus session:', error);
        
        try {
          await member.roles.remove(timeoutRole);
        } catch (roleError) {
          console.error('Error removing focus role:', roleError);
        }
        
        activeFocusSessions.delete(sessionKey);
      }
    }, 90 * 60 * 1000);

    activeFocusSessions.set(sessionKey, { 
      timeout, 
      startTime: Date.now() 
    });

  } catch (error) {
    console.error('Error starting focus session:', error);
    return interaction.reply({ 
      content: 'Failed to start block.', 
      ephemeral: true 
    });
  }
}

async function handleEnd(interaction: CommandInteraction) {
  if (!interaction.guild || !interaction.member) {
    return interaction.reply({ 
      content: 'This command can only be used in a server.', 
      ephemeral: true 
    });
  }

  const member = interaction.member as GuildMember;
  const userId = interaction.user.id;
  const guildId = interaction.guild.id;
  const sessionKey = `${guildId}-${userId}`;

  const session = activeFocusSessions.get(sessionKey);

  if (!session) {
    return interaction.reply({ 
      content: 'No active block to end.', 
      ephemeral: true 
    });
  }

  const timeoutRole = interaction.guild.roles.cache.find(
    role => role.name === 'Focus Mode'
  );

  if (!timeoutRole) {
    return interaction.reply({ 
      content: 'The Focus Mode role is not set up. Contact an administrator.', 
      ephemeral: true 
    });
  }

  try {
    clearTimeout(session.timeout);
    await member.roles.remove(timeoutRole);

    // Calculate actual time focused
    const elapsed = Date.now() - session.startTime;
    const minutesFocused = Math.floor(elapsed / 60000);

    // Save the partial session
    const { saveFocusSession } = require('../services/focusService');
    await saveFocusSession(userId, minutesFocused);

    // Remove from active sessions
    activeFocusSessions.delete(sessionKey);

    return interaction.reply({ 
      content: `Block ended. You timed yourself out for ${minutesFocused} minutes.`,
      ephemeral: false 
    });

  } catch (error) {
    console.error('Error ending focus session:', error);
    return interaction.reply({ 
      content: 'Failed to end focus session.', 
      ephemeral: true 
    });
  }
}

async function handleStats(interaction: CommandInteraction) {
  await interaction.deferReply();
  
  try {
    const { getFocusStats } = require('../services/focusService');
    const stats = await getFocusStats(interaction.user.id);
    
    if (!stats) {
      return interaction.editReply('No blocks yet.');
    }

    const totalHours = (stats.totalMinutes / 60).toFixed(1);
    
    return interaction.editReply(
      `Statistics\n` +
      `Sessions completed: ${stats.sessionCount}\n` +
      `Total hours timed-out: ${totalHours}`
    );
    
  } catch (error) {
    console.error('Error:', error);
    return interaction.editReply('Error loading focus stats.');
  }
}

function fetchPokeAPI(url: string): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'discord bot - focus command'
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