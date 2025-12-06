import mongoose, { Schema, Document } from 'mongoose';

export interface IPokemonCatch extends Document {
  userId: string;
  pokemonId: number;
  pokemonName: string;
  weight: number;
  imageUrl: string | null;
  caughtAt: Date;
}

const PokemonCatchSchema = new Schema<IPokemonCatch>({
  userId: {
    type: String,
    required: true,
    index: true
  },
  pokemonId: {
    type: Number,
    required: true
  },
  pokemonName: {
    type: String,
    required: true
  },
  weight: {
    type: Number,
    required: true
  },
  imageUrl: {
    type: String,
    default: null
  },
  caughtAt: {
    type: Date,
    default: Date.now
  }
});

PokemonCatchSchema.index({ userId: 1, caughtAt: -1 });

export const PokemonCatch = mongoose.model<IPokemonCatch>('PokemonCatch', PokemonCatchSchema);
