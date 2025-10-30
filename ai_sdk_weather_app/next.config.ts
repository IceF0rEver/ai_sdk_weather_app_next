import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	eslint: {
		ignoreDuringBuilds: true,
	},
	allowedDevOrigins: [process.env.NEXT_DEV_APP!],
};

export default nextConfig;
