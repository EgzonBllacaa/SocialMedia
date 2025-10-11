-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "public"."LikeType" AS ENUM ('POST', 'COMMENT');

-- CreateTable
CREATE TABLE "public"."Users" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL DEFAULT 'USER',

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Like" (
    "id" SERIAL NOT NULL,
    "type" "public"."LikeType",
    "userId" INTEGER NOT NULL,
    "postId" INTEGER,
    "commentId" INTEGER,

    CONSTRAINT "Like_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Post" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "body" VARCHAR(500) NOT NULL,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Comment" (
    "id" SERIAL NOT NULL,
    "body" VARCHAR(500) NOT NULL,
    "userId" INTEGER NOT NULL,
    "postId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Information" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "location" TEXT,
    "birthDate" TIMESTAMP(3),
    "education" TEXT,

    CONSTRAINT "Information_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Skills" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "informationId" INTEGER NOT NULL,

    CONSTRAINT "Skills_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_id_key" ON "public"."Users"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Users_username_key" ON "public"."Users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "public"."Users"("email");

-- CreateIndex
CREATE INDEX "Like_userId_idx" ON "public"."Like"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Like_userId_postId_key" ON "public"."Like"("userId", "postId");

-- CreateIndex
CREATE UNIQUE INDEX "Like_userId_commentId_key" ON "public"."Like"("userId", "commentId");

-- CreateIndex
CREATE UNIQUE INDEX "Post_id_key" ON "public"."Post"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Post_title_key" ON "public"."Post"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Comment_id_key" ON "public"."Comment"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Information_id_key" ON "public"."Information"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Information_userId_key" ON "public"."Information"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Skills_id_key" ON "public"."Skills"("id");

-- AddForeignKey
ALTER TABLE "public"."Like" ADD CONSTRAINT "Like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Like" ADD CONSTRAINT "Like_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Like" ADD CONSTRAINT "Like_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "public"."Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Post" ADD CONSTRAINT "Post_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Comment" ADD CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Information" ADD CONSTRAINT "Information_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Skills" ADD CONSTRAINT "Skills_informationId_fkey" FOREIGN KEY ("informationId") REFERENCES "public"."Information"("id") ON DELETE CASCADE ON UPDATE CASCADE;
