import React, { useEffect, useState } from "react";
import { View, Text, Image, ActivityIndicator, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { fetchPokemonDetail } from "../../src/api/pokeClient";

export default function PokemonDetailScreen() {
  const { name } = useLocalSearchParams<{ name?: string }>();
  const router = useRouter();

  const [data, setData] = useState<any>(null);
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [error, setError] = useState<string>("");

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
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text>No Pokémon name provided.</Text>
            </View>
        );
    }

    if (status === "loading") {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator />
            </View>
        );
    } 

    if (status === "error") {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text>Error: {error}</Text>
            <Pressable onPress={load}>
                <Text style={{ color: "blue", marginTop: 8 }}>Try again</Text>
            </Pressable>
            </View>
        );
    }

    if (!data) {
    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>No Pokémon data found.</Text>
        </View>
    );
    }

    return (
    <View style={{ flex: 1, padding: 16 }}>
        <Pressable onPress={() => router.back()}>
        <Text style={{ color: "blue", marginBottom: 12 }}>← Back</Text>
        </Pressable>

        <Text style={{ fontSize: 24, fontWeight: "bold" }}>{name}</Text>

        {data.sprites?.front_default ? (
        <Image
            source={{ uri: data.sprites.front_default }}
            style={{ width: 120, height: 120, marginVertical: 16 }}
        />
        ) : (
        <Text>No image available.</Text>
        )}

        <Text>Height: {data.height}</Text>
        <Text>Weight: {data.weight}</Text>
        <Text>Base experience: {data.base_experience}</Text>
    </View>
    );
}
