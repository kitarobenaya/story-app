import { useState, useEffect } from 'react';
import supabase from '../lib/supabaseClient';

const useStories = (anonId) => {
    const [stories, setStories] = useState([]);

    useEffect(() => {
        const fetchStories = async () => {
            const { data: stories, error } = await supabase
                .from('stories')
                .select('*')
                .eq("anon_id", anonId)
                .order("created_at", { ascending: false });

            if (error) {
                console.error('Error fetching stories:', error);
            } else {
                setStories(stories.map((story) => {
                    const {data: urlData} = supabase.storage
                    .from("stories_bucket")
                    .getPublicUrl(story.file_path)

                    return {
                        ...story,
                        url: urlData.publicUrl,
                        isHolding: false,
                    }
                }));
            }
        };
        fetchStories();
    }, [anonId, stories]);

    return stories;
}

export default useStories;