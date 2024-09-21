import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ApiserviceService } from '../apiservice.service';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, RouterModule, FormsModule],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit, OnDestroy {
  private ApiSubscribe: Subscription = new Subscription();
  isModalOpen = false;
  selectedTaskId: any
  showModal: boolean = false;
  tasks: any[] = [];
  displayedTasks: any[] = [];
  searchTask: string = '';
  currentPage: number = 1;
  pageSize: number = 5;
  totalTasks: number = 0;
  totalPages: number = 0;
  paginationButtons: number[] = [];

  theading = [
    { value: "Assigned To" },
    { value: "Status" },
    { value: "Due Date" },
    { value: "Priority" },
    { value: "Comment" },
    { value: "Action" }
  ];
  // allTask: any;

  constructor(private ApiService: ApiserviceService, private route: Router) { }

  ngOnInit(): void {
    this.GetUser(); //Api calling here
  }

  GetUser() {
    this.ApiSubscribe = this.ApiService.GetAllTask().subscribe(
      (response: any) => {
        this.tasks = response.data;
        this.totalTasks = response.count;
        this.updatePagination();
      },
      (error: any) => {
        console.error('Error fetching user data:', error);
      }
    );
  }

  ngOnDestroy() {
    if (this.ApiSubscribe) {
      this.ApiSubscribe.unsubscribe();
    }
  }

  // Update pagination set up
  updatePagination() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.displayedTasks = this.tasks.slice(start, end);
    this.totalPages = Math.ceil(this.totalTasks / this.pageSize);
    this.paginationButtons = this.generatePaginationButtons();
  }

  //Handle pagination buttons
  generatePaginationButtons(): number[] {
    const buttons = [];
    for (let i = 1; i <= this.totalPages; i++) {
      buttons.push(i);
    }
    return buttons;
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.updatePagination();
  }

  // Navigation methods
  goToFirstPage() {
    this.currentPage = 1;
    this.updatePagination();
  }

  // move to the previos page
  goToPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  // move to the next page
  goToNextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  // last page jump
  goToLastPage() {
    this.currentPage = this.totalPages;
    this.updatePagination();
  }

  toggleDropdown(task: any) {
    task.isDropdownOpen = !task.isDropdownOpen;
  }




  viewTask(id: any) {
    sessionStorage.setItem('id', id);
    this.route.navigate(['/addtask']);
  }

  onSearchChange() {
    if (this.searchTask) {
      this.filteredTasks();
    } else {
      this.GetUser()
    }
  }


  // Filtering logics
  filteredTasks() {
    if (!this.searchTask) {
      this.updatePagination();
      return;
    }
    const filteredTasks = this.tasks.filter(task =>
      (task.assignedTo && task.assignedTo.toLowerCase().includes(this.searchTask.toLowerCase())) ||
      (task.priority && task.priority.toLowerCase().includes(this.searchTask.toLowerCase())) ||
      (task.status && task.status.toLowerCase().includes(this.searchTask.toLowerCase())) ||
      (task.comment && task.comment.toLowerCase().includes(this.searchTask.toLowerCase()))
    );

    this.totalTasks = filteredTasks.length;
    this.tasks = filteredTasks;
    this.currentPage = 1;
    this.updatePagination();
  }

  getCurrentRange(): string {
    const start = (this.currentPage - 1) * this.pageSize + 1;
    const end = Math.min(this.currentPage * this.pageSize, this.totalTasks);
    return `${start} to ${end} of ${this.totalTasks} records`;
  }



  deleteTask(id: any) {
    this.selectedTaskId = id;  // Set the selected task ID
    this.isModalOpen = true;        // Open the modal
  }


  deleteConfirmed() {
    if (this.selectedTaskId) {
      this.ApiService.DeleteTaskyId(this.selectedTaskId).subscribe((resp) => {
        console.log(resp);
        this.GetUser()
      })
      this.closeModal();
    }
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedTaskId = null;
  }
}

