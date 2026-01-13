export type User = {
  id: string,
  gender: string,
  username: string;
  password: string;
  email: string
  name : string
  surname: string
  country: string
  dob: string,
  description: string,
  city: string,
  avatar: string
}

export type Message = {
  message: string,
  authorId: string,
  createdDate: string
}

export type Thread = {
  firstUserId: string,
  secondUserId: string,
  messages: Message[]
}