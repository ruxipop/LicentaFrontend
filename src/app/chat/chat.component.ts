import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild
} from '@angular/core';
import {SealService} from "../service/seal.service";
import {ChatService} from "../service/chat.service";
import {MessageRequest, MessageResponse} from "../models/message";
import {
  BehaviorSubject,
  combineLatest,
forkJoin,


  map,

  Observable,

   take,

} from "rxjs";
import {ChatSenderService} from "../service/chat-sender.service";
import {User} from "../models/user";
import {TransferDataService} from "../service/transfer-data.service";
import {FollowService} from "../service/follow.service";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  message: any = '';
  receiver: string;

  senderId: string;
  currentPage = 1;
  pageSize = 9;
  currentUsername = ' '

  openNewChat: boolean = true;
  usersInChat$: Observable<User[]>
  messagesSent$: Observable<MessageResponse[]>
  messagesReceived$: Observable<MessageResponse[]>


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
      this.receiveMessageFromNotification(data)
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
    console.log('Sal');
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
    this.messagesSent$ = this.chatSender.getSenderMessage(parseInt(this.senderId), parseInt(this.receiver)).pipe();
  }

  fetchReceivedMessage() {
    this.messagesReceived$ = this.chatSender.getReceiverMessage(parseInt(this.receiver), parseInt(this.senderId)).pipe();

  }


  fetchUsers() {
    this.usersInChat$ = this.chatSender.getusers(parseInt(this.senderId)).pipe()

  }

  receiveMessageFromNotification(messageResponse: MessageResponse) {
    messageResponse.sent = false;
    const updatedMessages = [...this.combinedMessagesSource.value, messageResponse];
    this.combinedMessagesSource.next(updatedMessages);
    setTimeout(() => {
      this.scrollChatToBottom();
    });

  }

  selectUser(username: any, reiverId: string) {
    this.currentUsername = username
    this.receiver = reiverId
    this.sealService.setPublicKey(username)
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

  sendMessage() {
    console.log(this.message)
    this.chatService.sendNotification(this.senderId, this.receiver, this.message);
    const encrypted = this.sealService.encryptSenderMessage(this.message, this.senderId, this.receiver, localStorage.getItem("password")!);
    const mess = new MessageResponse(parseInt(this.senderId), parseInt(this.receiver), encrypted, new Date())
    mess.sent = true;
    this.chatSender.addSenderMessage(new MessageRequest(this.senderId, this.receiver, encrypted))

    const updatedMessages = [...this.combinedMessagesSource.value, mess];
    this.combinedMessagesSource.next(updatedMessages);
    this.message = ' '
    setTimeout(() => {
      this.scrollChatToBottom();
    });
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

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const dropdownElement = this.elementRef.nativeElement;
    const dropdownMenu = dropdownElement.querySelector('.dropdown-menu');
    const threeDotsElement = dropdownElement.querySelector('.ant-dropdown-trigger');

    if (!dropdownMenu.contains(target) && !threeDotsElement.contains(target)) {
      this.isDropdownOpen = false;
    }
  }

}

