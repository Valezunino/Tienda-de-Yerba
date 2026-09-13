import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { remotePatterns: [{ protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" }] },
  // Supabase publishable keys are safe in the browser; RLS protects the data.
  // Project-level environment variables can still override these defaults.
  env: {
    NEXT_PUBLIC_SUPABASE_URL:
      process.env.NEXT_PUBLIC_SUPABASE_URL ??
      "https://lyoqrkhmaokpwoguvksc.supabase.co",
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
      "sb_publishable_1vIz8iDJFvxP10Kp0sQz4A_RDZr6wK8",
  },
};

export default nextConfig;
