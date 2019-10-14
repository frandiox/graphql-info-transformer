# Prisma2 example

1. Setup DB

```sh
yarn prisma2 dev
yarn seed
```

2. Test query

Run the project with `yarn start` and open the Playground to try the following query:

```gql
query {
  users {
    id
    name
    email
    posts(where: { title: { contains: "prisma" } }, orderBy: { title: asc }) {
      id
      content
      title
    }
  }
}
```

It should show only 2 of the 3 posts in the seed.
