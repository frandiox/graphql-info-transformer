const path = require("path");
const { GraphQLServer } = require("graphql-yoga");
const Photon = require("@generated/photon");
const { importSchema } = require("graphql-import");
const { infoToPhotonSelect } = require("../../index");

const photon = new Photon();

const resolvers = {
  Query: {
    async users(_, args, ctx, info) {
      return photon.users.findMany({
        select: infoToPhotonSelect(info)
      });
    }
  }
};

const server = new GraphQLServer({
  typeDefs: importSchema(path.join(__dirname, "./schema.graphql")),
  resolvers
});

server.start(() => console.log(`🚀 Server ready at: http://localhost:4000️`));
