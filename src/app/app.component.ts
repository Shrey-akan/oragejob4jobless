import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { MessagingService } from './firebase/messaging.service';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private http: HttpClient, private cookie: CookieService , private messagingservice:MessagingService) { 
    
  }
  title = 'jobax';
  showFooter = true;

  message:any = null;
  ngOnInit():void {
   
    const refreshToken = this.cookie.get('refreshToken');
    console.log("Checking the method is running");
    console.log("checking the value of refreshToken",refreshToken);
    if (refreshToken) {
      this.http.post('https://job4jobless.com:9001/refreshToken', { refreshToken }).subscribe(
       {
        next:(response: any) => {
          if (response.accessToken) {
            const accessToken = response.accessToken;
            AuthInterceptor.accessToken = accessToken;
            this.cookie.set('accessToken', accessToken);
          }
        },
        error:(error) => {
          // Handle the error here
          console.error('Error while refreshing the token:', error);
          // You can also display an error message to the user if needed
        }
       }
      );
    }
 
    this.requestPermission();
    this.listen();
  }
  requestPermission() {
    const messaging = getMessaging();
    getToken(messaging, { vapidKey: environment.firebase.vapidKey })
      .then((currentToken) => {
        if (currentToken) {
          console.log('Hurraaa!!! we got the token.....');
          console.log(currentToken);
          this.sendTokenToAPI(currentToken);

        } else {
          console.log(
            'No registration token available. Request permission to generate one.',
          );
        }
      })
      .catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
      });
  }


  sendTokenToAPI(token: string) {
    // Replace 'YourApiEndpoint' with your actual API endpoint
    const apiUrl = 'https://rocknwoods.website:4000/api/settoken';
  
    // Generate a random tokenid
    const tokenid = generateRandomTokenId(); // Define the generateRandomTokenId function
  
    // Send the token and tokenid to your API
    this.http.post(apiUrl, { token, tokenid }).subscribe({
      next: (response: any) => {
        console.log('Token and TokenID sent to the API successfully.');
      },
      error: (error) => {
        console.error('Error while sending the Token and TokenID to the API:', error);
      }
    });
  
    // Function to generate a random tokenid
    function generateRandomTokenId() {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      const length = 10; // You can adjust the length as needed
      let randomTokenId = '';
      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomTokenId += characters.charAt(randomIndex);
      }
      return randomTokenId;
    }
  }
  


  listen() {
    const messaging = getMessaging();
    onMessage(messaging, (payload) => {
      console.log('Message received. ', payload);
      this.message = payload;
    });
  }
}
