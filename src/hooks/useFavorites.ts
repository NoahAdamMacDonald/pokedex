import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "favorites";

export function useFavorites() {
    const [favorites, setFavorites] = useState<string[]>([]);
    const [loaded, setLoaded] = useState(false);

    const load = async () => {
        try {
            const raw = await AsyncStorage.getItem(KEY);
            if(raw) {
                setFavorites(JSON.parse(raw))
            } else {
                setFavorites([]);
            }
        } catch(error) {
            console.error("Failed to load favorites", error);
        }
        setLoaded(true);
    };

    useEffect(() => {
        load();
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

    return { favorites, loaded, toggleFavorite, isFavorite, reload: load };
}