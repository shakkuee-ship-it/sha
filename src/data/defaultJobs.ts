export interface DefaultJob {
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
  isLocal?: boolean;
}

export const defaultJobs: DefaultJob[] = [
  {
    id: 'job-1',
    title: 'Senior Software Engineer',
    company: 'Google India',
    location: 'Bangalore, Karnataka',
    type: 'full-time',
    experience: '5+ years',
    salary: '₹25-40 LPA',
    description: 'Join our team to build scalable systems that serve billions of users worldwide. Work on cutting-edge technologies and solve complex problems.',
    requirements: [
      'Bachelor\'s degree in Computer Science or related field',
      '5+ years of software development experience',
      'Strong knowledge of algorithms and data structures',
      'Experience with distributed systems',
      'Excellent problem-solving skills'
    ],
    posted: '2 days ago',
    url: 'https://careers.google.com',
    logo: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=100',
    remote: true,
    skills: ['JavaScript', 'Python', 'System Design', 'Distributed Systems', 'Algorithms'],
    application_link: 'https://careers.google.com',
    created_at: new Date().toISOString(),
    job_type: 'full-time',
    isLocal: true
  },
  {
    id: 'job-2',
    title: 'Full Stack Developer',
    company: 'Microsoft India',
    location: 'Hyderabad, Telangana',
    type: 'full-time',
    experience: '3-5 years',
    salary: '₹20-35 LPA',
    description: 'Develop end-to-end solutions using modern web technologies. Work with cross-functional teams to deliver high-quality products.',
    requirements: [
      'Experience with React and Node.js',
      'Knowledge of cloud platforms (Azure preferred)',
      'Strong understanding of web technologies',
      'Experience with agile development',
      'Good communication skills'
    ],
    posted: '1 day ago',
    url: 'https://careers.microsoft.com',
    logo: 'https://images.pexels.com/photos/4348401/pexels-photo-4348401.jpeg?auto=compress&cs=tinysrgb&w=100',
    remote: true,
    skills: ['React', 'Node.js', 'TypeScript', 'Azure', 'MongoDB'],
    application_link: 'https://careers.microsoft.com',
    created_at: new Date().toISOString(),
    job_type: 'full-time',
    isLocal: true
  },
  {
    id: 'job-3',
    title: 'Frontend Developer',
    company: 'Flipkart',
    location: 'Bangalore, Karnataka',
    type: 'full-time',
    experience: '2-4 years',
    salary: '₹15-25 LPA',
    description: 'Create amazing user experiences for millions of customers. Work with design teams to implement pixel-perfect interfaces.',
    requirements: [
      'Strong proficiency in React.js',
      'Experience with modern CSS frameworks',
      'Knowledge of responsive design',
      'Understanding of web performance optimization',
      'Experience with testing frameworks'
    ],
    posted: '3 days ago',
    url: 'https://www.flipkartcareers.com',
    logo: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=100',
    remote: false,
    skills: ['React', 'JavaScript', 'CSS', 'HTML', 'Redux'],
    application_link: 'https://www.flipkartcareers.com',
    created_at: new Date().toISOString(),
    job_type: 'full-time',
    isLocal: true
  },
  {
    id: 'job-4',
    title: 'Backend Developer',
    company: 'Zomato',
    location: 'Gurgaon, Haryana',
    type: 'full-time',
    experience: '2-5 years',
    salary: '₹12-22 LPA',
    description: 'Build robust backend systems that power food delivery for millions. Work with microservices and high-scale architectures.',
    requirements: [
      'Experience with Node.js or Python',
      'Knowledge of database design',
      'Understanding of microservices architecture',
      'Experience with API development',
      'Knowledge of cloud platforms'
    ],
    posted: '1 week ago',
    url: 'https://www.zomato.com/careers',
    logo: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=100',
    remote: true,
    skills: ['Node.js', 'Python', 'MongoDB', 'AWS', 'Docker'],
    application_link: 'https://www.zomato.com/careers',
    created_at: new Date().toISOString(),
    job_type: 'full-time',
    isLocal: true
  },
  {
    id: 'job-5',
    title: 'Data Scientist',
    company: 'Amazon India',
    location: 'Mumbai, Maharashtra',
    type: 'full-time',
    experience: '3-6 years',
    salary: '₹18-30 LPA',
    description: 'Use machine learning and data analysis to solve complex business problems. Work with large datasets and build predictive models.',
    requirements: [
      'Strong background in statistics and mathematics',
      'Experience with Python and R',
      'Knowledge of machine learning algorithms',
      'Experience with big data technologies',
      'Strong analytical and problem-solving skills'
    ],
    posted: '5 days ago',
    url: 'https://amazon.jobs',
    logo: 'https://images.pexels.com/photos/4348404/pexels-photo-4348404.jpeg?auto=compress&cs=tinysrgb&w=100',
    remote: true,
    skills: ['Python', 'Machine Learning', 'SQL', 'TensorFlow', 'Statistics'],
    application_link: 'https://amazon.jobs',
    created_at: new Date().toISOString(),
    job_type: 'full-time',
    isLocal: true
  },
  {
    id: 'job-6',
    title: 'DevOps Engineer',
    company: 'Paytm',
    location: 'Noida, Uttar Pradesh',
    type: 'full-time',
    experience: '3-5 years',
    salary: '₹16-28 LPA',
    description: 'Manage and optimize our cloud infrastructure. Implement CI/CD pipelines and ensure system reliability.',
    requirements: [
      'Experience with AWS/Azure/GCP',
      'Knowledge of containerization (Docker, Kubernetes)',
      'Experience with CI/CD tools',
      'Understanding of infrastructure as code',
      'Strong scripting skills'
    ],
    posted: '4 days ago',
    url: 'https://jobs.paytm.com',
    logo: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=100',
    remote: true,
    skills: ['AWS', 'Docker', 'Kubernetes', 'Jenkins', 'Terraform'],
    application_link: 'https://jobs.paytm.com',
    created_at: new Date().toISOString(),
    job_type: 'full-time',
    isLocal: true
  },
  {
    id: 'job-7',
    title: 'Product Manager',
    company: 'Swiggy',
    location: 'Bangalore, Karnataka',
    type: 'full-time',
    experience: '4-7 years',
    salary: '₹22-35 LPA',
    description: 'Lead product strategy and development for our food delivery platform. Work with engineering and design teams.',
    requirements: [
      'MBA or equivalent experience',
      'Experience in product management',
      'Strong analytical skills',
      'Understanding of user experience',
      'Excellent communication skills'
    ],
    posted: '1 week ago',
    url: 'https://careers.swiggy.com',
    logo: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=100',
    remote: false,
    skills: ['Product Management', 'Analytics', 'Strategy', 'User Research', 'Agile'],
    application_link: 'https://careers.swiggy.com',
    created_at: new Date().toISOString(),
    job_type: 'full-time',
    isLocal: true
  },
  {
    id: 'job-8',
    title: 'UI/UX Designer',
    company: 'Razorpay',
    location: 'Bangalore, Karnataka',
    type: 'full-time',
    experience: '2-4 years',
    salary: '₹12-20 LPA',
    description: 'Design intuitive user interfaces for our fintech products. Create user-centered designs that solve complex problems.',
    requirements: [
      'Proficiency in design tools (Figma, Sketch)',
      'Understanding of user experience principles',
      'Experience with design systems',
      'Knowledge of frontend technologies',
      'Strong portfolio of design work'
    ],
    posted: '6 days ago',
    url: 'https://razorpay.com/careers',
    logo: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=100',
    remote: true,
    skills: ['Figma', 'Sketch', 'User Research', 'Prototyping', 'Design Systems'],
    application_link: 'https://razorpay.com/careers',
    created_at: new Date().toISOString(),
    job_type: 'full-time',
    isLocal: true
  },
  {
    id: 'job-9',
    title: 'Mobile App Developer',
    company: 'PhonePe',
    location: 'Bangalore, Karnataka',
    type: 'full-time',
    experience: '3-5 years',
    salary: '₹18-30 LPA',
    description: 'Develop mobile applications for our digital payments platform. Work with native and cross-platform technologies.',
    requirements: [
      'Experience with React Native or Flutter',
      'Knowledge of native mobile development',
      'Understanding of mobile app architecture',
      'Experience with payment integrations',
      'Strong debugging and testing skills'
    ],
    posted: '3 days ago',
    url: 'https://www.phonepe.com/careers',
    logo: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=100',
    remote: true,
    skills: ['React Native', 'Flutter', 'iOS', 'Android', 'JavaScript'],
    application_link: 'https://www.phonepe.com/careers',
    created_at: new Date().toISOString(),
    job_type: 'full-time',
    isLocal: true
  },
  {
    id: 'job-10',
    title: 'Machine Learning Engineer',
    company: 'Ola',
    location: 'Bangalore, Karnataka',
    type: 'full-time',
    experience: '3-6 years',
    salary: '₹20-32 LPA',
    description: 'Build ML models for ride optimization and demand forecasting. Work with large-scale data and real-time systems.',
    requirements: [
      'Strong background in machine learning',
      'Experience with Python and ML frameworks',
      'Knowledge of big data technologies',
      'Understanding of real-time systems',
      'Experience with cloud ML platforms'
    ],
    posted: '2 days ago',
    url: 'https://www.olacabs.com/careers',
    logo: 'https://images.pexels.com/photos/3184317/pexels-photo-3184317.jpeg?auto=compress&cs=tinysrgb&w=100',
    remote: true,
    skills: ['Python', 'TensorFlow', 'PyTorch', 'Spark', 'AWS'],
    application_link: 'https://www.olacabs.com/careers',
    created_at: new Date().toISOString(),
    job_type: 'full-time',
    isLocal: true
  },
  {
    id: 'job-11',
    title: 'Frontend Developer Intern',
    company: 'Byju\'s',
    location: 'Bangalore, Karnataka',
    type: 'internship',
    experience: '0-1 years',
    salary: '₹25,000-40,000/month',
    description: 'Learn and contribute to our educational platform. Work with experienced developers on real projects.',
    requirements: [
      'Basic knowledge of HTML, CSS, JavaScript',
      'Familiarity with React.js',
      'Good problem-solving skills',
      'Eagerness to learn',
      'Currently pursuing or recently completed degree'
    ],
    posted: '1 day ago',
    url: 'https://byjus.com/careers',
    logo: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=100',
    remote: true,
    skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Git'],
    application_link: 'https://byjus.com/careers',
    created_at: new Date().toISOString(),
    job_type: 'internship',
    isLocal: true
  },
  {
    id: 'job-12',
    title: 'Quality Assurance Engineer',
    company: 'Freshworks',
    location: 'Chennai, Tamil Nadu',
    type: 'full-time',
    experience: '2-4 years',
    salary: '₹10-18 LPA',
    description: 'Ensure the quality of our SaaS products through comprehensive testing strategies and automation.',
    requirements: [
      'Experience with manual and automated testing',
      'Knowledge of testing frameworks',
      'Understanding of web technologies',
      'Experience with bug tracking tools',
      'Strong attention to detail'
    ],
    posted: '5 days ago',
    url: 'https://www.freshworks.com/careers',
    logo: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=100',
    remote: true,
    skills: ['Selenium', 'Jest', 'Cypress', 'API Testing', 'Automation'],
    application_link: 'https://www.freshworks.com/careers',
    created_at: new Date().toISOString(),
    job_type: 'full-time',
    isLocal: true
  },
  {
    id: 'job-13',
    title: 'Cloud Solutions Architect',
    company: 'Infosys',
    location: 'Pune, Maharashtra',
    type: 'full-time',
    experience: '6+ years',
    salary: '₹25-45 LPA',
    description: 'Design and implement cloud solutions for enterprise clients. Lead technical discussions and architecture decisions.',
    requirements: [
      'Extensive experience with cloud platforms',
      'Strong understanding of enterprise architecture',
      'Experience with containerization and orchestration',
      'Knowledge of security best practices',
      'Excellent client-facing skills'
    ],
    posted: '1 week ago',
    url: 'https://www.infosys.com/careers',
    logo: 'https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg?auto=compress&cs=tinysrgb&w=100',
    remote: false,
    skills: ['AWS', 'Azure', 'Kubernetes', 'Microservices', 'Architecture'],
    application_link: 'https://www.infosys.com/careers',
    created_at: new Date().toISOString(),
    job_type: 'full-time',
    isLocal: true
  },
  {
    id: 'job-14',
    title: 'Digital Marketing Specialist',
    company: 'Myntra',
    location: 'Bangalore, Karnataka',
    type: 'full-time',
    experience: '2-4 years',
    salary: '₹8-15 LPA',
    description: 'Drive digital marketing campaigns for fashion and lifestyle brands. Manage social media and performance marketing.',
    requirements: [
      'Experience with digital marketing tools',
      'Knowledge of SEO and SEM',
      'Understanding of social media marketing',
      'Experience with analytics tools',
      'Creative thinking and data-driven approach'
    ],
    posted: '4 days ago',
    url: 'https://careers.myntra.com',
    logo: 'https://images.pexels.com/photos/3184394/pexels-photo-3184394.jpeg?auto=compress&cs=tinysrgb&w=100',
    remote: true,
    skills: ['Digital Marketing', 'SEO', 'Google Ads', 'Analytics', 'Social Media'],
    application_link: 'https://careers.myntra.com',
    created_at: new Date().toISOString(),
    job_type: 'full-time',
    isLocal: true
  },
  {
    id: 'job-15',
    title: 'Cybersecurity Analyst',
    company: 'TCS',
    location: 'Mumbai, Maharashtra',
    type: 'full-time',
    experience: '3-5 years',
    salary: '₹14-25 LPA',
    description: 'Protect our systems and client data from cyber threats. Monitor security incidents and implement security measures.',
    requirements: [
      'Knowledge of cybersecurity frameworks',
      'Experience with security tools and technologies',
      'Understanding of network security',
      'Incident response experience',
      'Relevant security certifications preferred'
    ],
    posted: '6 days ago',
    url: 'https://www.tcs.com/careers',
    logo: 'https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg?auto=compress&cs=tinysrgb&w=100',
    remote: false,
    skills: ['Cybersecurity', 'Network Security', 'Incident Response', 'SIEM', 'Penetration Testing'],
    application_link: 'https://www.tcs.com/careers',
    created_at: new Date().toISOString(),
    job_type: 'full-time',
    isLocal: true
  }
];
