import { QueryEngine } from 'src/client/QueryEngine'
import { Client, FunctionData, tableFunctions, tableData, TableData } from 'src/client/generated'
import { flow } from 'fp-ts/function'

let client: Client

export function getClient(): Client {
  if (client) return client
  const queryEngine = new QueryEngine()
  const newClient: Partial<Client> = {}

  Object.entries(tableData).forEach(([typeName, tableData]) => {
    // @ts-ignore
    newClient[typeName as keyof Client] = generateDelegate(queryEngine, tableData)

    const functions = tableFunctions[typeName as keyof Client]
    if (functions) Object.entries(functions).forEach(([name, data]) => {
      // @ts-ignore
      newClient[typeName as keyof Client][name]! = generateQuery(data)
    })
  })

  return client = newClient as Client
}

const getUserArgs = (args?: Record<string, unknown>): Record<string, unknown> => args ?? {}

function generateQuery({ type, where, data, select }: FunctionData) {
  const mergeData = (userData: Record<'where', any>): Record<string, unknown> => type === 'create' ? {
    ...userData.where,
    ...data
  } : data

  return flow(
    getUserArgs,
    (args) => ({
      where: {
        ...where,
        ...args
      }
    }),
    (args) => ({
      where: type === 'create' ? undefined : args.where,
      data: mergeData(args),
      select
    }),
    (args: any) => getClient().user[type](args)
  )
}

interface Delegate {
  findFirst(args: any): any

  delete(where: any): Promise<number>

  create(data: any): Promise<any>

  update(args: any): Promise<any>
}

function generateDelegate(queryEngine: QueryEngine, tableData: TableData): Delegate {
  return {
    findFirst: args => queryEngine.findFirst.bind(queryEngine)(tableData, args),
    delete: args => queryEngine.delete.bind(queryEngine)(tableData, args),
    create: args => queryEngine.create.bind(queryEngine)(tableData, args),
    update: args => queryEngine.update.bind(queryEngine)(tableData, args)
  }
}
