---
description: Kill localhost connections and restart the development server
---

Can you kill localhost connections and restart our development server? Specifically:

1. Check for and terminate any processes running on common dev ports (3000, 3001, 3002, 3003, 5173, 8080, 4200, 5000, etc.)
2. Detect the package manager (npm/pnpm/yarn) and kill existing dev processes
3. Restart the development server using the appropriate command (npm run dev, pnpm dev, yarn dev, etc.)
4. Confirm the development server is running and accessible
5. Check for any connection errors or startup issues
6. If using a database or external services, verify connections are working

Automatically adapts to your project's package manager and configuration.