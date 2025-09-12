// Job Storage Service for offline functionality
import { defaultJobs } from '../data/defaultJobs';

export interface StoredJob {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  experience: string;
  salary: string;
  description: string;
  requirements: string[];
  posted: string;
  url: string;
  logo: string;
  remote: boolean;
  skills: string[];
  application_link?: string;
  created_at?: string;
  job_type?: string;
  isLocal?: boolean; // Flag to identify locally stored jobs
}

const JOBS_STORAGE_KEY = 'career_portal_jobs';
const LAST_SYNC_KEY = 'jobs_last_sync';

export class JobStorageService {
  // Save jobs to localStorage
  static saveJobs(jobs: StoredJob[]): void {
    try {
      localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(jobs));
      localStorage.setItem(LAST_SYNC_KEY, Date.now().toString());
    } catch (error) {
      console.error('Error saving jobs to storage:', error);
    }
  }

  // Get jobs from localStorage
  static getStoredJobs(): StoredJob[] {
    try {
      const stored = localStorage.getItem(JOBS_STORAGE_KEY);
      const storedJobs = stored ? JSON.parse(stored) : [];
      
      // If no stored jobs, return default jobs
      if (storedJobs.length === 0) {
        this.saveJobs(defaultJobs);
        return defaultJobs;
      }
      
      return storedJobs;
    } catch (error) {
      console.error('Error loading jobs from storage:', error);
      // Return default jobs on error
      this.saveJobs(defaultJobs);
      return defaultJobs;
    }
  }

  // Add a new job
  static addJob(job: Omit<StoredJob, 'id'>): StoredJob {
    const jobs = this.getStoredJobs();
    const newJob: StoredJob = {
      ...job,
      id: `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      isLocal: true,
      created_at: new Date().toISOString(),
      posted: 'Just now'
    };
    
    jobs.unshift(newJob);
    this.saveJobs(jobs);
    return newJob;
  }

  // Update an existing job
  static updateJob(jobId: string, updates: Partial<StoredJob>): boolean {
    const jobs = this.getStoredJobs();
    const jobIndex = jobs.findIndex(job => job.id === jobId);
    
    if (jobIndex !== -1) {
      jobs[jobIndex] = { ...jobs[jobIndex], ...updates };
      this.saveJobs(jobs);
      return true;
    }
    return false;
  }

  // Delete a job
  static deleteJob(jobId: string): boolean {
    const jobs = this.getStoredJobs();
    const filteredJobs = jobs.filter(job => job.id !== jobId);
    
    if (filteredJobs.length !== jobs.length) {
      this.saveJobs(filteredJobs);
      return true;
    }
    return false;
  }

  // Merge API jobs with stored jobs
  static mergeWithApiJobs(apiJobs: StoredJob[]): StoredJob[] {
    const storedJobs = this.getStoredJobs();
    const localJobs = storedJobs.filter(job => job.isLocal);
    
    // If no API jobs, return stored jobs (including defaults)
    if (!apiJobs || apiJobs.length === 0) {
      return storedJobs;
    }
    
    // Merge API jobs with local jobs and defaults
    const mergedJobs = [...apiJobs, ...localJobs, ...defaultJobs.filter(defaultJob => 
      !localJobs.some(localJob => localJob.id === defaultJob.id)
    )];
    
    // Save the merged list
    this.saveJobs(mergedJobs);
    
    return mergedJobs;
  }

  // Get last sync timestamp
  static getLastSync(): number {
    try {
      const lastSync = localStorage.getItem(LAST_SYNC_KEY);
      return lastSync ? parseInt(lastSync) : 0;
    } catch (error) {
      return 0;
    }
  }

  // Clear all jobs
  static clearAllJobs(): void {
    localStorage.removeItem(JOBS_STORAGE_KEY);
    localStorage.removeItem(LAST_SYNC_KEY);
  }

  // Initialize default jobs if none exist
  static initializeDefaultJobs(): void {
    const existingJobs = this.getStoredJobs();
    if (existingJobs.length === 0) {
      this.saveJobs(defaultJobs);
    }
  }
  
  // Get default jobs
  static getDefaultJobs(): StoredJob[] {
    return defaultJobs;
  }
}
