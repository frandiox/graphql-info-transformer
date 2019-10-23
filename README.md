# GraphQL Info Transformer

This is a proof of concept to transform GraphQL's `info` into an object that can be consumed by Prisma's PhotonJS (API schema and DB schema must match). Can be useful when migrating from Prisma v1 to v2 (i.e. from Prisma Binding to PhotonJS).

```js
users(_, args, ctx, info) {
  return photon.users.findMany({
    select: infoToPhotonSelect(info)
  })
})
```

Based on [this article](https://www.prisma.io/blog/graphql-server-basics-demystifying-the-info-argument-in-graphql-resolvers-6f26249f613a/) and some GraphQL-related projects.

## Installation

```sh
npm install graphql-info-transformer
yarn add graphql-info-transformer
```

## Prisma2 example

In the `example` folder:

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
