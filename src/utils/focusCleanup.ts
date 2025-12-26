import { Client, Guild } from 'discord.js';

/**
 * Cleanup function to remove Focus Mode role from all users on bot startup
 * This prevents users from being stuck in focus mode if the bot restarts
 */
export async function cleanupFocusModeSessions(client: Client): Promise<void> {
  console.log('Cleaning up Focus Mode sessions from bot restart...');
  
  try {
    const guilds = client.guilds.cache;
    
    for (const [guildId, guild] of guilds) {
      await cleanupGuildFocusSessions(guild);
    }
    
    console.log('Focus Mode cleanup complete.');
  } catch (error) {
    console.error('Error during Focus Mode cleanup:', error);
  }
}

async function cleanupGuildFocusSessions(guild: Guild) {
  try {
    const focusRole = guild.roles.cache.find(role => role.name === 'Focus Mode');
    
    if (!focusRole) {
      console.log(`No Focus Mode role found in guild: ${guild.name}`);
      return;
    }

    // Fetch all members to ensure we have fresh data
    await guild.members.fetch();
    
    const membersWithRole = focusRole.members;
    
    if (membersWithRole.size === 0) {
      console.log(`No members in Focus Mode in guild: ${guild.name}`);
      return;
    }

    console.log(`Found ${membersWithRole.size} members in Focus Mode in guild: ${guild.name}`);
    
    for (const [memberId, member] of membersWithRole) {
      try {
        await member.roles.remove(focusRole);
        console.log(`Removed Focus Mode from ${member.user.tag}`);
      } catch (error) {
        console.error(`Failed to remove Focus Mode from ${member.user.tag}:`, error);
      }
    }
    
  } catch (error) {
    console.error(`Error cleaning up guild ${guild.name}:`, error);
  }
}