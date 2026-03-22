import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);         // logged-in user
  const [role, setRole] = useState(null);          // 'worker' | 'client'
  const [jobs, setJobs] = useState([              // all posted jobs
    {
      id: 1,
      title: 'House Painting',
      category: 'Painting',
      location: 'Sector 14, Noida',
      distance: 2.4,
      pay: 800,
      payType: 'daily',
      duration: '3 days',
      skills: ['Painting', 'Wall Finishing'],
      description: 'Need experienced painter for interior house painting. 2 BHK flat.',
      clientId: 'client1',
      clientName: 'Ramesh Gupta',
      clientRating: 4.2,
      postedAt: '2024-01-15',
      status: 'open',
      applicants: [],
      urgency: 'normal',
    },
    {
      id: 2,
      title: 'Electrical Wiring Work',
      category: 'Electrician',
      location: 'Indirapuram, Ghaziabad',
      distance: 5.1,
      pay: 1200,
      payType: 'daily',
      duration: '2 days',
      skills: ['Wiring', 'Electrician'],
      description: 'Complete electrical work for new office space. Must have experience.',
      clientId: 'client2',
      clientName: 'Sunita Sharma',
      clientRating: 4.8,
      postedAt: '2024-01-14',
      status: 'open',
      applicants: [],
      urgency: 'urgent',
    },
    {
      id: 3,
      title: 'Plumbing Repair',
      category: 'Plumbing',
      location: 'Vasundhara, Ghaziabad',
      distance: 3.7,
      pay: 600,
      payType: 'daily',
      duration: '1 day',
      skills: ['Plumbing', 'Pipe Fitting'],
      description: 'Kitchen and bathroom plumbing repair work needed urgently.',
      clientId: 'client1',
      clientName: 'Ramesh Gupta',
      clientRating: 4.2,
      postedAt: '2024-01-13',
      status: 'open',
      applicants: [],
      urgency: 'urgent',
    },
    {
      id: 4,
      title: 'Carpentry – Door/Window Repair',
      category: 'Carpentry',
      location: 'Raj Nagar, Ghaziabad',
      distance: 7.2,
      pay: 900,
      payType: 'daily',
      duration: '2 days',
      skills: ['Carpentry', 'Wood Work'],
      description: '3 doors and 2 windows need repair. Must bring own tools.',
      clientId: 'client3',
      clientName: 'Priya Mehta',
      clientRating: 3.9,
      postedAt: '2024-01-12',
      status: 'open',
      applicants: [],
      urgency: 'normal',
    },
    {
      id: 5,
      title: 'AC Installation & Service',
      category: 'AC Technician',
      location: 'Crossings Republik, Ghaziabad',
      distance: 9.8,
      pay: 1500,
      payType: 'fixed',
      duration: '1 day',
      skills: ['AC Repair', 'Electrician'],
      description: 'Install 2 new ACs and service 3 existing units.',
      clientId: 'client2',
      clientName: 'Sunita Sharma',
      clientRating: 4.8,
      postedAt: '2024-01-11',
      status: 'open',
      applicants: [],
      urgency: 'normal',
    },
  ]);

  const [applications, setApplications] = useState([]); // worker applications
  const [reviews, setReviews] = useState([]);

  const workerProfile = {
    name: 'Raju Mistri',
    phone: '9876543210',
    skills: ['Painting', 'Wall Finishing'],
    experience: 5,
    rating: 4.3,
    location: 'Sector 62, Noida',
    availability: true,
    jobsDone: 42,
    avatar: null,
  };

  function postJob(job) {
    const newJob = { ...job, id: Date.now(), applicants: [], status: 'open', postedAt: new Date().toISOString().split('T')[0] };
    setJobs(prev => [newJob, ...prev]);
    return newJob;
  }

  function applyToJob(jobId, workerData) {
    const app = { id: Date.now(), jobId, workerData, status: 'pending', appliedAt: new Date().toISOString().split('T')[0] };
    setApplications(prev => [...prev, app]);
    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, applicants: [...(j.applicants || []), app] } : j));
    return app;
  }

  function hireWorker(jobId, applicationId) {
    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: 'assigned', hiredApplicationId: applicationId } : j));
    setApplications(prev => prev.map(a => a.id === applicationId ? { ...a, status: 'hired' } : a));
  }

  function submitReview(review) {
    setReviews(prev => [...prev, { ...review, id: Date.now() }]);
  }

  return (
    <AppContext.Provider value={{
      user, setUser, role, setRole,
      jobs, postJob, applyToJob, hireWorker,
      applications, workerProfile,
      reviews, submitReview,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
