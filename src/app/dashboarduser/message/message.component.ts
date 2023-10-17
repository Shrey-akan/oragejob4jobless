import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { OtpService } from 'src/app/auth/otp.service';
import { UserService } from 'src/app/auth/user.service';
// Sample User and Message classes
class User {
  constructor(public id: number, public name: string) { }
}

class SendMessage {
  constructor(public messageTo: string, public messageFrom: string, public message: string) { }
}

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {
  empidMap: { [key: string]: string } = {};
  messages: SendMessage[] = [];
  selectedUser: string | null = null;
  filteredMessages: SendMessage[] = [];
  userID: any;
  userData1: any;
  abc: any;
  newMessage: string = '';

  constructor(private http: HttpClient,private  router:Router, public cookie: CookieService, private b1: UserService) { }

  ngOnInit(): void {
    this.userID = this.cookie.get('user');

    let response = this.b1.fetchuser();

    response.subscribe((data1: any) => {
      const uuid = this.userID;
      this.userData1 = data1.find((user: any) => user.uid == uuid);
      this.abc = this.userData1.uid;
    });

    this.fetchMessages();
  }

  fetchMessages() {
    const uniqueNames = new Set<string>();

    this.http.get<SendMessage[]>('http://localhost:9001/fetchMessages').subscribe((messages: SendMessage[]) => {
      this.messages = messages.filter((message) => {
        if (!uniqueNames.has(message.messageFrom)) {
          uniqueNames.add(message.messageFrom);
          return message.messageTo === this.userID;
        }
        return false;
      });
    });

    this.fetchMyMessages();
  }

  fetchMyMessages() {
    this.http.get<SendMessage[]>('http://localhost:9001/fetchMessages').subscribe((messages: SendMessage[]) => {
      this.filteredMessages = [];
      const uniqueMessageIds = new Set<string>();

      for (const message of messages) {
        const messageIdentifier = `${message.messageFrom}_${message.messageTo}_${message.message}`;
        if (!uniqueMessageIds.has(messageIdentifier)) {
          uniqueMessageIds.add(messageIdentifier);
          if (
            (message.messageFrom === this.selectedUser && message.messageTo === this.abc) ||
            (message.messageFrom === this.abc && message.messageTo === this.selectedUser)
          ) {
            this.filteredMessages.push(message);
          }
        }
      }
    });
  }

  selectUser(user: string) {
    this.selectedUser = user;
    this.fetchMyMessages();
  }

  sendMessage() {
    if (this.selectedUser && this.newMessage.trim() !== '') {
      const messageToSend = new SendMessage(this.selectedUser, this.abc, this.newMessage);

      this.http.post<SendMessage>('http://localhost:9001/send', messageToSend).subscribe({
        next: (response: SendMessage) => {
          this.newMessage = '';
          this.fetchMessages();
        },
        error: (err: any) => {
          console.error('Error sending message:', err);
        }
      });
    }
  }
  startVideoCall() {
    if (this.selectedUser) {
      // Route to the video call page with the selected user as a route parameter
      console.log("check the selectUser",this.selectedUser);
      this.router.navigate(['/dashboarduser/videocall', this.selectedUser]); // Adjust the route as per your project's configuration
    }
  }
}
