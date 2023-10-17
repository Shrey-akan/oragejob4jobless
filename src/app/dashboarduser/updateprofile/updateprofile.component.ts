import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { catchError, throwError } from 'rxjs';
import { UserService } from 'src/app/auth/user.service';

interface User {
  uid: Number;
  userName: String;
  userFirstName: String;
  userLastName: String;
  userPassword: String;
  companyuser: String;
  websiteuser: String;
  userphone: String;
  usercountry: String;
  userstate: String;
  usercity: String;
}

@Component({
  selector: 'app-updateprofile',
  templateUrl: './updateprofile.component.html',
  styleUrls: ['./updateprofile.component.css']
})
export class UpdateprofileComponent implements OnInit {
  userform!: FormGroup;
  userData1: any;
  abc: any;

  constructor(
    private formBuilder: FormBuilder,
    private b1: UserService,
    private route: ActivatedRoute,
    private router: Router,
    public cookie: CookieService
  ) {}

  userID: String = "0";

  ngOnInit() {
    this.userID = this.cookie.get('user');
    console.log(this.userID);
    console.log('User ID from cookie:', this.userID);

    let response = this.b1.fetchuser();

    response.subscribe((data1: any) => {
      // Debugging: Log the data received from the API
      console.log('Data from API:', data1);
      const uuid = this.userID;
      console.log(uuid);

      // Filter the data array to include only the user with the matching userID
      // this.data = data1.find((user: any) => user.uid === uuid);
      this.userData1 = data1.find((user: any) => user.uid == uuid);
      console.log(this.userData1);
      // Debugging: Log the filtered data
      console.log('Filtered Data:', this.userData1);
      this.abc = this.userData1.uid;
      console.log(this.abc);
    });

    // Initialize the form with default values or load existing employee data
    this.userform = this.formBuilder.group({
      uid: [this.userID, Validators.required],
      userFirstName: ['', Validators.required],
      userLastName: ['', Validators.required],
      companyuser: ['', Validators.required],
    
      userphone: ['', Validators.required],
      usercountry: ['', Validators.required],
      userstate: ['', Validators.required],
      usercity: ['', Validators.required],
      websiteuser: ['', Validators.required]
      // Set the default value for userName using abc
    // This line sets the default value for userName
    });
  }

  updateUser() {
    if (this.userform.valid) {
      // Extract updated user data from the form
      const updatedUser = this.userform.value;
      console.log(updatedUser);
      this.b1
        .updateUser(updatedUser)
        .pipe(
          catchError((error) => {
            // Handle the error response here
            console.error('Error updating profile:', error);
            return throwError(error); // Re-throw the error
          })
        )
        .subscribe({
          next: (response) => {
            // Handle the success response here
            console.log('Profile updated successfully:', response);
            alert("Profile updated successfully");
            this.router.navigate(['/dashboarduser/userprofile']);
          },
          complete: () => {
            // This block is optional and can be used for handling completion
          }
        });
    } else {
      console.error('Form is invalid. Cannot update profile.');
    }
  }
}
