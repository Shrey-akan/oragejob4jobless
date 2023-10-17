import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-headeruser',
  templateUrl: './headeruser.component.html',
  styleUrls: ['./headeruser.component.css']
})
export class HeaderuserComponent implements OnInit {
  userEmail!: string;
  accessToken: string | null;
  uid: string | null;

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {
    // Initialize properties from local storage
    this.accessToken = localStorage.getItem('accessToken');
    this.uid = localStorage.getItem('uid');
  }

  ngOnInit() {
    // Retrieve the email from the query parameters
    this.route.queryParams.subscribe(params => {
      this.userEmail = params['email'];
    });
  }
  logout() {
    // Make an HTTP POST request to your logout endpoint
    this.http.post('https://job4jobless.com/logout', null).subscribe({
      next: (response: any) => {
        // Handle the successful logout response, e.g., navigate to a login page
        console.log('Logout successful', response);

        // Clear the uid and access token from local storage
        localStorage.removeItem('uid');
        localStorage.removeItem('accessToken');

        // Navigate to the desired page (e.g., home or login)
        this.router.navigate(['/']); // Change the route as needed
      },
      error: (error) => {
        // Handle errors if the logout request fails
        console.log('Logout error', error);
      }
    });
  }
  signto() {
    this.router.navigate(['/']);
  }

}
