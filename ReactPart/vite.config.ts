import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // server: {
  //   headers: {
  //     "Content-Security-Policy": "script-src 'self' 'unsafe-inline';",
  //   },
  //   host: true, // Makes the server accessible on the local network
  // },
});
