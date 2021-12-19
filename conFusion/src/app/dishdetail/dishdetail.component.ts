import { Component, OnInit, ViewChild } from '@angular/core';
import { Dish } from '../shared/dish';

import { DishService } from '../services/dish.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Comment } from '../shared/comment';
import { MatSliderModule } from '@angular/material/slider';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';



@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {
  commentForm: FormGroup;
  comment: Comment;
 // dishIds: string[];
  //prev: string;
  //next: string;  
  rating: MatSliderModule;

    dish: Dish;
    @ViewChild('cform') commentFormDirective;

    formErrors = {
      'author': '',
     
      'comment': ''
      };

      validationMessages = {
        'author': {
          'required':      'Author Name is required.',
          'minlength':     'First Name must be at least 2 characters long.'
        },
        
        'comment': {
          'required':      'Your comment is required.'
        }
        
      };
  
    

  constructor(private dishservice: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private cb: FormBuilder) { 
      this.createForm();
    }

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    this.dishservice.getDish(id).subscribe(dish => this.dish = dish);
  }


  createForm() {
    
    const todayISOString: string = new Date().toISOString();
    console.log(todayISOString);

    this.commentForm = this.cb.group({
      author: ['', [Validators.required, Validators.minLength(2)] ],
      rating: 5,
      comment: ['', [Validators.required ]],
      date: todayISOString
      });
     this.commentForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

      this.onValueChanged(); // (re)set validation messages now

  }
  onValueChanged(data?: any) {
    if (!this.commentForm) { return; }
    const form = this.commentForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }
  onSubmit() {
    this.comment = this.commentForm.value;
    console.log(this.comment);
    
    // push the comments
    this.dish.comments.push(this.comment);
    
   
    this.commentForm.reset({
      'author': '',
      'rating': 5,
      'comment': ''
    });
    this.commentFormDirective.resetForm();
  }
  goBack(): void {
    this.location.back();
  }

  formatlabel(value: number){
    return value;
  }
}