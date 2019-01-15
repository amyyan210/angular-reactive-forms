import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn } from '@angular/forms';

import { Customer } from './customer';

function ratingRange(min: number, max: number): ValidatorFn {
  return (c: AbstractControl): { [key: string]: boolean } | null => {
    if (c.value !== null && (isNaN(c.value) || c.value < min || c.value > max)) {
      return { 'range': true };
    }
    return null;
  };
}

function emailMatcher(c: AbstractControl): {[key: string]: boolean} | null {

  const emailControl = c.get('email');
  const confirmEmailControl = c.get('confirmEmail');

  if (emailControl.pristine || confirmEmailControl.pristine) {
    return null;
  }

  if (emailControl.value === confirmEmailControl.value) {
    return null;
  }
  return { 'match': true };

}

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  // defines our formModel
  customerForm: FormGroup;
  customer = new Customer();
  emailMessage: string;

  private validationMessage = {
    required: 'Please enter your email address',
    email: 'Please enter a valid email address'
  };

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    // The form model
    // Chose to put this in ngOnInIt (vs. in constructor) to ensure that the template
    // and component are initialized before building the form
    this.customerForm = this.formBuilder.group({
      // passed in formControls for each input on form
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      emailGroup: this.formBuilder.group({
        email: ['', Validators.required],
        confirmEmail: ['', Validators.required]
      }, { validator: emailMatcher }),
      phone: '',
      notification: 'email',
      sendCatalog: true, // true by default,
      rating: [null, ratingRange(1, 5)],
    });

    this.customerForm.get('notification').valueChanges.subscribe(
      value => this.setNotification(value)
    );

    const emailControl = this.customerForm.get('emailGroup.email');
    emailControl.valueChanges.subscribe(
      value => this.setMessage(emailControl)
    );
  }

  save() {
    console.log(this.customerForm);
    console.log('Saved: ' + JSON.stringify(this.customerForm.value));
  }

  populateTestData(): void {
    this.customerForm.patchValue({
      firstName: 'Amy',
      lastName: 'Yanaway',
      sendCatalog: false
    });
  }

  setMessage(c: AbstractControl): void {
    this.emailMessage = '';
    if ((c.touched || c.dirty) && c.errors) {
      this.emailMessage = Object.keys(c.errors).map(
        key => this.emailMessage += this.validationMessage[key]).join(' ');
    }
  }

  setNotification(notifyVia: string): void {
    const phoneControl = this.customerForm.get('phone');

    if (notifyVia === 'text') {
      phoneControl.setValidators(Validators.required);
    } else {
      phoneControl.clearValidators();
    }
    // reevaluate the form control's validation state
    phoneControl.updateValueAndValidity();
  }

}
