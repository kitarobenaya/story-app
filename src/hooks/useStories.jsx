import { useState, useEffect, useCallback } from "react";
import supabase from "../lib/supabaseClient";
import { deleteStory as deleteStoryApi } from "../lib/api";

const useStories = (anonId) => {
  const [message, setMessage] = useState("");
  const [stories, setStories] = useState([]);

  const fetchStories = useCallback(async () => {
    if (!anonId) return;

    setMessage("Fetching...");
    try {
      const { data: storiesData, error } = await supabase
        .from("stories")
        .select("id, file_path, file_type, description, created_at")
        .eq("anon_id", anonId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching stories:", error);
        setMessage("Error");
      } else {
        setStories(
          storiesData.map((story) => {
            const { data: urlData } = supabase.storage
              .from("stories_bucket")
              .getPublicUrl(story.file_path);

            return {
              ...story,
              url: urlData.publicUrl,
            };
          })
        );
        setMessage("Ready");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Error");
    }
  }, [anonId, setStories, setMessage]);

  useEffect(() => {
    if (!anonId) return;
    fetchStories();
  }, [anonId, fetchStories]);

  const deleteStory = async (storyId, storyPath) => {
    try {
      // Use deleteStory from API
      await deleteStoryApi(storyId, storyPath);

      // Remove from state
      setStories(stories.filter((story) => story.id !== storyId));
      return true;
    } catch (error) {
      console.error("Error deleting story:", error);
      return false;
    }
  };
  return { stories, message, deleteStory, refetchStories: fetchStories };
};

export default useStories;
