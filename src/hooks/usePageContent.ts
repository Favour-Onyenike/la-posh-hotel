
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ContentItem {
  id: string;
  page: string;
  section: string;
  title: string | null;
  content: string;
}

export const usePageContent = (page: string) => {
  return useQuery({
    queryKey: ["page-content", page],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("content")
        .select("*")
        .eq("page", page);

      if (error) throw error;
      
      // Convert array to object for easier access
      const contentMap: Record<string, ContentItem> = {};
      data.forEach((item) => {
        contentMap[item.section] = item;
      });
      
      return contentMap;
    },
  });
};

export const getContentValue = (content: Record<string, ContentItem> | undefined, section: string, field: "title" | "content", fallback: string = "") => {
  return content?.[section]?.[field] || fallback;
};
