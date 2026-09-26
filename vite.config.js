import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// Custom robust file downloader middleware plugin
const downloadsMiddlewarePlugin = () => ({
  name: 'downloads-middleware-plugin',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      const url = req.url || '';
      if (url.includes('/downloads/')) {
        let cleanFileName = decodeURIComponent(url.replace('/downloads/', '').split('?')[0]);
        const aliasMap = {
          'Girionix_AI_Titan_Setup.exe': 'Girionix_AI_Setup.exe',
          'Girionix_AI_Titan_Lite_Setup.exe': 'Girionix_AI_Setup.exe',
          'Girionix_AI_Titan_Linux.AppImage': 'Girionix_AI_Linux.AppImage',
          'Girionix_AI_Titan_Lite_Linux.AppImage': 'Girionix_AI_Linux.AppImage',
          'Girionix_AI_Titan.apk': 'Girionix_AI.apk',
          'Girionix_AI_Titan_Lite.apk': 'Girionix_AI.apk',
          'Girionix_AI_Titan_macOS.dmg': 'Girionix_AI_macOS.dmg',
          'Girionix_AI_Titan_Lite_macOS.dmg': 'Girionix_AI_macOS.dmg',
          'Girionix_AI_macOS.zip': 'Girionix_AI_macOS.dmg',
          'Girionix_AI_Titan_iOS.mobileconfig': 'Girionix_AI_iOS.mobileconfig',
          'Girionix_AI_Titan_Lite_iOS.mobileconfig': 'Girionix_AI_iOS.mobileconfig'
        };
        if (aliasMap[cleanFileName]) {
          cleanFileName = aliasMap[cleanFileName];
        }
        const filePath = path.join(process.cwd(), 'public', 'downloads', cleanFileName);

        if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
          const stat = fs.statSync(filePath);
          const range = req.headers.range;

          res.setHeader('Content-Disposition', `attachment; filename="${cleanFileName}"`);
          res.setHeader('Accept-Ranges', 'bytes');
          res.setHeader('Cache-Control', 'no-cache');

          // Determine MIME type
          if (cleanFileName.endsWith('.exe')) res.setHeader('Content-Type', 'application/vnd.microsoft.portable-executable');
          else if (cleanFileName.endsWith('.apk')) res.setHeader('Content-Type', 'application/vnd.android.package-archive');
          else if (cleanFileName.endsWith('.dmg')) res.setHeader('Content-Type', 'application/x-apple-diskimage');
          else if (cleanFileName.endsWith('.AppImage')) res.setHeader('Content-Type', 'application/x-executable');
          else if (cleanFileName.endsWith('.mobileconfig')) res.setHeader('Content-Type', 'application/x-apple-aspen-config');
          else res.setHeader('Content-Type', 'application/octet-stream');

          if (range) {
            const parts = range.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
            const chunksize = (end - start) + 1;
            const fileStream = fs.createReadStream(filePath, { start, end });

            res.writeHead(206, {
              'Content-Range': `bytes ${start}-${end}/${stat.size}`,
              'Content-Length': chunksize,
            });
            fileStream.pipe(res);
            return;
          } else {
            res.setHeader('Content-Length', stat.size);
            res.writeHead(200);
            fs.createReadStream(filePath).pipe(res);
            return;
          }
        }
      }
      next();
    });
  }
});

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  const openrouterKey = env.VITE_OPENROUTER_API_KEY || env.OPENROUTER_API_KEY || env.VITE_OPENROUTER_KEY || env.OPENROUTER_KEY || '';
  const geminiKey = env.VITE_GEMINI_API_KEY || env.GEMINI_API_KEY || env.VITE_GOOGLE_API_KEY || env.GOOGLE_API_KEY || '';
  const replicateToken = env.VITE_REPLICATE_API_TOKEN || env.REPLICATE_API_TOKEN || env.VITE_REPLICATE_TOKEN || env.REPLICATE_TOKEN || env.REPLICATE_API_KEY || '';
  const groqKey = env.VITE_GROQ_API_KEY || env.GROQ_API_KEY || env.VITE_GROQ_KEY || env.GROQ_KEY || '';
  const deepseekKey = env.VITE_DEEPSEEK_API_KEY || env.DEEPSEEK_API_KEY || '';
  const openaiKey = env.VITE_OPENAI_API_KEY || env.OPENAI_API_KEY || '';
  const anthropicKey = env.VITE_ANTHROPIC_API_KEY || env.ANTHROPIC_API_KEY || '';

  return {
    plugins: [react(), downloadsMiddlewarePlugin()],
    envPrefix: ['VITE_', 'OPENROUTER_', 'GEMINI_', 'GOOGLE_', 'REPLICATE_', 'GROQ_', 'DEEPSEEK_', 'OPENAI_', 'ANTHROPIC_'],
    define: {
      'process.env.VITE_OPENROUTER_API_KEY': JSON.stringify(openrouterKey),
      'process.env.OPENROUTER_API_KEY': JSON.stringify(openrouterKey),
      'process.env.VITE_GEMINI_API_KEY': JSON.stringify(geminiKey),
      'process.env.GEMINI_API_KEY': JSON.stringify(geminiKey),
      'process.env.VITE_GOOGLE_API_KEY': JSON.stringify(geminiKey),
      'process.env.GOOGLE_API_KEY': JSON.stringify(geminiKey),
      'process.env.VITE_REPLICATE_API_TOKEN': JSON.stringify(replicateToken),
      'process.env.REPLICATE_API_TOKEN': JSON.stringify(replicateToken),
      'process.env.VITE_GROQ_API_KEY': JSON.stringify(groqKey),
      'process.env.GROQ_API_KEY': JSON.stringify(groqKey),
      'process.env.VITE_DEEPSEEK_API_KEY': JSON.stringify(deepseekKey),
      'process.env.DEEPSEEK_API_KEY': JSON.stringify(deepseekKey),
      'process.env.VITE_OPENAI_API_KEY': JSON.stringify(openaiKey),
      'process.env.OPENAI_API_KEY': JSON.stringify(openaiKey),
      'process.env.VITE_ANTHROPIC_API_KEY': JSON.stringify(anthropicKey),
      'process.env.ANTHROPIC_API_KEY': JSON.stringify(anthropicKey),
    },
    build: {
      emptyOutDir: false,
      chunkSizeWarningLimit: 2500
    },
    server: {
      port: 3000,
      open: false,
      watch: {
        ignored: ['**/public/downloads/**', '**/dist/**', '**/*.TMP']
      },
      proxy: {
        '/api/replicate': {
          target: 'https://api.replicate.com/v1',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/replicate/, ''),
          headers: {
            'Origin': 'https://api.replicate.com'
          }
        }
      }
    }
  };
})
