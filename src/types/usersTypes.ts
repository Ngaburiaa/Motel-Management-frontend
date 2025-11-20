
export type TUserForm = {
  firstName: string;
  lastName: string;
  profileImage?: string;
  bio:string;
  email: string;
  contactPhone?: string;
  role?: TUserTypes;
};

export type TUserFormValues = {
  firstName: string;
  lastName: string;
  bio: string;
  profileImage?: string;
};

export type TUser = {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  contactPhone: string;
  profileImage?: string;
  bio?: string;
  role: "user" | "owner" | string;
};

export type TUserTypes = "user" | "owner" | "admin";
