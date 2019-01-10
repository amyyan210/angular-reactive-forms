import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { Customer } from './customer';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  // defines our formModel
  customerForm: FormGroup;
  customer = new Customer();

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    // The form model
    // Chose to put this in ngOnInIt (vs. in constructor) to ensure that the template
    // and component are initialized before building the form
    this.customerForm = this.formBuilder.group({
      // passed in formControls for each input on form
      firstName: '',
      lastName: '',
      email: '',
      sendCatalog: true // true by default
    });
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
}
