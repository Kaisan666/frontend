import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  sassOptions: {
    // Этот код будет автоматически добавляться в начало каждого sass-файла
    additionalData: `@import "@/styles/variables.scss";`,

  },
};

export default nextConfig;
