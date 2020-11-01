export interface Item {
  Id: string,
  Title: string
  TTL: number
}

export interface Todo {
  Id: string,
  Items: Array<Item>,
}
