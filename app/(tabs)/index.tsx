import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, Pressable, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { fetchPokemonList, PokemonListItem } from '../../src/api/pokeClient';
import { Colors, Fonts  } from '@/constants/theme';

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
    <View style={styles.container}>
      <Text style={styles.title}>
        Pokédex
      </Text>

      {status === "loading" && <ActivityIndicator size="large" color={Colors.light.tint} />}

      {status === "error" && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>Error: {error}</Text>
          <Pressable onPress={load}>
            <Text style={styles.retryText}>Try again</Text>
          </Pressable>
        </View>
      )}

      {status === "success" && (
        <FlatList
          data={data}
          keyExtractor={(item) => item.name}
          contentContainerStyle={{ paddingBottom: 40 }}
          renderItem={({ item }) => (
            <Link
              href={{ pathname: "/pokemon/[name]", params: { name: item.name } }}
              asChild>
              <Pressable style={styles.card}>
                <Text style={styles.cardText}>{item.name}</Text>
              </Pressable>
            </Link>
          )}
        />
      )}
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
  card: {
    backgroundColor: "#f2f2f2",
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
  },
  cardText: {
    fontSize: 18,
    fontFamily: Fonts.sans,
    color: Colors.light.text,
    textTransform: "capitalize",
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
  retryText: {
    color: Colors.light.tint,
    fontWeight: "bold",
  },
});
