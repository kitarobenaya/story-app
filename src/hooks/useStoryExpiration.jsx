import { useEffect } from "react";
import { deleteStory } from "../lib/api"; 

export default function useStoryExpiration(stories) {
    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();

            stories.map((story) => {
                const created = new Date(story.created_at);
                const age = now - created;

                if (age >= 24 * 60 * 60 * 1000) { // 24 hours
                    deleteStory(story.id, story.file_path);
                }
            })
        }, 30 * 1000)

        return () => clearInterval(interval);
    }, [stories])
};