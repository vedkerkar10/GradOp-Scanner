/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
        return [
            {
                // matching all API routes
                source: "/(.*)",
                headers: [
                    {
                      key: 'Access-Control-Allow-Origin',
                      value: '*', // Replace with your allowed origin
                    },
                    {
                      key: 'Access-Control-Allow-Methods',
                      value: 'GET, POST, OPTIONS',
                    },
                    {
                      key: 'Access-Control-Allow-Headers',
                      value: 'X-Requested-With, Content-Type',
                    },
                  ],

            }
        ]
    }
};

export default nextConfig;
