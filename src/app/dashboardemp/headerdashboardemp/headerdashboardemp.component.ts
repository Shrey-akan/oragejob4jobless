import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-headerdashboardemp',
  templateUrl: './headerdashboardemp.component.html',
  styleUrls: ['./headerdashboardemp.component.css']
})
export class HeaderdashboardempComponent implements OnInit {
  showNavbaremp = true;
  constructor(private router: Router, private http: HttpClient) { }

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
    this.http.post('https://job4jobless.com/logoutEmployer', null).subscribe(
      {
        next: (response: any) => {
          // Handle the successful logout response, e.g., navigate to a login page
          console.log('Logout successful', response);
          alert(response);
          
          // Clear employer-related data from local storage
          localStorage.removeItem('empid');
          localStorage.removeItem('accessToken');
          
          this.router.navigate(['/employer']);
        },
        error: (err: any) => {
          // Handle errors if the logout request fails
          console.error('Logout error', err);
        }
      }
    );
  }
  
}
