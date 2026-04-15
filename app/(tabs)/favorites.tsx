import React, { useCallback, useState, useEffect } from "react";
import { View, Text, Image, FlatList, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import { Link } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { useFavorites } from "../../src/hooks/useFavorites";
import { fetchPokemonDetail } from "../../src/api/pokeClient";
import { Colors, Fonts } from "@/constants/theme";


export default function FavoritesScreen() {
    const { favorites, loaded, reload, toggleFavorite, isFavorite    } = useFavorites();
    const [details, setDetails] = useState<Record<string, any>>({});
    const [loadingDetails, setLoadingDetails] = useState(true);

    useFocusEffect(
        useCallback(() => {
            reload();
        }, [])
    );

    useEffect(()=> {
      const loadingDetails = async () => {
        setLoadingDetails(true);
        const results: Record<string, any> = {};

        for(const name of favorites) {
          try {
            const data = await fetchPokemonDetail(name);
            results[name] = data;
          } catch (error: any) {
            console.error(`Failed to load details for ${name}`, error);
          }
        }
        setDetails(results);
        setLoadingDetails(false);
      };

      if(favorites.length > 0) {
        loadingDetails();
      }
    }, [favorites]);

    if (!loaded || loadingDetails) {
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
        renderItem={({ item }) => {
          const info = details[item];

          return (
            <View style={styles.card}>
              {/*Image*/}
              {info?.sprites?.other?.["official-artwork"]?.front_default ? (
                <Image
                  source={{
                    uri: info.sprites.other["official-artwork"].front_default,
                  }}
                  style={styles.thumb}
                />
              ) : (
                <View style={styles.thumbPlaceholder} />
              )}
            </View>
          );
        }}
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
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  thumb: {
    width: 60,
    height: 60,
  },

  thumbPlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: "#ddd",
    borderRadius: 8,
  },

  cardText: {
    fontSize: 20,
    fontFamily: Fonts.sans,
    textTransform: "capitalize",
    color: Colors.light.text,
  },

  subText: {
    fontSize: 14,
    fontFamily: Fonts.sans,
    color: Colors.light.icon,
    textTransform: "capitalize",
  },

  star: {
    fontSize: 28,
    color: Colors.light.tint,
  },
});