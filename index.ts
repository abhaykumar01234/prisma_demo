import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
// const prisma = new PrismaClient({ log: ["query"] });

async function main() {
  await prisma.user.deleteMany();
  await prisma.category.deleteMany();

  const user = await prisma.user.create({
    data: {
      name: "Abhay",
      age: 30,
      email: "abhaykumar01234@gmail.com",
      userPreference: {
        create: { emailUpdates: true },
      },
      writtenPosts: {
        create: {
          title: "Hello World",
          averageRating: 4.5,
          categories: { create: { name: "New" } },
        },
      },
    },
    // include: {
    //   userPreference: true,
    // },
    select: {
      name: true,
      userPreference: { select: { id: true } },
    },
  });
  console.log({ user });

  const userCount = await prisma.user.createMany({
    data: [
      { name: "Sally", email: "sally@test.com", age: 12 },
      { name: "Sally", email: "sally@test1.com", age: 18 },
      { name: "Sally", email: "sally@test2.com", age: 27 },
      { name: "Wally", email: "wally@test.com", age: 24 },
    ],
  });
  console.log({ userCount });

  const uniqueUser = await prisma.user.findUnique({
    where: {
      // email: "sally@test.com"
      age_name: {
        age: 27,
        name: "Sally",
      },
    },
    select: { name: true, email: true, age: true },
  });

  console.log({ uniqueUser });

  const firstUser = await prisma.user.findFirst({
    where: {
      AND: {
        name: "Sally",
        role: "BASIC",
      },
    },
    select: { name: true, age: true },
  });

  console.log({ firstUser });

  const manyUsers = await prisma.user.findMany({
    where: {
      name: "Sally",
    },
    distinct: ["name", "age"],
    orderBy: { age: "asc" },
    skip: 1,
    take: 2,
    select: { name: true, age: true },
  });

  console.log({ manyUsers });

  const allUsers = await prisma.user.findMany({ select: { email: true } });
  console.log({ allUsers });

  const filteredUsers = await prisma.user.findMany({
    // where: { name: { equals: "Sally" } },
    // where: { name: { not: "Sally" } },
    // where: { name: { in: ["Sally", "Abhay"] } },
    // where: { name: { notIn: ["Sally", "Abhay"] } },
    // where: { name: { startsWith: "Sally" }, age: { gte: 18 } },
    // where: { name: { endsWith: "ally" }, email: { contains: "@test.com" } },
    where: { AND: [{ age: { gt: 20 } }, { email: { contains: "@test.com" } }] },
    // where: { OR: [{ age: { gt: 20 } }, { email: { contains: "@test.com" } }] },
    // where: { NOT: { name: "Sally" } },
    select: { email: true, age: true },
  });
  console.log({ filteredUsers });

  const relationshipFiltering = await prisma.user.findMany({
    // where: { userPreference: { emailUpdates: true } },
    where: { writtenPosts: { none: { title: "Hello World" } } },
    // where: { writtenPosts: { some: { title: "Test" } } },
    select: { email: true, age: true },
  });

  console.log({ relationshipFiltering });

  const filterParent = await prisma.post.findMany({
    where: { author: { is: { name: "Abhay" } } },
  });
  console.log({ filterParent });

  const updatePost = await prisma.post.update({
    where: { title: "Hello World" },
    data: { title: "HelloWorld2" },
  });

  console.log({ updatePost });

  const updateAllPost = await prisma.post.updateMany({
    where: { author: { is: { name: "Abhay" } } },
    data: { title: "Jello" },
  });

  console.log({ updateAllPost });

  const updatePostRating = await prisma.post.update({
    where: { title: "Jello" },
    data: { averageRating: { decrement: 0.2 } },
  });

  console.log({ updatePostRating });

  const deleteUser = await prisma.user.delete({
    where: { email: "sally@test2.com" },
  });
  console.log({ deleteUser });

  const deleteAll = await prisma.user.deleteMany();
  console.log({ deleteAll });
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
