import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "favorites";

export function useFavorites() {
    const [favorites, setFavorites] = useState<string[]>([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
    (async () => {
        try {
        const raw = await AsyncStorage.getItem(KEY);
        if (raw) {
            setFavorites(JSON.parse(raw));
        }
        } catch (error) {
        console.log("Failed to load favorites", error);
        }
        setLoaded(true);
    })();
    }, []);

    const save = async (next: string[])=> {
        setFavorites(next),
        await AsyncStorage.setItem(KEY, JSON.stringify(next));
    };

    const toggleFavorite = async (name: string) => {
        const exists = favorites.includes(name);
        const next = exists
        ? favorites.filter((n)=> n !== name)
        : [...favorites, name];
        await save(next);
    };
    
    const isFavorite = (name: string) => favorites.includes(name);

    return { favorites, loaded, toggleFavorite, isFavorite };
}