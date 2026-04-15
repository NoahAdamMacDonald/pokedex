const BASE_URL = "https://pokeapi.co/api/v2";

export type PokemonListItem = {
  name: string;
  url: string;
};

type PokemonListResponse = {
  results: PokemonListItem[];
};

export async function fetchPokemonList(limit = 50): Promise<PokemonListItem[]> {
  const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}`);
  if (!response.ok) throw new Error("Failed to load Pokémon.");
  const data: PokemonListResponse = await response.json();
  return data.results;
}

export async function fetchPokemonDetail(name: string) {
    const response = await fetch(`${BASE_URL}/pokemon/${name}`);
    if (!response.ok) throw new Error("Failed to load Pokémon detail.");
    return response.json();
}
