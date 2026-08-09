import { Octokit } from '@octokit/rest';
import { AppState } from '../types';

export class GitHubService {
  private octokit: Octokit | null = null;
  private owner: string = '';
  private repo: string = '';

  constructor(token: string, fullRepo: string) {
    if (token && fullRepo.includes('/')) {
      this.octokit = new Octokit({ auth: token });
      const [owner, repo] = fullRepo.split('/');
      this.owner = owner;
      this.repo = repo;
    }
  }

  isValid(): boolean {
    return this.octokit !== null && this.owner !== '' && this.repo !== '';
  }

  async syncState(state: Omit<AppState, 'settings' | 'activeIssueId'>, commitMessage: string = 'Update VME Context via App') {
    if (!this.isValid()) throw new Error('GitHub configuration is invalid');

    const path = 'vme-state.json';
    const content = btoa(unescape(encodeURIComponent(JSON.stringify(state, null, 2))));
    
    let sha: string | undefined;

    try {
      // Check if file exists to get the SHA
      const { data } = await this.octokit!.repos.getContent({
        owner: this.owner,
        repo: this.repo,
        path,
      });
      
      if (!Array.isArray(data) && data.type === 'file') {
        sha = data.sha;
      }
    } catch (e: any) {
      if (e.status !== 404) {
        throw e;
      }
    }

    await this.octokit!.repos.createOrUpdateFileContents({
      owner: this.owner,
      repo: this.repo,
      path,
      message: commitMessage,
      content,
      sha,
    });
  }

  async fetchState(): Promise<Omit<AppState, 'settings' | 'activeIssueId'> | null> {
    if (!this.isValid()) return null;
    const path = 'vme-state.json';
    
    try {
      const { data } = await this.octokit!.repos.getContent({
        owner: this.owner,
        repo: this.repo,
        path,
      });

      if (!Array.isArray(data) && data.type === 'file' && data.content) {
        const decodedContent = decodeURIComponent(escape(atob(data.content)));
        return JSON.parse(decodedContent);
      }
    } catch (e: any) {
      if (e.status === 404) return null;
      console.error('Error fetching state from GitHub:', e);
    }
    return null;
  }
}
