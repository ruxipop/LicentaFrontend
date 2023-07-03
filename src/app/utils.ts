export function isAuthenticated(): boolean {
  return localStorage.getItem('accessToken') !== null;
}

export function isAdminAuthenticated(): boolean {
  return localStorage.getItem('accessToken') !== null && localStorage.getItem("role") === 'EDITOR';
}

export function isUserAuthenticated(): boolean {
  return localStorage.getItem('accessToken') !== null && localStorage.getItem("role") === 'USER';
}

export function getUserAuthenticatedId(): number {
  return parseInt(localStorage.getItem('id'))
}

export function getRole() {
  return localStorage.getItem("role")
}

export function currentCharacterCount(input: any): number {
  return input ? input.length : 0;
}

export function calculateTime(correctDate: Date,type:string): string {
  const date = new Date(correctDate);
  const now = new Date();
  const diffInMilliseconds = Math.abs(now.getTime() - date.getTime());

  const minutes = Math.floor(diffInMilliseconds / (1000 * 60));

  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    if (hours >= 24) {
      const days = Math.floor(hours / 24);
      return type=='comm'? `${days} ${days === 1 ? 'day' : 'days'}`: `${days} ${days === 1 ? 'day' : 'days'} ago`

    } else {
      return type=='comm'?  `${hours} ${'h' } `:  `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`

    }
  } else if (minutes > 0) {
    return type=='comm'?  `${minutes} ${'min'} `: `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  } else {
    return "right now";
  }
}

 export function formatMessageTime(correctDate: Date): string {
  const messageTime = new Date(correctDate);
  const now = new Date();
  const formattedTime = messageTime.toLocaleString("en-US", { hour: "numeric", minute: "numeric", hour12: true });

  if (messageTime < now && messageTime.getDate() !== now.getDate()) {
    const formattedDate = messageTime.toLocaleString("en-US", { day: "numeric", month: "short" });
    return `${formattedDate}`;
  }

  return formattedTime;
}
