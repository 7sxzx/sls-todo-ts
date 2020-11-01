import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult
} from 'aws-lambda'
import { DynamoDB } from 'aws-sdk'
import { TodoInput } from './TodoInput'
import { v4 as uuidv4 } from 'uuid'
import { Todo } from './Todo'

const dynamoDb = new DynamoDB.DocumentClient()

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const body: TodoInput = JSON.parse(event.body)
  const TTL = Math.floor(+new Date() / 1000) + 60000
  const todo: Todo = {
    Id: uuidv4(),
    Items: body.Items.map(Item => ({
      Id: uuidv4(),
      Title: Item.Title,
      TTL
    }))
  }

  await dynamoDb.transactWrite({
    TransactItems: [
      ...todo.Items.map(Item => ({
        Put: {
          TableName: process.env.DYNAMODB_TODO,
          Item: {
            Id: todo.Id,
            ItemId: Item.Id,
            Title: Item.Title,
            TTL: Item.TTL
          }
        }
      }))
    ]
  }).promise()

  return {
    statusCode: 200,
    body: JSON.stringify(todo)
  }
}
