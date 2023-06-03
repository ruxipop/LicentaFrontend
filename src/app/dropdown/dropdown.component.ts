import {Component, EventEmitter, HostListener, OnInit, Output} from '@angular/core';
import {ImageService} from "../service/image.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent implements OnInit {
  @Output() categorySelectedEmitter = new EventEmitter<string | null>();
  @Output() categoryDeselectedEmitter = new EventEmitter<string | null>();
  isDropdownOpen = false;
  categories$: Observable<string[]>
  selectAll: boolean = true;
  selectedItems: string[] = [];
  allCategories: string[];

  constructor(private imageService: ImageService) {
    this.selectedItems.length = 30
  }

  @HostListener('document:click', ['$event'])
  handleClick(event: Event) {
    const targetElement = event.target as HTMLElement;
    if (!targetElement.closest('.dropdown')) {
      this.isDropdownOpen = false;
    }
  }

  toggleDropdown(categories: string[]) {
    this.allCategories = categories;
    if (this.selectAll) {

      this.selectedItems = categories;
    }
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  formatOption(option: string): string {
    const words = option.split(/(?=[A-Z])/);
    return words.join(' ');
  }

  ngOnInit() {
    this.categories$ = this.imageService.getCategory();
  }

  splitOptionLeft(category: string[]) {
    const middleIndex = Math.ceil(category.length / 2);
    return category.slice(0, middleIndex);
  }

  splitOptionRight(category: string[]) {
    const middleIndex = Math.ceil(category.length / 2);
    return category.slice(middleIndex);

  }

  toggleSelection(option: string) {
    if (this.selectAll) {
      this.selectAll = false;
      this.selectedItems = [];
    }
    const index = this.selectedItems.findIndex(item => item === option);
    if (index > -1) {
      this.categoryDeselectedEmitter.emit(option)
      this.selectedItems.splice(index, 1);
    } else {
      this.categorySelectedEmitter.emit(option);
      this.selectedItems.push(option);
    }

    if (this.selectedItems.length === 0) {
      this.selectAll = true;
      this.selectedItems = this.allCategories;
      this.categorySelectedEmitter.emit(null)
    }
  }

  isSelected(option: string) {
    return this.selectAll ? false : this.selectedItems.some(item => item === option);
  }

  toggleSelectAll() {
    if (!this.selectAll) {
      this.categorySelectedEmitter.emit(null)
      this.selectAll = true;
      this.selectedItems = this.allCategories;
    }
  }
}
