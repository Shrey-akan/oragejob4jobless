import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-headerdashboardemp',
  templateUrl: './headerdashboardemp.component.html',
  styleUrls: ['./headerdashboardemp.component.css']
})
export class HeaderdashboardempComponent implements OnInit{
  showNavbaremp= true;
  constructor(private router: Router,private http: HttpClient) {}

  ngOnInit() {

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const currentRoute = event.urlAfterRedirects;

        // Check if the current route is 'employer'
        this.showNavbaremp = !['/employers/sign-in-checkemp'].includes(currentRoute);    
      }
    });
  }
  logoutEmployer() {
    // Make an HTTP POST request to your logout endpoint
    this.http.post('http://localhost:9001/logoutEmployer', null).subscribe(
   {
    next:   (response:any) => {
      // Handle the successful logout response, e.g., navigate to a login page
      console.log('Logout successful', response);
      alert(response);
      this.router.navigate(['/employer']);
      // You can also clear any local employer-related data here if needed
    },
   error: (err:any) => {
      // Handle errors if the logout request fails
      console.error('Logout error', err);
    }
   }
    );
  }
}
