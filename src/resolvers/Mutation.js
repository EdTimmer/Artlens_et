import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
import getUserId from '../utils/getUserId';
import generateToken from '../utils/generateToken';
import hashPassword from '../utils/hashPassword';

const Mutation = {

  async createUser(parent, args, { prisma }, info) {

    const password = await hashPassword(args.data.password)

    const user = await prisma.mutation.createUser({
      data: {
        ...args.data,
        password
      }
    });

    return {
      user,
      token: generateToken(user.id)
    }
  },

  async login(parent, args, { prisma }, info) {
    const user = await prisma.query.user({
      where: {
        email: args.data.email
      }
    });

    if (!user) {
      throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(args.data.password, user.password);

    if (!isMatch) {
      throw new Error('Unable to login');
    }

    return {
      user,
      token: generateToken(user.id)
    };
  },

  deleteUser(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);
    return prisma.mutation.deleteUser({
      where: {
        id: userId
      }
    }, info);

  },

  async updateUser(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    if (typeof args.data.password === 'string') {
      args.data.password = await hashPassword(args.data.password);
    }

    return prisma.mutation.updateUser({
      where: {
        id: userId
      },
      data: args.data
    }, info);

  },
  
  
  // async createPalette(parent, args, { prisma, request }, info) {

  //   const userId = getUserId(request);

  //   return await prisma.mutation.createPalette({
  //     data: {
  //       name: args.data.name,
  //       description: args.data.description,
        
  //       author: {
  //         connect: {
  //           id: userId
  //         }
  //       }
  //     }
  //   }, info);
  // },

  async createPalette2(parent, args, { prisma, request }, info) {

    const userId = getUserId(request);

    return await prisma.mutation.createPalette2({
      data: {
        name: args.data.name,
        description: args.data.description,
        
        author: {
          connect: {
            id: userId
          }
        }
      }
    }, info);
  },
};

export { Mutation as default };
