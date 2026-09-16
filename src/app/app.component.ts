import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { HeaderComponent } from "./layout/header/header.component";
import { FooterComponent } from "./layout/footer/footer.component";
import { SidebarComponent } from "./layout/sidebar/sidebar.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, SidebarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'mssf';
  isLoginPage = false;

  constructor(private router: Router) {
    this.checkRoute();
    router.events.subscribe(() => {
      this.checkRoute();
    });
  }

  checkRoute(): void {
    const currentUrl = this.router.url;
    this.isLoginPage = currentUrl === '/login' || currentUrl === '/email-verification' || currentUrl === '/send-password-reset' || currentUrl === '/first-time-setup';
  }
}
