import dotenv from 'dotenv'
import { getClient } from 'src/client/getClient'

dotenv.config()

async function test() {
  const client = getClient()

  const newUser = await client.user.create({
    data: {
      firstName: 'John',
      lastName: 'Smith',
      age: 18,
      email: 'john@smith.com',
      isSubscribed: true,
      phone: '12345678'
    }
  })
  console.log('Created:', newUser)

  const subscriber = await client.user.newSubscriber({
    firstName: 'Jane',
    age: 20,
    lastName: 'Doe',
    email: 'jane@doe.com'
  })
  console.log('New subscribed user:', subscriber)

  const age = 20
  const subscribersByAge = await client.user.subscribersByAge({ age })
  console.log(`Subscriber with age ${age}:`, subscribersByAge)

  const unsubscribed = await client.user.unsubscribe({ firstName: 'John' })
  console.log('Unsubscribed:', unsubscribed)

  const found = await client.user.findFirst({
    where: {
      id: { gte: 1 },
      firstName: { contains: 'J' },
      NOT: { email: { contains: 'yahoo' } }
    },
    select: {
      id: true,
      firstName: true,
      phone: true,
    },
  })
  console.log('Found:', found)

  const updated = await client.user.update({
    where: {
      firstName: 'John'
    },
    data: {
      lastName: 'Johnson'
    }
  })
  console.log('Updated:', updated)

  const removedUsers = await client.user.deleteJohn()
  console.log('Johns purged:', removedUsers)
}

test().finally(() => process.exit())
