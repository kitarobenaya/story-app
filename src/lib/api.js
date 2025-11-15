import supabase from "./supabaseClient";

// ===== CREATE =====
export async function insertStory(anonId, file_path, description, file_type) {
  const { data, error } = await supabase
    .from("stories")
    .insert([
      {
        anon_id: anonId,
        file_path: file_path,
        description: description,
        file_type: file_type,
      },
    ])
    .select();

  if (error) throw error;

  return data[0];
}

// ===== UPDATE =====
export async function updateStory(id, updates, oldFilePath, fileType, newFile) {
  const fileExt = newFile.name.split(".").pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `${fileType === "video" ? "videos" : "images"}/${fileName}`;

  if (newFile) {
    const { error } = await supabase.storage
      .from("stories_bucket")
      .remove([oldFilePath]);

    const { data, error: updateError } = await supabase
      .from("stories")
      .update({...updates, file_path: newFile ? filePath : undefined, file_type: fileType })
      .eq("id", id)
      .select();

    const { error: storageError } = await supabase.storage
      .from("stories_bucket")
      .upload(filePath, newFile, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) throw error; 
    if (updateError) throw error;
    if (storageError) throw error;
    return data;
  }
}

// ===== DELETE =====
export async function deleteStory(id, file_path) {
  const { error: storageError } = await supabase.storage
    .from("stories_bucket")
    .remove([file_path]);
  
  const { error } = await supabase.from("stories").delete().eq("id", id);


  if (storageError) throw error;
  if (error) throw error;
  return true;
}