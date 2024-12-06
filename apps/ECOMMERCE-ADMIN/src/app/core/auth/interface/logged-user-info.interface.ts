import { GenderEnum } from "@shared/enums/gender.enum";
import { RoleEnum } from "@shared/enums/role.enum";

export interface ILoggedUserInfo {
  uid: string;
  name: string;
  email: string;
  phone: string;
  id: number;
  profilePic: string;
  role: RoleEnum;
  gender: GenderEnum,
  token: string,
  lineageUid:string;
  informationApproved:boolean;
  blocked:boolean;
  verified:boolean;
  reviewer:boolean;
}
