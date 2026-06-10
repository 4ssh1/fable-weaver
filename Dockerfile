# set the base image to create image for react app
FROM node:18-alpine

# Install pnpm directly using npm
RUN npm install -g pnpm

# --- Create a restricted non-root user (Ubuntu/Debian syntax) ---
# groupadd -r: Creates a restricted system group named 'app'
# useradd -r: Creates a restricted system user
# -g app: Assigns the new user to the 'app' group
# The final 'app' is the username
RUN groupadd -r app && useradd -r -g app app

# In this case, 'app' is the username that was created in the previous step, and by setting USER to 'app'
USER app

# set the working directory in the container
WORKDIR /app

# --- The "Mid-Air Handoff" (Why we don't switch to root) ---
# By default, Docker assigns copied files to the 'root' user. 
# Using --chown=app:app intercepts the files as they are being copied 
# and assigns them to the 'app' user instantly. This prevents permission 
# errors without needing to create extra, bloated steps to switch users.
COPY --chown=app:app package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install

# Copy the rest of your code, again handing ownership to 'app' mid-air
COPY --chown=app:app . .

# Document the port Vite uses
EXPOSE 5173

# Start the Vite development server
CMD ["pnpm", "run", "dev"]