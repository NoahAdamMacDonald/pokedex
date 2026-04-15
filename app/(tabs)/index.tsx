import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { fetchPokemonList, PokemonListItem } from '../../src/api/pokeClient';

export default function HomeScreen() {
  const [data, setData] = useState<PokemonListItem[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle",);
  const [error, setError] = useState<string>("");

  const load = async () => {
    try {
      setStatus("loading");
      setError("");
      const list = await fetchPokemonList();
      setData(list);
      setStatus("success");
    } catch (error: any) {
      setStatus("error");
      setError(error?.message ?? "Unknown error");
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 12 }}>
        Pokédex
      </Text>

      {status === "loading" && <ActivityIndicator />}

      {status === "error" && (
        <View>
          <Text style={{ color: "red" }}>Error: {error}</Text>
          <Pressable onPress={load}>
            <Text style={{ color: "blue", marginTop: 8 }}>Try again</Text>
          </Pressable>
        </View>
      )}

      {status === "success" && (
        <FlatList
          data={data}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <Link
              href={{ pathname: "/pokemon/[name]", params: { name: item.name } }}
              asChild>
              <Pressable style={{ paddingVertical: 8 }}>
                <Text style={{ fontSize: 16 }}>{item.name}</Text>
              </Pressable>
            </Link>
          )}
        />
      )}
    </View>
  );
}
