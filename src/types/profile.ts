export interface ProfileResponse {
  status: {
    code: number;
    message: string;
  };
  data: {
    profile: Profile;
  };
}

export interface Profile {
  id: number;
  name: string;
  email: string;
  phone: string;
  photoUrl: string;
}
