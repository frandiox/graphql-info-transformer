const Photon = require("@generated/photon");
const photon = new Photon.default();

async function main() {
  await photon.users.create({
    data: {
      email: "bob@prisma.io",
      name: "Bob",
      posts: {
        create: [
          {
            title: "Watch the talks from Prisma Day 2019",
            content: "https://www.prisma.io/blog/z11sg6ipb3i1/",
            published: true
          },
          {
            title: "Subscribe to GraphQL Weekly for community news",
            content: "https://graphqlweekly.com/",
            published: true
          },
          {
            title: "Follow Prisma on Twitter",
            content: "https://twitter.com/prisma/",
            published: false
          }
        ]
      }
    }
  });
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await photon.disconnect();
  });
