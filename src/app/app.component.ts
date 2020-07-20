import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';

interface MailChimpResponse {
  result: string;
  msg: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'mailchimp-angular-v1';
  sampleForm: FormGroup;
  validateEmailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  mailChimpEndpoint: string;
  endpointPlaceholder =
    'https://gmail.us10.list-manage.com/subscribe/post-json?u=********&amp;id=*********';
  httpResponse = {
    msg: 'No Request Sent Yet',
  };

  constructor(private formBuilder: FormBuilder, private http: HttpClient) {
    this.sampleForm = this.formBuilder.group({
      endpoint: ['', Validators.required],
      email: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(this.validateEmailRegex),
        ]),
      ],
      firstName: [''],
      lastName: [''],
    });
  }

  onSubmit() {
    // console.log(this.sampleForm.value);

    this.mailChimpEndpoint = this.sampleForm.value.endpoint + '&';

    const params = new HttpParams()
      .set('FNAME', this.sampleForm.value.firstName)
      .set('LNAME', this.sampleForm.value.lastName)
      .set('EMAIL', this.sampleForm.value.email)
      .set('b_123abc123abc123abc123abc123abc123abc', ''); // hidden input name

    const mailChimpReqUrl = this.mailChimpEndpoint + params.toString();

    this.http.jsonp<MailChimpResponse>(mailChimpReqUrl, 'c').subscribe(
      (response) => {
        console.log('HTTP Request successful!');
        console.log(response);
        this.httpResponse = response;
      },
      (error) => {
        console.log('HTTP Request Errored!');
        console.log(error);
        this.httpResponse = error;
      }
    );
  }
}
