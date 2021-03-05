import { Component, OnInit, ViewChild } from '@angular/core';
import { Student } from './../../shared/student';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ApiService } from 'src/app/shared/api.service';


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

  constructor(private api: ApiService) {
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
    if(window.confirm('Are you sure')){
      const data = this.dataSource.data;
      data.splice((this.paginator.pageIndex * this.paginator.pageSize) + index, 1);
      this.dataSource.data = data;
      this.api.deleteStudent(e._id).subscribe()
    }
  }

}
