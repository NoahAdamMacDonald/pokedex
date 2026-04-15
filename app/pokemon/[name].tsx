import React, { useEffect, useState } from "react";
import { View, Text, Image, ActivityIndicator, Pressable, StyleSheet, ScrollView } from "react-native";
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
    const favorite = isFavorite(name!); 

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

        {/*Name and Favourite*/}
        <View style={styles.content}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{name}</Text>

            <Pressable onPress={() => toggleFavorite(name)}>
              <Text style={styles.star}>{favorite ? "★" : "☆"}</Text>
            </Pressable>
          </View>

          {/*Image*/}
          {data.sprites?.other?.["official-artwork"].front_default ? (
            <Image
              source={{
                uri: data.sprites.other["official-artwork"].front_default,
              }}
              style={styles.image}
              resizeMode="contain"
            />
          ) : (
            <ActivityIndicator size="large" color={Colors.light.tint} />
          )}

          {/*About*/}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.itemText}>Height: {data.height}</Text>
            <Text style={styles.itemText}>Weight: {data.weight}</Text>
            <Text style={styles.itemText}>Base XP: {data.base_experience}</Text>
          </View>

          {/*Types*/}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Types</Text>
            <Text style={styles.typeRow}>
              {data.types.map((type: any) => (
                <View key={type.type.name} style={styles.typeBadge}>
                  <Text style={styles.typeText}>{type.type.name}</Text>
                </View>
              ))}
            </Text>
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
    width: 260,
    height: 260,
    marginBottom: 20,
  },

  section: {
    width: "100%",
    backgroundColor: "#f7f7f7",
    padding: 16,
    borderRadius: 14,
    marginTop: 16,
  },

  sectionTitle: {
    fontSize: 22,
    fontFamily: Fonts.sans,
    fontWeight: "bold",
    marginBottom: 10,
    color: Colors.light.text,
  },

  itemText: {
    fontSize: 18,
    fontFamily: Fonts.sans,
    marginBottom: 6,
    color: Colors.light.text,
    textTransform: "capitalize",
  },

  typeRow: {
    flexDirection: "row",
    gap: 10,
    flexWrap: "wrap",
  },

  typeBadge: {
    backgroundColor: Colors.light.tint,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },

  typeText: {
    color: "white",
    fontFamily: Fonts.sans,
    fontSize: 16,
    textTransform: "capitalize",
},
});