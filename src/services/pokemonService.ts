import { PokemonCatch, IPokemonCatch } from '../models/PokemonCatch';

interface PokemonData {
  pokemonId: number;
  pokemonName: string;
  weight: number;
  imageUrl: string | null;
  caughtAt: Date;
}

export async function savePokemonCatch(userId: string, pokemonData: PokemonData): Promise<IPokemonCatch> {
  try {
    const pokemonCatch = new PokemonCatch({
      userId,
      ...pokemonData
    });
    
    await pokemonCatch.save();
    console.log(`Saved ${pokemonData.pokemonName} for user ${userId}`);
    
    return pokemonCatch;
  } catch (error) {
    console.error('Error saving Pokémon catch:', error);
    throw error;
  }
}

export async function getUserPokemon(userId: string): Promise<IPokemonCatch[]> {
  try {
    return await PokemonCatch.find({ userId })
      .sort({ caughtAt: -1 })
      .exec();
  } catch (error) {
    console.error('Error fetching user Pokémon:', error);
    throw error;
  }
}

export async function getPokemonCount(userId: string): Promise<number> {
  try {
    return await PokemonCatch.countDocuments({ userId });
  } catch (error) {
    console.error('Error counting Pokémon:', error);
    throw error;
  }
}

export async function getUniquePokemonCount(userId: string): Promise<number> {
  try {
    const uniquePokemon = await PokemonCatch.distinct('pokemonId', { userId });
    return uniquePokemon.length;
  } catch (error) {
    console.error('Error counting unique Pokémon:', error);
    throw error;
  }
}
