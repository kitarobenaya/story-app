import { useState } from "react";
import supabase from "../lib/supabaseClient";

const useUpload = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const uploadFile = async (file) => {
        try {
            setIsSubmitting(true)
    
            // genereate unique name
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}.${fileExt}`;
            const filePath = `${file.type.startsWith("video/") ? "videos" : "images"}/${fileName}`;
    
            const {_, error} = await supabase.storage
            .from('stories_bucket')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
            })
    
            if (error) throw error;
    
            return { success: true, error: null, filePath: filePath };
        }
        catch (error) {
            return { success: false, error: error.message };
        }
        finally {
            setIsSubmitting(false)
        }
    }
    
    return {isSubmitting, uploadFile};
}

export default useUpload;