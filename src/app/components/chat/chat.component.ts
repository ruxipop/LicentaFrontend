import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild
} from '@angular/core';
import {SealService} from "../../services/seal.service";
import {ChatService} from "../../services/chat.service";
import {MessageRequest, MessageResponse} from "../../models/message";
import {
  BehaviorSubject,
  combineLatest,
  forkJoin,


  map,

  Observable,

  take,

} from "rxjs";
import {ChatSenderService} from "../../services/chat-sender.service";
import {User} from "../../models/user";
import {TransferDataService} from "../../services/transfer-data.service";
import {FollowService} from "../../services/follow.service";
import {UserChat} from "../../models/user-chat";
import {formatMessageTime} from "../../utils";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  message: any = '';


  senderId: string;
  currentPage = 1;
  pageSize = 9;


  openNewChat: boolean = true;
  usersInChat$: Observable<UserChat[]>
  messagesSent$: Observable<MessageResponse[]>
  messagesReceived$: Observable<MessageResponse[]>

  profilePhoto: string;
  obsArray: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);
  following$: Observable<any> = this.obsArray.asObservable();

  private combinedMessagesSource = new BehaviorSubject<MessageResponse[]>([]);
  combinedMessages$ = this.combinedMessagesSource.asObservable();

  @ViewChild('chatContainer') chatContainer!: ElementRef;
  value: string = '';
  isDropdownOpen: any = false;


  constructor(private sealService: SealService, private elementRef: ElementRef, private followingService: FollowService, private chatService: ChatService, private chatSender: ChatSenderService, private dataService: TransferDataService) {
    this.senderId = localStorage.getItem("id")!;
    this.dataService.data$5.subscribe((data) => {

      if (data.senderId == this.selectedUser.id) {
        console.log("sa")
        this.receiveMessageFromNotification(data)
      }
    })
  }


  searchMethod() {

    this.obsArray.next([]);
    this.currentPage = 1;
    this.fetchFollowing()
  }

  private scrollChatToBottom() {
    const chatContainerEl = this.chatContainer.nativeElement;
    chatContainerEl.scrollTop = chatContainerEl.scrollHeight;
  }


  ngOnInit() {


    this.fetchUsers();
    this.fetchFollowing()

  }


  onScroll() {
    this.currentPage += 1;

    forkJoin([this.following$.pipe(take(1)), this.followingService.getAllFollowingByPage(parseInt(this.senderId), this.currentPage, this.pageSize, this.value)])
      .subscribe((data: Array<Array<any>>) => {

        const newArr = [...data[0], ...data[1]];
        this.obsArray.next(newArr);
      });
  }

  fetchFollowing() {
    this.obsArray.next([]);
    this.followingService.getAllFollowingByPage(parseInt(this.senderId), this.currentPage, this.pageSize, this.value).subscribe(data => {
      this.obsArray.next(data)
    })
  }

  fetchSentMessage() {
    this.messagesSent$ = this.chatSender.getSenderMessage(parseInt(this.senderId), this.selectedUser.id).pipe();
  }

  fetchReceivedMessage() {
    this.messagesReceived$ = this.chatSender.getReceiverMessage(this.selectedUser.id, parseInt(this.senderId)).pipe();

  }


  fetchUsers() {
    this.usersInChat$ = this.chatSender.getUsers(parseInt(this.senderId)).pipe()

  }

  receiveMessageFromNotification(messageResponse: MessageResponse) {
    messageResponse.sent = false;
    const updatedMessages = [...this.combinedMessagesSource.value, messageResponse];
    this.combinedMessagesSource.next(updatedMessages);
    setTimeout(() => {
      this.scrollChatToBottom();
    });

  }

  selectedUser: User;

  selectUser(user: User) {
    this.selectedUser = user;

    this.sealService.setPublicKey(user.username)
    this.fetchReceivedMessage();
    this.fetchSentMessage();
    this.combinedMessagesSource.next([])
    combineLatest([this.messagesSent$, this.messagesReceived$]).pipe(
      map(([sentMessages, receivedMessages]) => {
        const sentMessagesWithSentFlag = sentMessages.map(message => ({...message, sent: true}));
        const receivedMessagesWithSentFlag = receivedMessages.map(message => ({...message, sent: false}));
        const allMessages = [...sentMessagesWithSentFlag, ...receivedMessagesWithSentFlag];
        return allMessages.sort((a, b) => a.timestamp < b.timestamp ? -1 : 1);
      })
    ).subscribe(data => this.combinedMessagesSource.next(data));
    this.openNewChat = false;

    setTimeout(() => {
      this.scrollChatToBottom();
    }, 80);
  }


  decryptSentMessage(message: string) {
    return this.sealService.decryptSenderMessage(message, localStorage.getItem("password")!)
  }

  decryptReceivedMessage(message: any) {
    return this.sealService.decryptMessage(message);
  }

  sendMessage(users: UserChat[]) {
    this.chatService.sendChat(this.senderId, this.selectedUser.id.toString(), this.message);
    const encrypted = this.sealService.encryptSenderMessage(this.message, this.senderId, this.selectedUser.id.toString(), localStorage.getItem("password")!);
    const mess = new MessageResponse(parseInt(this.senderId), this.selectedUser.id, encrypted, new Date())
    mess.sent = true;
    this.chatSender.addSenderMessage(new MessageRequest(this.senderId, this.selectedUser.id.toString(), encrypted))

    const updatedMessages = [...this.combinedMessagesSource.value, mess];
    this.combinedMessagesSource.next(updatedMessages);
    this.message = ' '
    setTimeout(() => {
      this.scrollChatToBottom()
    });
    if (!users.find(l => l.user.username == this.selectedUser.username)) {
      users.unshift({user: this.selectedUser, lastMessage: new Date()})
    } else {
      const index = users.findIndex(u => u.user.username == this.selectedUser.username)
      users.splice(index, 1);

      users.unshift({user: this.selectedUser, lastMessage: new Date()})

    }
  }

  areEqualDates(date1: Date, date2: Date): boolean {
    const dateCorrect1 = new Date(date1);
    const dateCorrect2 = new Date(date2)
    return (
      dateCorrect1.getDate() === dateCorrect2.getDate() &&
      dateCorrect1.getMonth() === dateCorrect2.getMonth() &&
      dateCorrect1.getFullYear() === dateCorrect2.getFullYear()
    );
  }

  formatDate(date: Date): string {
    const dateCorrect = new Date(date)
    return dateCorrect.toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric'});
  }


  formatTime(date: Date): string {
    const dateCorrect = new Date(date)
    const options: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    };
    return dateCorrect.toLocaleTimeString('en-US', options);


  }

  openNewConv() {
    this.openNewChat = true;
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }


  // @HostListener('document:click', ['$event'])
  // onDocumentClick(event: MouseEvent) {
  //   const target = event.target as HTMLElement;
  //   const dropdownElement = this.elementRef.nativeElement;
  //   const dropdownMenu = dropdownElement.querySelector('.dropdown-menu');
  //   const threeDotsElement = dropdownElement.querySelector('.ant-dropdown-trigger');
  //
  //   if (!dropdownMenu.contains(target) && !threeDotsElement.contains(target) && this.currentUsername!= ' ') {
  //     this.isDropdownOpen = false;
  //   }
  // }


  protected readonly formatMessageTime = formatMessageTime;
}

