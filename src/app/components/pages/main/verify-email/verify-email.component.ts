import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmailService } from 'src/app/services/email/email.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css']
})
export class VerifyEmailComponent {
  isLoading: boolean = true
  isSuccess: boolean

  constructor(private http: HttpClient, private route: ActivatedRoute, private emailService: EmailService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      let id = params.get('id');
      let token = params.get('token');

      if(id && token){
        this.verifyEmail(id, token);
      }
    })
  }

  verifyEmail(id: string, token: string): void {
    this.emailService.verifyEmail(id, token).subscribe({
      next: (response: any) => {
        this.isLoading = false
        this.isSuccess = true
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading = false
        this.isSuccess = false
      }
    })
  }

}
