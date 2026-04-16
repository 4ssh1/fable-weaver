
const API = import.meta.env.VITE_API_BASE_URL ;
const POLL_INTERVAL_MS = 1500;
const POLL_TIMEOUT_MS  = 60_000;


export interface StoryOption {
  text: string;
  next_node_id: string;
}

export interface StoryNode {
  id: string;
  content: string;
  is_ending: boolean;
  is_winning: boolean;
  options: StoryOption[];
}

export interface StoryTree {
  id: string;
  title: string;
  root_node: StoryNode;
  all_nodes: Record<string, StoryNode>;
}

export interface JobStatus {
    id: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    story_id: string | null;
    error: string | null;
}


export async function createStoryJob(theme: string): Promise<{ job_id: string; status: string }> {
  const res = await fetch(`${API}/stories/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',          
    body: JSON.stringify({ theme }),
  });
  if (!res.ok) throw new Error(`Failed to create story job: ${res.status}`);
  return res.json();
}

export async function getJobStatus(jobId: string): Promise<JobStatus> {
  const res = await fetch(`${API}/jobs/${jobId}`, { credentials: 'include' });
  if (!res.ok) throw new Error(`Failed to fetch job status: ${res.status}`);
  return res.json();
}

export async function getStory(storyId: string): Promise<StoryTree> {
  const res = await fetch(`${API}/stories/${storyId}`, { credentials: 'include' });
  if (!res.ok) throw new Error(`Failed to fetch story: ${res.status}`);
  return res.json();
}



export function pollUntilComplete(jobId: string): Promise<JobStatus> {
  return new Promise((resolve, reject) => {
    const start = Date.now();

    const tick = async () => {
      try {
        const job = await getJobStatus(jobId);

        if (job.status === 'completed') return resolve(job);
        if (job.status === 'failed')    return reject(new Error(job.error ?? 'Story generation failed'));
        if (Date.now() - start > POLL_TIMEOUT_MS) return reject(new Error('Story generation timed out'));

        setTimeout(tick, POLL_INTERVAL_MS);
      } catch (err) {
        reject(err);
      }
    };

    setTimeout(tick, POLL_INTERVAL_MS);
  });
}