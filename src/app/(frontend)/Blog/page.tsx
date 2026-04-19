import { getPayload } from 'payload'
import configPromise from '@payload-config'

export default async function HomePage() {
  const payload = await getPayload({ config: configPromise })
  
  const { docs: posts } = await payload.find({
    // @ts-ignore
    collection: 'posts',
    where: {
      status: { equals: 'published' }
    },
    sort: '-createdAt',
    limit: 10,
  })

  console.log('Total posts:', posts)

  return (
    <div className='h-screen w-full bg-blue-500'>
      <h1>Blog Posts</h1>
      {posts.length === 0 && <p>No posts found</p>}
      {posts.map((post: any) => (
        <div key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
        </div>
      ))}
    </div>
  )
}