export interface ILoggedUserInfo {
  uid: string;
  name: string;
  email: string;
  phone: string;
  id: number;
  profilePic: string;
  token: string,
  lineageUid:string;
  informationApproved:boolean;
  blocked:boolean;
  verified:boolean;
  reviewer:boolean;
}
