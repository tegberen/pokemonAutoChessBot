import { 
  SlashCommandBuilder, 
  CommandInteraction, 
  GuildMember 
} from 'discord.js';

// Store active focus sessions with start time
const activeFocusSessions = new Map<string, { timeout: NodeJS.Timeout; startTime: number }>();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('focus')
    .setDescription('Focus commands')
    .addSubcommand(subcommand =>
      subcommand
        .setName('start')
        .setDescription('Start a 90 minute focus session')
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('check')
        .setDescription('Check your current focus session status')
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('activity')
        .setDescription('View your focus activity statistics')
    ),
  
  async execute(interaction: CommandInteraction) {
    const subcommand = interaction.options.data[0]?.name;

    if (subcommand === 'status') {
      return handleStatus(interaction);
    }

    if (subcommand === 'check') {
      return handleStart(interaction);
    }

    if (subcommand === 'activity') {
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
      content: 'No active focus session.', 
      ephemeral: true 
    });
  }

  const elapsed = Date.now() - session.startTime;
  const remaining = (90 * 60 * 1000) - elapsed;
  const minutesLeft = Math.ceil(remaining / 60000);

  return interaction.reply({ 
    content: `Focus session active. ${minutesLeft} minutes remaining.`, 
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
      content: 'You already have an active focus session.', 
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
      content: `Focus mode activated for 90 minutes. You cannot interact on the server.`,
      ephemeral: false 
    });

    const timeout = setTimeout(async () => {
      try {
        await member.roles.remove(timeoutRole);

        // Import dynamically to avoid circular deps
        const { saveFocusSession } = require('../services/focusService');
        await saveFocusSession(userId, 90);

        const channel = interaction.channel;
        if (channel && channel.isTextBased()) {
          await channel.send(
            `<@${userId}> Focus session complete. 90 minutes focused.`
          );
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
    }, 1 * 60 * 1000);

    activeFocusSessions.set(sessionKey, { 
      timeout, 
      startTime: Date.now() 
    });

  } catch (error) {
    console.error('Error starting focus session:', error);
    return interaction.reply({ 
      content: 'Failed to start focus session.', 
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
      return interaction.editReply('No focus sessions yet.');
    }

    const totalHours = (stats.totalMinutes / 60).toFixed(1);
    
    return interaction.editReply(
      `Focus Statistics\n` +
      `Sessions completed: ${stats.sessionCount}\n` +
      `Total hours focused: ${totalHours}`
    );
    
  } catch (error) {
    console.error('Error:', error);
    return interaction.editReply('Error loading focus stats.');
  }
}