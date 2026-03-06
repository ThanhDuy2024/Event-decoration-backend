export interface LoginData {
  username: string,
  password: string,
}

export interface RegisterData {
  username: string,
  password: string,
  email: string,
}

export interface Profile {
  username: string,
  role: number, 
  image?: string,
}