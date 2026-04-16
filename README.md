# 🔮 Fable Weaver: Choose Your Adventure

An interactive, AI-powered "Choose Your Own Adventure" web application. Users can select predefined themes or type their own custom prompts to generate entirely unique, branching narratives with dynamic UI feedback, atmospheric animations, and consequence-driven gameplay.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Python](https://img.shields.io/badge/Python-14354C?style=for-the-badge&logo=python&logoColor=white)
![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-D71F00?style=for-the-badge&logo=sqlite&logoColor=white)
![Groq API](https://img.shields.io/badge/Groq_LLM-f39c12?style=for-the-badge&logo=openai&logoColor=white)

---

<img width="1877" height="830" alt="image" src="https://github.com/user-attachments/assets/81a975b3-dc2a-48ca-98bd-3ac91423b7a0" />

---

## 🏗️ System Architecture

The application is split into a React-based frontend engine and a Python/SQLAlchemy backend (found in the [`choose-your-adventure`](https://github.com/4ssh1/choose-your-adventure) repository). 

Instead of generating the story node-by-node on the fly, the system generates the **entire branching narrative tree** upfront. This ensures narrative consistency, guarantees winning/losing paths, and allows for zero-latency node traversal on the client side.

### How It Works

1. **Prompt & Job Creation:** The user submits a theme (e.g., "The Haunted Manor"). The frontend sends this to the backend, which spawns an asynchronous background job.
2. **LLM Generation:** The backend queries the Groq API (using `llama-3.3-70b-versatile`). It uses strict system prompts and Pydantic models to force the LLM to output a deeply nested, multi-level JSON tree with guaranteed ending conditions.
3. **Data Flattening & Persistence:** Because SQL databases are relational, the backend intercepts the deeply nested JSON tree and iterates through it. It saves each scene as a distinct `StoryNode` and maps the relationships, effectively "flattening" the tree into a highly queryable dictionary of nodes.
4. **Client-Side Engine:** Once polling confirms the background job is complete, the frontend fetches the complete, flattened story object. The React app then takes over entirely, rendering the text via a typewriter effect and handling the logic to jump from node ID to node ID based on user input.

---

## 📡 Frontend-Backend Communication

The frontend communicates with the `choose-your-adventure` backend using an asynchronous polling mechanism to accommodate the time it takes the LLM to write a full branching story.

* **`POST /api/jobs`**: The frontend sends the selected theme. The backend immediately returns a `job_id`.
* **`GET /api/jobs/{job_id}`**: The frontend polls this endpoint every few seconds while rendering an atmospheric loading screen. 
* **`GET /api/stories/{story_id}`**: Once the job status is `completed`, the frontend fetches the full story payload.

### The Data Contract
To bridge the gap between relational databases and a graph-like narrative, the backend serves the story in a flattened format. The frontend relies on this structure to traverse the game:

```json
{
  "title": "The Haunted Manor",
  "root_node": {
    "id": 40,
    "content": "You stand before the crumbling entrance...",
    "is_ending": false,
    "is_winning": false,
    "options": [
      { "node_id": 41, "text": "Investigate the study" },
      { "node_id": 64, "text": "Explore the hallway" }
    ]
  },
  "all_nodes": {
    "40": { "id": 40, "content": "...", "options": [...] },
    "41": { "id": 41, "content": "...", "options": [...] }
  }
```

When a user clicks an option, the frontend looks up the corresponding node_id within the all_nodes dictionary to load the next scene.

### 🎮 Gameplay Features & UX
The frontend isn't just a text reader; it acts as a lightweight RPG engine:

- The Fate Meter: Behind the scenes, choices carry weight. A visual fate meter shifts colors (Green -> Yellow -> Red) based on the calculated risk of the user's path.

- Candles (Lives): The UI displays 5 lit candles. Every choice made snuffs out a candle, enforcing the backend constraint that users must survive at least 3-5 choices to reach an ending.

- Dynamic Atmospherics: Custom CSS animations control floating ash particles, shimmering cards, UI screen shakes on "bad" choices, and dynamic accent colors based on the user's chosen theme.

### Prerequisites
Node.js (v18+)

### Clone the repository

```bash
git clone https://github.com/4ssh1/fable-weaver.git
cd fable-weaver
```

Install dependencies

```bash
npm install
```

Set your backend API URL in .env

VITE_API_BASE_URL=http://localhost:8000
Code snippet

```bash
npm run dev
```
