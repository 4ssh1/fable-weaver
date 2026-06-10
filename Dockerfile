# set the base image to create image for react app
FROM node:24-alpine
# Use corepack to enable pnpm (Official recommended method)
RUN corepack enable pnpm

# Use the restricted non-root user built into the official Node image
USER node

# Set the working directory in the container
WORKDIR /app

# --- The "Mid-Air Handoff" (Why we don't switch to root) ---
# By default, Docker assigns copied files to the 'root' user. 
# Using --chown=node:node intercepts the files as they are being copied 
# and assigns them to the 'node' user instantly. This prevents permission 
# errors without needing to create extra, bloated steps to switch users.
COPY --chown=node:node package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install

# Copy the rest of your code, assigning ownership to 'node'
COPY --chown=node:node . .

# Document the port Vite uses
EXPOSE 5173

# Start the Vite development server
CMD ["pnpm", "run", "dev", "--host"]