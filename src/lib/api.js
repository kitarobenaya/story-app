import supabase from "./supabaseClient";


// ===== CREATE =====
export async function insertStory(anonId, file_path, description) {
    const {data, error} = await supabase
    .from("stories")
    .insert([
        {anon_id: anonId, file_path: file_path, description: description}
    ])
    .select();

    if (error) throw error;

    return data[0];
}
  
  // ===== UPDATE =====
  export async function updateStory(id, updates) {
    const { data, error } = await supabase
      .from("stories")
      .update(updates)
      .eq("id", id)
      .select();
  
    if (error) throw error;
    return data;
  }
  
  // ===== DELETE =====
  export async function deleteStory(id) {
    const { error } = await supabase
      .from("stories")
      .delete()
      .eq("id", id);
  
    if (error) throw error;
    return true;
  }