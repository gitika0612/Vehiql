import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const createClient = async (cookieStore: ReturnType<typeof cookies>) => {
  // Await the cookieStore to resolve the Promise
  const resolvedCookieStore = await cookieStore;

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return resolvedCookieStore.getAll(); // Now you can access getAll
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            try {
              resolvedCookieStore.set(name, value, options); // Access set method
            } catch (error) {
              console.error("Error setting cookies:", error); // Log any error
            }
          });
        },
      },
    }
  );
};
