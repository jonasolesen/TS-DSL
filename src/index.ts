import dotenv from 'dotenv'
import { getClient } from 'src/client/getClient'

dotenv.config()

async function test() {
  const client = getClient()

  const newLars = await client.user.create({
    data: {
      firstName: 'Lars',
      lastName: 'test',
      age: 18,
      email: 'lars@larsen.com',
      isSubscribed: true,
      phone: '12345678'
    }
  })

  console.log('Created:', newLars)
  const test = await client.user.testPhone({ firstName: 'Lars' })
  console.log('test', test)

  const unsubscribe = await client.user.test2()
  console.log(unsubscribe)

  const lars = await client.user.findFirst({
    where: {
      id: { gte: 1 },
      firstName: { contains: 'L' },
      lastName: 'Larsen',
      NOT: { email: { contains: 'yahoo' } }
    },
    select: {
      id: true,
      firstName: true,
      phone: true,
    },
  })

  console.log('Found:', lars)

  const updatedLars = await client.user.update({
    where: {
      firstName: 'Lars'
    },
    data: {
      lastName: 'test'
    }
  })

  console.log('Updated:', updatedLars)

  const numberOfLarsRemoved = await client.user.delete({
    firstName: 'Lars'
  })

  console.log("Lars' purged:", numberOfLarsRemoved)
}

test().finally(() => process.exit())
