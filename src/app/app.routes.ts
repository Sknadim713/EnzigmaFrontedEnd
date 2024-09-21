import { Routes } from '@angular/router';
import { TaskListComponent } from './task-list/task-list.component';
import { AddTaskComponent } from './add-task/add-task.component';


export const routes: Routes = [
    { path: '', redirectTo: 'task', pathMatch: 'full' },
    { path: 'task', component: TaskListComponent, data: { title: 'task' } },
    { path: 'addtask', component: AddTaskComponent, data: { title: 'addtask' } },

];
