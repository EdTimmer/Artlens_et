import getUserId from "../utils/getUserId";

const Query = {
  users(parent, args, { prisma }, info) {

    const opArgs = {
      first: args.first,
      skip: args.skip,
      after: args.after,
      orderBy: args.orderBy
    };

    if (args.query) {
      opArgs.where = {
        OR: [{
          name_contains: args.query
        }]
      }
    }

    return prisma.query.users(opArgs, info)
  },  

  me(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)

    return prisma.query.user({
      where: {
        id: userId
      }
    })
  },
  
  // palettes(parent, args, { prisma, request }, info) {

  //   const userId = getUserId(request);  // no false for second parameter because we want authentication

  //   const opArgs = {
  //     where: {
  //       author: {
  //         id: userId
  //       }
  //     },
  //     first: args.first,
  //     skip: args.skip,
  //     after: args.after,
  //     orderBy: args.orderBy
  //   };

  //   if (args.query) {
  //     opArgs.where.OR = [{
  //       name_contains: args.query
  //     }, {
  //       description_contains: args.query
  //     }];
  //   }
    
  //   return prisma.query.palettes(opArgs, info);

  //  },

  //  async palette(parent, args, { prisma, request }, info) {

  //   const palette = await prisma.query.palettes({  //have to use posts to access where
  //     where: {
  //       id: args.id,  //limits to one palette        
  //     }
  //   }, info);

  //   return palette;
  //  },

   palettes2(parent, args, { prisma, request }, info) {

    const userId = getUserId(request);  // no false for second parameter because we want authentication

    const opArgs = {
      where: {
        author: {
          id: userId
        }
      },
      first: args.first,
      skip: args.skip,
      after: args.after,
      orderBy: args.orderBy
    };

    if (args.query) {
      opArgs.where.OR = [{
        name_contains: args.query
      }, {
        description_contains: args.query
      }];
    }
    
    return prisma.query.palettes2(opArgs, info);

   },

   async palette2(parent, args, { prisma, request }, info) {

    const palette2 = await prisma.query.palettes2({  //have to use posts to access where
      where: {
        id: args.id,  //limits to one palette        
      }
    }, info);

    return palette2;
   },
}

export { Query as default };
