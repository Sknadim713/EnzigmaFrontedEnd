import { CommonModule, DatePipe } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { FormGroup, Validators, FormsModule, ReactiveFormsModule, FormBuilder, FormControl } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApiserviceService } from '../apiservice.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [RouterModule, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.css',
  providers: [DatePipe]
})
export class AddTaskComponent implements OnInit, OnDestroy {
  private ApiSubscribe: Subscription = new Subscription();
  NewTaskForm!: FormGroup;
  id: any
  constructor(
    private fb: FormBuilder,
    private route: Router,
    private ApiService: ApiserviceService,
    private datePipe: DatePipe

  ) {
    this.id = sessionStorage.getItem('id');
  }

  priority = [
    { value: "High" },
    { value: "Low" },
    { value: "Medium" },
    { value: "On Hold" },
    { value: "Critical" },
    { value: "Normal" }
  ];
  Users = [
    { value: "Anil" },
    { value: "Sunil" },
    { value: "Sunita" },
    { value: "Rajesh" },
    { value: "Priya" },
    { value: "Vijay" },
    { value: "Kavita" }
  ];
  Status = [

    { value: "In Progress" },
    { value: "Completed" },
    { value: "On Hold" },
    { value: "In QA " },
    { value: "Pening" },
    { value: "Cancelled" },
  ];




  ngOnInit() {
    this.NewTaskForm = new FormGroup({
      assignedTo: new FormControl('', Validators.required),
      status: new FormControl('', Validators.required),
      priority: new FormControl("", Validators.required),
      dueDate: new FormControl('', Validators.required),
      comment: new FormControl('', Validators.required)
    });

    if (this.id != null) {
      this.GetUserById();
    } else {
      // console.log('No ID found');
    }


  }

  onSubmit() {
    if (this.NewTaskForm.valid) {
      if (this.id === null) {
        this.ApiService.AddTask(this.NewTaskForm.value).subscribe(
          (response: any) => {
            console.log(response);
            this.route.navigate(['/task']);
          },
          (error) => {
            console.log(error);
            // this.toastr.error('Failed to add task. Please try again.', 'Error');
          }
        );
      }
      else {
        this.ApiService.GetUpdateTaskyId(this.id, this.NewTaskForm.value).subscribe(
          (response: any) => {
            console.log(response);
            this.route.navigate(['/task']);
          },
          (error) => {
            console.log(error);

          }
        );
      }
    } else {
      console.log('Please fill the form.');
    }
  }

  onCancel() {
    this.NewTaskForm.reset();
  }

  GetUserById() {
    this.ApiSubscribe = this.ApiService.GetById(this.id).subscribe(
      (response: any) => {
        // console.log(response);
        if (response.data) {
          this.GetFormControl(response.data);
        } else {
          console.error('No data found in the response');
        }
      },
      (error: any) => {
        console.error('Error fetching user data:', error);
      }
    );
  }


  // fatch form method
  GetFormControl(data: any) {
    if (data) {
      const dueDate = data.dueDate ? this.datePipe.transform(data.dueDate, 'yyyy-MM-dd') : '';
      this.NewTaskForm.patchValue({
        assignedTo: data.assignedTo || '',
        status: data.status || '',
        priority: data.priority || '',
        dueDate: dueDate,
        comment: data.comment || ''
      });
    } else {
      console.error('Data is undefined or null');
    }
  }

  ngOnDestroy() {
    if (this.ApiSubscribe) {
      this.ApiSubscribe.unsubscribe();
    }
    sessionStorage.clear()
  }
}