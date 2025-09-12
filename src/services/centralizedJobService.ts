// Centralized Job Storage Service
export interface CentralizedJob {
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
  created_at: string;
  updated_at: string;
  source: 'api' | 'admin' | 'default';
  isActive: boolean;
  views: number;
  applications: number;
}

export interface JobStats {
  totalJobs: number;
  activeJobs: number;
  totalViews: number;
  totalApplications: number;
  topSkills: string[];
  topCompanies: string[];
  averageSalary: string;
}

class CentralizedJobService {
  private static instance: CentralizedJobService;
  private jobs: CentralizedJob[] = [];
  private lastSync: number = 0;
  private syncInterval: number = 5 * 60 * 1000; // 5 minutes
  private storageKey = 'centralized_jobs_v2';
  private statsKey = 'job_stats_v2';

  private constructor() {
    this.loadFromStorage();
    this.initializeDefaultJobs();
    this.startPeriodicSync();
  }

  public static getInstance(): CentralizedJobService {
    if (!CentralizedJobService.instance) {
      CentralizedJobService.instance = new CentralizedJobService();
    }
    return CentralizedJobService.instance;
  }

  // Load jobs from localStorage
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const data = JSON.parse(stored);
        this.jobs = data.jobs || [];
        this.lastSync = data.lastSync || 0;
      }
    } catch (error) {
      console.error('Error loading jobs from storage:', error);
      this.jobs = [];
    }
  }

  // Save jobs to localStorage
  private saveToStorage(): void {
    try {
      const data = {
        jobs: this.jobs,
        lastSync: this.lastSync,
        version: '2.0'
      };
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving jobs to storage:', error);
    }
  }

  // Initialize with default jobs if empty
  private initializeDefaultJobs(): void {
    if (this.jobs.length === 0) {
      const defaultJobs = this.getDefaultJobs();
      this.jobs = defaultJobs;
      this.saveToStorage();
    }
  }

  // Start periodic sync with API
  private startPeriodicSync(): void {
    // Initial sync
    this.syncWithAPI();
    
    // Periodic sync
    setInterval(() => {
      this.syncWithAPI();
    }, this.syncInterval);
  }

  // Sync with external API
  private async syncWithAPI(): Promise<void> {
    try {
      const response = await fetch('https://warriors-dictionaries-controls-execute.trycloudflare.com/jobs', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const apiData = await response.json();
        const apiJobs = this.normalizeAPIJobs(Array.isArray(apiData) ? apiData : (apiData.jobs || []));
        
        // Merge API jobs with existing jobs
        this.mergeAPIJobs(apiJobs);
        this.lastSync = Date.now();
        this.saveToStorage();
        
        console.log(`Synced ${apiJobs.length} jobs from API`);
      }
    } catch (error) {
      console.error('API sync failed:', error);
      // Continue with cached jobs
    }
  }

  // Normalize API job data
  private normalizeAPIJobs(apiJobs: any[]): CentralizedJob[] {
    return apiJobs.map((job: any, index: number) => ({
      id: job.id || `api-${Date.now()}-${index}`,
      title: job.title || 'Job Position',
      company: job.company || 'Company',
      location: job.location || 'Remote',
      type: job.job_type || job.type || 'full-time',
      experience: job.experience || job.experience_level || 'Not specified',
      salary: job.salary || job.salary_range || 'Competitive',
      description: job.description || 'No description available',
      requirements: job.requirements || job.skills || [],
      posted: this.formatDate(job.created_at) || 'Recently',
      url: job.application_link || job.url || '#',
      logo: job.logo || job.company_logo || '',
      remote: job.remote || job.is_remote || false,
      skills: job.skills || job.requirements || [],
      application_link: job.application_link,
      created_at: job.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
      source: 'api',
      isActive: true,
      views: 0,
      applications: 0
    }));
  }

  // Merge API jobs with existing jobs
  private mergeAPIJobs(apiJobs: CentralizedJob[]): void {
    // Keep admin and default jobs
    const localJobs = this.jobs.filter(job => job.source !== 'api');
    
    // Add new API jobs
    this.jobs = [...localJobs, ...apiJobs];
    
    // Remove duplicates based on title and company
    const uniqueJobs = new Map<string, CentralizedJob>();
    this.jobs.forEach(job => {
      const key = `${job.title}-${job.company}`.toLowerCase();
      if (!uniqueJobs.has(key) || job.source === 'admin') {
        uniqueJobs.set(key, job);
      }
    });
    
    this.jobs = Array.from(uniqueJobs.values());
  }

  // Get default jobs
  private getDefaultJobs(): CentralizedJob[] {
    const defaultJobsData = [
      {
        title: 'Senior Software Engineer',
        company: 'Google India',
        location: 'Bangalore, Karnataka',
        type: 'full-time',
        experience: '5+ years',
        salary: '₹25-40 LPA',
        description: 'Join our team to build scalable systems that serve billions of users worldwide. Work on cutting-edge technologies and solve complex problems.',
        requirements: ['Bachelor\'s degree in Computer Science', '5+ years of experience', 'Strong algorithms knowledge'],
        skills: ['JavaScript', 'Python', 'System Design', 'Distributed Systems'],
        logo: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=100',
        remote: true,
        url: 'https://careers.google.com'
      },
      {
        title: 'Full Stack Developer',
        company: 'Microsoft India',
        location: 'Hyderabad, Telangana',
        type: 'full-time',
        experience: '3-5 years',
        salary: '₹20-35 LPA',
        description: 'Develop end-to-end solutions using modern web technologies. Work with cross-functional teams.',
        requirements: ['React and Node.js experience', 'Cloud platform knowledge', 'Agile development'],
        skills: ['React', 'Node.js', 'TypeScript', 'Azure', 'MongoDB'],
        logo: 'https://images.pexels.com/photos/4348401/pexels-photo-4348401.jpeg?auto=compress&cs=tinysrgb&w=100',
        remote: true,
        url: 'https://careers.microsoft.com'
      },
      {
        title: 'Frontend Developer',
        company: 'Flipkart',
        location: 'Bangalore, Karnataka',
        type: 'full-time',
        experience: '2-4 years',
        salary: '₹15-25 LPA',
        description: 'Create amazing user experiences for millions of customers. Work with design teams.',
        requirements: ['React.js proficiency', 'Modern CSS frameworks', 'Responsive design'],
        skills: ['React', 'JavaScript', 'CSS', 'HTML', 'Redux'],
        logo: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=100',
        remote: false,
        url: 'https://www.flipkartcareers.com'
      }
    ];

    return defaultJobsData.map((job, index) => ({
      id: `default-${index}`,
      ...job,
      application_link: job.url,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      posted: 'Recently',
      source: 'default' as const,
      isActive: true,
      views: Math.floor(Math.random() * 100),
      applications: Math.floor(Math.random() * 20)
    }));
  }

  // Format date helper
  private formatDate(dateString?: string): string {
    if (!dateString) return 'Recently';
    
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) return '1 day ago';
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
      return `${Math.ceil(diffDays / 30)} months ago`;
    } catch (error) {
      return 'Recently';
    }
  }

  // Public methods
  public getAllJobs(): CentralizedJob[] {
    return this.jobs.filter(job => job.isActive);
  }

  public searchJobs(query: string = '', filters: any = {}): CentralizedJob[] {
    let filteredJobs = this.getAllJobs();

    // Apply search query
    if (query) {
      const searchTerm = query.toLowerCase();
      filteredJobs = filteredJobs.filter(job => 
        job.title.toLowerCase().includes(searchTerm) ||
        job.company.toLowerCase().includes(searchTerm) ||
        job.description.toLowerCase().includes(searchTerm) ||
        job.skills.some(skill => skill.toLowerCase().includes(searchTerm))
      );
    }

    // Apply filters
    if (filters.location) {
      filteredJobs = filteredJobs.filter(job => 
        job.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.type) {
      filteredJobs = filteredJobs.filter(job => job.type === filters.type);
    }

    if (filters.remote !== undefined) {
      filteredJobs = filteredJobs.filter(job => job.remote === filters.remote);
    }

    if (filters.skills && filters.skills.length > 0) {
      filteredJobs = filteredJobs.filter(job =>
        filters.skills.some((skill: string) =>
          job.skills.some(jobSkill => 
            jobSkill.toLowerCase().includes(skill.toLowerCase())
          )
        )
      );
    }

    return filteredJobs.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  public getJobById(id: string): CentralizedJob | null {
    return this.jobs.find(job => job.id === id) || null;
  }

  public addJob(jobData: Omit<CentralizedJob, 'id' | 'created_at' | 'updated_at' | 'views' | 'applications'>): CentralizedJob {
    const newJob: CentralizedJob = {
      ...jobData,
      id: `admin-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      views: 0,
      applications: 0
    };

    this.jobs.unshift(newJob);
    this.saveToStorage();
    return newJob;
  }

  public updateJob(id: string, updates: Partial<CentralizedJob>): boolean {
    const jobIndex = this.jobs.findIndex(job => job.id === id);
    if (jobIndex !== -1) {
      this.jobs[jobIndex] = {
        ...this.jobs[jobIndex],
        ...updates,
        updated_at: new Date().toISOString()
      };
      this.saveToStorage();
      return true;
    }
    return false;
  }

  public deleteJob(id: string): boolean {
    const initialLength = this.jobs.length;
    this.jobs = this.jobs.filter(job => job.id !== id);
    
    if (this.jobs.length !== initialLength) {
      this.saveToStorage();
      return true;
    }
    return false;
  }

  public incrementJobView(id: string): void {
    const job = this.jobs.find(job => job.id === id);
    if (job) {
      job.views += 1;
      job.updated_at = new Date().toISOString();
      this.saveToStorage();
    }
  }

  public incrementJobApplication(id: string): void {
    const job = this.jobs.find(job => job.id === id);
    if (job) {
      job.applications += 1;
      job.updated_at = new Date().toISOString();
      this.saveToStorage();
    }
  }

  public getJobStats(): JobStats {
    const activeJobs = this.getAllJobs();
    
    // Calculate top skills
    const skillCount = new Map<string, number>();
    activeJobs.forEach(job => {
      job.skills.forEach(skill => {
        skillCount.set(skill, (skillCount.get(skill) || 0) + 1);
      });
    });
    
    const topSkills = Array.from(skillCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([skill]) => skill);

    // Calculate top companies
    const companyCount = new Map<string, number>();
    activeJobs.forEach(job => {
      companyCount.set(job.company, (companyCount.get(job.company) || 0) + 1);
    });
    
    const topCompanies = Array.from(companyCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([company]) => company);

    return {
      totalJobs: this.jobs.length,
      activeJobs: activeJobs.length,
      totalViews: this.jobs.reduce((sum, job) => sum + job.views, 0),
      totalApplications: this.jobs.reduce((sum, job) => sum + job.applications, 0),
      topSkills,
      topCompanies,
      averageSalary: '₹12-25 LPA'
    };
  }

  public async forceSyncWithAPI(): Promise<boolean> {
    try {
      await this.syncWithAPI();
      return true;
    } catch (error) {
      console.error('Force sync failed:', error);
      return false;
    }
  }

  public getLastSyncTime(): number {
    return this.lastSync;
  }

  public isOnline(): boolean {
    return navigator.onLine;
  }

  // Export jobs for backup
  public exportJobs(): string {
    return JSON.stringify({
      jobs: this.jobs,
      exportDate: new Date().toISOString(),
      version: '2.0'
    }, null, 2);
  }

  // Import jobs from backup
  public importJobs(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      if (data.jobs && Array.isArray(data.jobs)) {
        this.jobs = data.jobs;
        this.saveToStorage();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Import failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const centralizedJobService = CentralizedJobService.getInstance();

// Export convenience functions
export const getAllJobs = () => centralizedJobService.getAllJobs();
export const searchCentralizedJobs = (query: string, filters: any) => centralizedJobService.searchJobs(query, filters);
export const getJobById = (id: string) => centralizedJobService.getJobById(id);
export const addCentralizedJob = (job: any) => centralizedJobService.addJob(job);
export const updateCentralizedJob = (id: string, updates: any) => centralizedJobService.updateJob(id, updates);
export const deleteCentralizedJob = (id: string) => centralizedJobService.deleteJob(id);
export const getJobStats = () => centralizedJobService.getJobStats();
export const incrementJobView = (id: string) => centralizedJobService.incrementJobView(id);
export const incrementJobApplication = (id: string) => centralizedJobService.incrementJobApplication(id);
