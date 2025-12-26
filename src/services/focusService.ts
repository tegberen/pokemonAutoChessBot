import { FocusSession, IFocusSession } from '../models/FocusSession';

export async function saveFocusSession(userId: string, durationMinutes: number): Promise<IFocusSession> {
  try {
    const session = new FocusSession({
      userId,
      durationMinutes
    });
    
    await session.save();
    console.log(`Saved ${durationMinutes} minute focus session for user ${userId}`);
    
    return session;
  } catch (error) {
    console.error('Error saving focus session:', error);
    throw error;
  }
}

export async function getFocusStats(userId: string): Promise<{ sessionCount: number; totalMinutes: number } | null> {
  try {
    const sessions = await FocusSession.find({ userId });
    
    if (sessions.length === 0) {
      return null;
    }
    
    const totalMinutes = sessions.reduce((sum, session) => sum + session.durationMinutes, 0);
    
    return {
      sessionCount: sessions.length,
      totalMinutes
    };
  } catch (error) {
    console.error('Error fetching focus stats:', error);
    throw error;
  }
}