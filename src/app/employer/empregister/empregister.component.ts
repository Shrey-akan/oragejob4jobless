import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/auth/user.service';

@Component({
  selector: 'app-empregister',
  templateUrl: './empregister.component.html',
  styleUrls: ['./empregister.component.css']
})
export class EmpregisterComponent {
  isHovered = false;
  employerdetails: FormGroup;
  formSubmitted: any;
  empPasswordVisible: boolean = false;
  data1: any;


  constructor(private formBuilder: FormBuilder , private router:Router , private b1:UserService , private http:HttpClient) {
    this.employerdetails = this.formBuilder.group({
      empfname: ['', Validators.required],
      emplname: ['', Validators.required],
      empmailid: ['', [Validators.required, Validators.email, Validators.pattern(/\b[A-Za-z0-9._%+-]+@gmail\.com\b/)]],
      emppass: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)]],
      empphone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      empcompany: [''],
      descriptionemp: [''],
     empcountry: ['', Validators.required],
      empstate: ['', Validators.required],
      empcity: ['', Validators.required]
    });

 

  }


  empRegisteration(): void {
    this.http.post('http://localhost:9001/insertEmployer', this.employerdetails.getRawValue()).subscribe({
      next: (payload: any) => {
      
          console.log(payload);
          console.log(payload.empid);
          this.generateOtp(payload);
        
      },
      error: (err) => {
        console.error(`Some error occured: ${err}`);
      }
    })
  }

  loginWithGoogle() {
    this.b1.loginWithGoogle()
      .then((userCredential) => {
        // User is successfully authenticated
        const user = userCredential.user;
        console.log('Authenticated');
        console.log('User Info:', user);
        const empmailid = user.email;
        console.log(empmailid);
        if(user.email){
          const empmailid = user.email;
          console.log(empmailid);
          this.b1.createOrGetEmployer(empmailid);
        }
        else{
          console.error('Employer email is null. Handle this case as needed.');
        }
      })
      .catch((error: any) => {
        console.error('Authentication Error:', error);
        // Handle authentication errors here
      });
  }


  generateOtp(payload: any) {
    this.http.post('https://otpservice.onrender.com/0auth/generateOtp', {uid: payload.empid, email:payload.empmailid}).subscribe({
      next:(response: any) => {
        if(response.otpCreated) {
          console.log(response.otpCreated);

this.router.navigate(['/employer/optverify', payload.empid]);
          
        }
        else {
          console.error("Otp not generated");
        }
      },
      error: (err: any) => { 
        console.error(`Some error occured: ${err}`);
      }
    })
  }

  toggleEmpPasswordVisibility() {
    this.empPasswordVisible = !this.empPasswordVisible;
  }
  ngOnInit(): void {  }

}
