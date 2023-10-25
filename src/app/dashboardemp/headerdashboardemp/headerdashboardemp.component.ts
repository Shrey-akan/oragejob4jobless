import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-headerdashboardemp',
  templateUrl: './headerdashboardemp.component.html',
  styleUrls: ['./headerdashboardemp.component.css']
})
export class HeaderdashboardempComponent implements OnInit {
  showNavbaremp = true;
  constructor(private router: Router, private http: HttpClient, private cookie:CookieService) { }

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
    // Retrieve the refresh token from the cookie
    const refreshToken = this.cookie.get('refreshToken');
    console.log('Refresh token:', refreshToken);
  
    // Ensure refreshToken is not empty
    if (!refreshToken) {
      console.log('Refresh token is missing.');
      return;
    }
  
    // Make the logout request with the refresh token as a request parameter
    this.http.post('http://localhost:9001/logoutEmployer', null, {
      params: { refreshToken: refreshToken },
      responseType: 'text' // Specify the response type as 'text'
    }).subscribe({
      next: (response: string) => {
        console.log('Logout response:', response);
  
        // Assuming the response is a simple message like "Logout successful"
        if (response === 'Logout successful') {
          // Handle the successful logout response
          console.log('Logout successful');
  
          // Clear cookies
          this.cookie.delete('emp');
          this.cookie.delete('accessToken');
  
          // Navigate to the employer login page or any other desired route
          this.router.navigate(['/employer']);
        } else {
          // Handle other responses or errors
          console.log('Logout failed:', response);
        }
      },
      error: (error) => {
        // Handle errors if the logout request fails
        console.log('Logout error', error);
        console.log('HTTP Status:', error.status);
        console.log('Error Message:', error.message);
        // You can add additional error handling here if needed
      }
    });
  }
  
}
