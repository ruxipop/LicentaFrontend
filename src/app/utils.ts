export function isAuthenticated():boolean{
  return localStorage.getItem('accessToken') !== null;
}

export function  isAdminAuthenticated():boolean{
  return  localStorage.getItem('accessToken') !== null &&  localStorage.getItem("role")==='ADMIN';
}

export function  getRole(){
  return localStorage.getItem("role")
}

export function isUser(): boolean {
  return localStorage.getItem("role")==='USER';
}

export function isUserAuthenticated():boolean{
  return localStorage.getItem('accessToken') !== null && localStorage.getItem("role")==='USER';
}
