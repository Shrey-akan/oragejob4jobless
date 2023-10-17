import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-headeremp',
  templateUrl: './headeremp.component.html',
  styleUrls: ['./headeremp.component.css']
})
export class HeaderempComponent implements OnInit{
  showNavbaremp= true;
  constructor(private router: Router) {}

  ngOnInit() {

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const currentRoute = event.urlAfterRedirects;

        // Check if the current route is 'employer'
        this.showNavbaremp = !['/employers/sign-in-checkemp'].includes(currentRoute);    
      }
    });
  }

}
