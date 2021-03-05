import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/shared/api.service';
import { MatChipInput, MatChipInputEvent } from '@angular/material/chips';

export interface Subject {
  name: string;
}

@Component({
  selector: 'app-edit-student',
  templateUrl: './edit-student.component.html',
  styleUrls: ['./edit-student.component.css']
})
export class EditStudentComponent implements OnInit {
  visible= true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  @ViewChild('chipList') chipList: any;
  @ViewChild('resetStudentForm') myNgForm: any;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  studentForm!: FormGroup;
  subjectArray: Subject[] = [];
  SectionArray: any = ['A','B', 'C', 'D', 'E'];
  


  constructor(
    public fb: FormBuilder,
    private router: Router,
    private ngZone: NgZone, 
    private activatedRoute: ActivatedRoute,
    private api: ApiService
  ) {
    var id: any = this.activatedRoute.snapshot.paramMap.get('id');
    this.api.getStudentById(id).subscribe(data =>{
      console.log(data.subjects);
      this.subjectArray = data.subjects;
      this.studentForm = this.fb.group({
        student_name: [data.student_name, [Validators.required]],
        student_email: [data.student_email, [Validators.required]],
        section: [data.section, [Validators.required]],
        subjects: [data.subjects],
        dob: [data.dob, [Validators.required]],
        gender: [data.gender]

      })
    })
   }

  ngOnInit(): void {
    this.updateBookForm();
  }

  /**Reactive book form */
  updateBookForm(){
    this.studentForm = this.fb.group({
      student_name: ['', [Validators.required]],
      student_email: ['', [Validators.required]],
      section: ['', [Validators.required]],
      subjects: [this.subjectArray],
      dob: ['', [Validators.required]],
      gender: ['Female']
    })
  }

  /** Add dynamic languages */
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    //add language
    if((value || '').trim() && this.subjectArray.length < 5){
      this.subjectArray.push({name: value.trim()})
    }
    //reset input value
    if(input){
      input.value = '';
    }
  }

  /** Remove Dynamic Languages */
  remove(subject: Subject): void {
    const index = this.subjectArray.indexOf(subject);
    if(index >= 0){
      this.subjectArray.splice(index, 1);
    }
  }

  /**Date */
  formatDate(e: any){
    var convertDate = new Date(e.target.value).toISOString().subsctring(0, 10);
    this.studentForm.get('dob')?.setValue(convertDate, {
      onlyself: true
    })
  }

  /**Get errors */
  public handleError = (controleName: string, errorName: string) => {
    return this.studentForm.controls[controleName].hasError(errorName);
  }

  /**Update Book */
  updateStudentForm(){
    console.log(this.studentForm.value)
    var id: any = this.activatedRoute.snapshot.paramMap.get('id');
    if (window.confirm('Are you sure you want to update this record?')) {
      this.api.updateStudent(id, this.studentForm.value).subscribe( res => {
        this.ngZone.run(()=> this.router.navigateByUrl('/students-list'))
      });
    }
  }

}
