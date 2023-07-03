import {
  Component,
  ContentChildren,
  QueryList,
  AfterContentInit,
  Input,
  Output, EventEmitter
} from '@angular/core';
import {TabComponent} from '../tab/tab.component';
import {TransferDataService} from "../../services/transfer-data.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements AfterContentInit {
  @Input() displayDropdown = true;
  @ContentChildren(TabComponent) tabs: QueryList<TabComponent>;
  @Output() messageToParent = new EventEmitter<string>();
  @Output() emitSelectedCategory = new EventEmitter<string | null>();
  @Output() emitDeselectedCategory = new EventEmitter<string | null>();
  @Output() tabEvent = new EventEmitter<string>

  currentTab: TabComponent;

  constructor(private dat: TransferDataService, private route: ActivatedRoute) {
  }


  ngAfterContentInit() {

    const currentTab = this.route.snapshot.firstChild?.routeConfig?.path;

    if (currentTab) {
      this.selectTab(this.tabs.filter((tab) => tab.tabTitle.toLowerCase() === currentTab)[0])
    } else {

      let activeTabs = this.tabs.filter((tab) => tab.active);
      if (activeTabs.length === 0) {
        setTimeout(() =>
          this.selectTab(this.tabs.first));
      }
    }
  }

  selectTab(tab: TabComponent) {
    this.tabs.toArray().forEach(tab => tab.active = false);
    this.messageToParent.emit(tab.tabTitle.includes("Editor") ? tab.tabTitle.replace("Editor's Choice", "EditorChoice") : tab.tabTitle);
    this.currentTab = tab;
    tab.active = true;
  }

  handleCategory($event: string | null) {
    this.emitSelectedCategory.emit($event)
  }

  handleDeselectCategory($event: string | null) {
    this.emitDeselectedCategory.emit($event)
  }

}
