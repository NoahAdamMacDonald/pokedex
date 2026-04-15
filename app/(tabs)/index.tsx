import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, Pressable, StyleSheet, TextInput } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Link } from 'expo-router';
import { fetchPokemonList, PokemonListItem } from '../../src/api/pokeClient';
import { useFavorites } from '../../src/hooks/useFavorites';
import { Colors, Fonts  } from '@/constants/theme';

export default function HomeScreen() {
  const [data, setData] = useState<PokemonListItem[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle",);
  const [filtered, setFiltered] = useState<PokemonListItem[]>([]);
  const [search, setSearch] = useState<string>("");
  const [error, setError] = useState<string>("");
  const { toggleFavorite, isFavorite, reload } = useFavorites();

  const load = async () => {
    try {
      setStatus("loading");
      setError("");
      const list = await fetchPokemonList(2000);
      setData(list);
      setFiltered(list);
      setStatus("success");
    } catch (error: any) {
      setStatus("error");
      setError(error?.message ?? "Unknown error");
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (search.trim() === "") {
      setFiltered(data);
    } else {
      const s = search.toLowerCase().trim();
      setFiltered(data.filter((p) => p.name.includes(s)));
    }
  }, [search, data]);
  useFocusEffect(
    useCallback(() => {
      reload();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pokédex</Text>

      {/* Search Bar */}
      <TextInput
        style={styles.search}
        placeholder="Search Pokémon..."
        placeholderTextColor={Colors.light.icon}
        value={search}
        onChangeText={setSearch}
      />

      {status === "loading" && (
        <ActivityIndicator size="large" color={Colors.light.tint} />
      )}

      {status === "error" && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>Error: {error}</Text>
          <Pressable onPress={load}>
            <Text style={styles.retryText}>Try again</Text>
          </Pressable>
        </View>
      )}

      {status === "success" &&
        (filtered.length === 0 && search.trim() !== "" ? (
          <View style={styles.center}>
            <Text style={styles.emptyText}>No Pokémon found</Text>
            <Text style={styles.emptySub}>Try a different name.</Text>
          </View>
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.name}
            contentContainerStyle={{ paddingBottom: 40 }}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Link
                  href={{
                    pathname: "/pokemon/[name]",
                    params: { name: item.name },
                  }}
                  asChild>
                  <Pressable style={{ flex: 1 }}>
                    <Text style={styles.cardText}>{item.name}</Text>
                  </Pressable>
                </Link>

                <Pressable onPress={() => toggleFavorite(item.name)}>
                  <Text style={styles.star}>
                    {isFavorite(item.name) ? "★" : "☆"}
                  </Text>
                </Pressable>
              </View>
            )}
          />
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontFamily: Fonts.sans,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: Colors.light.text,
  },
  search: {
    backgroundColor: "#eaeaea",
    padding: 12,
    borderRadius: 12,
    fontSize: 16,
    fontFamily: Fonts.sans,
    marginBottom: 16,
    color: Colors.light.text,
  },
  card: {
    backgroundColor: "#f2f2f2",
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardText: {
    fontSize: 18,
    fontFamily: Fonts.sans,
    color: Colors.light.text,
    textTransform: "capitalize",
  },
  star: {
    fontSize: 24,
    color: Colors.light.tint,
  },
  errorBox: {
    padding: 16,
    backgroundColor: "#ffe5e5",
    borderRadius: 8,
  },
  errorText: {
    color: "red",
    marginBottom: 8,
  },
  emptyText: {
  fontSize: 22,
  fontFamily: Fonts.sans,
  color: Colors.light.text,
  marginBottom: 8,
},
  emptySub: {
    fontSize: 16,
    fontFamily: Fonts.sans,
    color: Colors.light.icon,
  },
  retryText: {
    color: Colors.light.tint,
    fontWeight: "bold",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
