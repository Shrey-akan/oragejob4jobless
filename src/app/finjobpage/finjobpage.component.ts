import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../auth/user.service';
interface Job {
  jobtitle: string;
  companyforthisjob: string;
  numberofopening: string;
  locationjob: string;
  descriptiondata: string[];
  jobtype: string;
  schedulejob: string;
  payjob: string;
  payjobsup: string;
}
@Component({
  selector: 'app-finjobpage',
  templateUrl: './finjobpage.component.html',
  styleUrls: ['./finjobpage.component.css']
})
export class FinjobpageComponent implements OnInit {
  data1: any;

  searchQuery: string = ''; // The search query input field value
  jobs: Job[] = []; // Array to store filtered job listings
  locationJob: string = ''; // Initialize locationJob
  showFooter = true;
  showJobFeed = true;
  showJobSearches = false;
  selectedJob: Job | null = null;
  data: Job[] = [];



  showContainer(containerId: string): void {
    this.showJobFeed = false;
    this.showJobSearches = false;

    if (containerId === 'jbfeed') {
      this.showJobFeed = true;
    } else if (containerId === 'showsearches') {
      this.showJobSearches = true;
    }
  }

  constructor(private router: Router, private b1: UserService,private route: ActivatedRoute) { }

  selectJob(data: Job): void {
    this.selectedJob = data;
  }

  ngOnInit(): void {
    let response = this.b1.fetchjobpost();
    response.subscribe((data1: any) => {
      this.data1 = data1;
      // Initialize data with all jobs initially
      this.data = data1;
    });

    // Check if locationJob is provided in the route
    this.route.params.subscribe((params) => {
      this.locationJob = params['locationjob'];
      this.filterJobsByLocation();
    });
  }



  navigateToSignIn() {
    // Replace 'sign-in' with the actual route name of your sign-in page
    this.router.navigate(['/login']);
  }

  showTrending = false;

  toggleTrending() {
    this.showTrending = !this.showTrending;
  }

  filterJobsByLocation() {
    console.log('Location Job:', this.locationJob); // Log the locationJob
    if (!this.locationJob) {
      // If no locationJob provided, show all jobs
      this.jobs = this.data;
    } else {
      console.log("inside else statement");
      // Implement your filtering logic here based on locationJob
      this.jobs = this.data.filter((job) => job.locationjob === this.locationJob);
    }
  }
  
}
