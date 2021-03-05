import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { Student } from './../../shared/student';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ApiService } from 'src/app/shared/api.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css']
})
export class StudentListComponent implements OnInit {
  StudentData: any = [];
  dataSource!: MatTableDataSource<Student>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = ['_id', 'student_name', 'student_email', 'section', 'action'];

  constructor(private api: ApiService, private router: Router, private ngZone: NgZone) {
    this.api.getAllStudents().subscribe(data => {
      this.StudentData = data;
      this.dataSource = new MatTableDataSource<Student>(this.StudentData);
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
      }, 0);
    })
   }

  ngOnInit(): void {
  }

  deleteStudent(index: number, e: any){
    if(window.confirm('Are you sure you want to delete this student: ' + e.student_name)){
      const data = this.dataSource.data;
      data.splice((this.paginator.pageIndex * this.paginator.pageSize) + index, 1);
      this.dataSource.data = data;
      this.api.deleteStudent(e._id).subscribe(res => {
        console.log('student deleted');
        this.ngZone.run(() => this.router.navigateByUrl('/students-list'))
      });
    }
  }

}
