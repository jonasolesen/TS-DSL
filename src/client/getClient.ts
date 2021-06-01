import { QueryEngine } from 'src/client/QueryEngine'
import { Client, FunctionData, tableFunctions, tableData, TableData } from 'src/client/generated'
import { flow } from 'fp-ts/function'

let client: Client

export function getClient(): Client {
  if (client) return client
  const queryEngine = new QueryEngine()
  const newClient: Record<string, any> = {}
  let tableName: keyof Client

  for (tableName in tableData) {
    newClient[tableName] = generateDelegate(queryEngine, tableData[tableName])

    const functions = tableFunctions[tableName]
    if (functions) Object.entries(functions).forEach(([name, data]) => {
      newClient[tableName][name] = generateQuery(tableName, data)
    })
  }

  return client = newClient as Client
}

function generateQuery(tableName: keyof Client, { type, where, data, select }: FunctionData) {
  const mergeData = (userData: Record<string, unknown>) => type === 'create' ? {
    ...userData,
    ...data
  } : data ?? {}

  return flow(
    (args?: Record<string, unknown>) => args ?? {},
    (args) => ({
      where: type === 'create' ? undefined : { ...where, ...args },
      data: mergeData(args),
      select
    }),
    // @ts-ignore
    (args: any) => getClient()[tableName][type](args)
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
