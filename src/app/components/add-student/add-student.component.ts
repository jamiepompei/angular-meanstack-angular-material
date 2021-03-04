import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Router } from '@angular/router';
import { MatChipInputEvent } from '@angular/material/chips';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/shared/api.service';

export interface Subject{
  name: string;
}

@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.css']
})
export class AddStudentComponent implements OnInit {
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  selected= '';
  @ViewChild('chipList') chipList: any;
  @ViewChild('resetStudentForm') myNgForm: any;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  studentForm!: FormGroup;
  subjectArray: Subject[] = [];
  SectionArray: any = ['A', 'B','C','D','E'];


  constructor(
    private api: ApiService,
    public fb: FormBuilder,
    private router: Router,
    private ngZone: NgZone) { }

  ngOnInit(): void {
    this.submitBookForm();
  }

/* Reactive book form */
submitBookForm(){
  this.studentForm = this.fb.group({
    student_name: ['', [Validators.required]],
    student_email: ['', [Validators.required]],
    section: ['', [Validators.required]],
    subjects: ['', [Validators.required]],
    dob: ['', [Validators.required]],
    gender: ['Female']
  })
}

/** Add dynamic languages */
add(event: MatChipInputEvent): void {
  const input = event.input;
  const value = event.value;
  //add language
  if ((value || '').trim() && this.subjectArray.length < 5){
    this.subjectArray.push({ name: value.trim() })
  }
  //reset the input value
  if (input){
    input.value = '';
  }
}

/**Remove dynamic languages */
remove(subject: Subject): void{
  const index = this.subjectArray.indexOf(subject);
  if(index >= 0){
    this.subjectArray.splice(index, 1);
  }
}

/** Date */
formatDate(e: any){
  var convertDate = new Date(e.target.value).toISOString().substring(0, 10);
  this.studentForm.get('dob')?.setValue(convertDate, {
    onlyself: true
  })
}

/**Get Errors */
public handleError = (controlName: string, errorName: string) => {
  return this.studentForm.controls[controlName].hasError(errorName);
}

/**submit book */
submitStudentForm(){
  if(this.studentForm.valid){
    this.api.addStudent(this.studentForm.value).subscribe( res =>{
      this.ngZone.run(() => this.router.navigateByUrl('/students-list'))
    });
  }
}

}
