import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The Playground API route spawns the native sandbox-runner and reads
  // contract wasm files through runtime-computed paths, which static file
  // tracing cannot discover. Include every candidate artifact explicitly so
  // the serverless function bundle contains them on Vercel.
  outputFileTracingIncludes: {
    "/api/playground": [
      "./contracts/prebuilt/*.wasm",
      "./contracts/target/release/sandbox-runner",
      "./contracts/target/debug/sandbox-runner",
      "./contracts/target/release/sandbox-runner.exe",
      "./contracts/target/debug/sandbox-runner.exe",
      "./contracts/target/wasm32v1-none/release/*.wasm",
    ],
  },
};

export default nextConfig;