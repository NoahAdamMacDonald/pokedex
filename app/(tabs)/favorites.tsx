import React, { useCallback } from "react";
import { View, Text, Image, FlatList, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import { Link } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { useFavorites } from "../../src/hooks/useFavorites";
import { fetchPokemonDetail } from "../../src/api/pokeClient";
import { Colors, Fonts } from "@/constants/theme";


export default function FavoritesScreen() {
    const { favorites, loaded, reload, toggleFavorite, isFavorite    } = useFavorites();

    useFocusEffect(
        useCallback(() => {
            reload();
        }, [])
    );

    if (!loaded) {
        return(
            <View style={styles.center}>
                <ActivityIndicator size="large" color={Colors.light.icon} />
            </View>
        );
    }

    if (favorites.length===0) {
        return (
          <View style={styles.center}>
            <Text style={styles.emptyText}>No favorites yet</Text>
            <Text style={styles.emptySub}>Tap ★ on any Pokémon to save it.</Text>
          </View>
        );
    }
    
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Favorites</Text>

        <FlatList
          data={favorites}
          keyExtractor={(name) => name}
          contentContainerStyle={{ paddingBottom: 40 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              {/* Name navigates to detail */}
              <Link
                href={{ pathname: "/pokemon/[name]", params: { name: item } }}
                asChild>
                <Pressable style={{ flex: 1 }}>
                  <Text style={styles.cardText}>{item}</Text>
                </Pressable>
              </Link>

              {/* Star toggles favorite */}
              <Pressable
                onPress={() => {
                  toggleFavorite(item);
                  reload(); // immediately refresh list
                }}>
                <Text style={styles.star}>{isFavorite(item) ? "★" : "☆"}</Text>
              </Pressable>
            </View>
          )}
        />
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

    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
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
        textTransform: "capitalize",
        color: Colors.light.text,
    },

    star: {
        fontSize: 24,
        color: Colors.light.tint,
    },
});