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

  const subscriber = await client.user.newSubscriber({
    firstName: 'Lars',
    age: 20,
    lastName: 'test',
    email: 'test@lars.com'
  })
  console.log('New subscribed user:', subscriber)

  const age = 20
  const subscribersByAge = await client.user.subscribersByAge({ age })
  console.log(`Subscriber with age ${age}:`, subscribersByAge)

  const unsubscribed = await client.user.unsubscribe({ firstName: 'Lars' })
  console.log('Unsubscribed:', unsubscribed)

  const lars = await client.user.findFirst({
    where: {
      id: { gte: 1 },
      firstName: { contains: 'L' },
      lastName: 'test',
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

  const removedUsers = await client.user.deleteLars()
  console.log('Lars\' purged:', removedUsers)
}

test().finally(() => process.exit())
