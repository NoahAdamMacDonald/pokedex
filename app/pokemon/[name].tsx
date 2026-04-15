import React, { useEffect, useState } from "react";
import { View, Text, Image, ActivityIndicator, Pressable, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { fetchPokemonDetail } from "../../src/api/pokeClient";
import { useFavorites } from "../../src/hooks/useFavorites";
import { Colors, Fonts } from "@/constants/theme";

export default function PokemonDetailScreen() {
    const { name } = useLocalSearchParams<{ name?: string }>();
    const router = useRouter();

    const [data, setData] = useState<any>(null);
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [error, setError] = useState<string>("");
    const { toggleFavorite, isFavorite } = useFavorites();
    const favorite = name ? isFavorite(name) : false;   

    const load = async () => {
        if (!name) return;
        try {
            setStatus("loading");
            setError("");
            const detail = await fetchPokemonDetail(name);
            setData(detail);
            setStatus("success");
        } catch (error: any) {
            setStatus("error");
            setError(error?.message ?? "Unknown error");
        }
    };

  useEffect(() => {
    load();
  }, [name]);

  if (!name) {
    return (
      <Centered>
        <Text>No Pokémon name provided.</Text>
      </Centered>
    );
  }

  if (status === "loading") {
    return (
      <Centered>
        <ActivityIndicator size="large" color={Colors.light.tint} />
      </Centered>
    );
  }

  if (status === "error") {
    return (
      <Centered>
        <Text style={{ color: "red" }}>Error: {error}</Text>
        <Pressable onPress={load}>
          <Text style={{ color: Colors.light.tint, marginTop: 8 }}>Try again</Text>
        </Pressable>
      </Centered>
    );
  }

    if (!data) {
    return (
        <Centered>
            <Text>No Pokémon data found.</Text>
        </Centered>
    );
    }

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()}>
            <Text style={styles.back}>← Back</Text>
          </Pressable>
        </View>

        <View style={styles.content}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{name}</Text>

            <Pressable onPress={() => toggleFavorite(name)}>
              <Text style={styles.star}>{favorite ? "★" : "☆"}</Text>
            </Pressable>
          </View>

          {data.sprites?.front_default ? (
            <Image
              source={{ uri: data.sprites.front_default }}
              style={styles.image}
            />
          ) : (
            <Text>No image available.</Text>
          )}

          <View style={styles.card}>
            <Text style={styles.stat}>Height: {data.height}</Text>{" "}
            <Text style={styles.stat}>Weight: {data.weight}</Text>{" "}
            <Text style={styles.stat}>
              Base experience: {data.base_experience}
            </Text>{" "}
          </View>
        </View>
      </View>
    );
}

function Centered({ children }: any) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
        padding: 20,
        alignItems: "stretch",
    },

    header: {
        width: "100%",
        alignItems: "flex-start",
        marginBottom: 10,
    },

    back: {
        color: Colors.light.tint,
        fontSize: 18,
        fontFamily: Fonts.sans,
    },

    content: {
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-start",
        width: "100%",
    },

    nameRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginBottom: 20,
    },

    name: {
        fontSize: 32,
        fontFamily: Fonts.sans,
        fontWeight: "bold",
        textTransform: "capitalize",
        color: Colors.light.text,
    },

    star: {
        fontSize: 32,
        color: Colors.light.tint,
    },

    image: {
        width: 200,
        height: 200,
        marginBottom: 20,
    },

    card: {
        backgroundColor: "#f2f2f2",
        padding: 20,
        borderRadius: 16,
        width: "100%",
        marginTop: 10,
    },

    stat: {
        fontSize: 18,
        fontFamily: Fonts.sans,
        marginBottom: 8,
        color: Colors.light.text,
},
});