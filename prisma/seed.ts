import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

const minutesAgo = (minutes: number) =>
  new Date(Date.now() - minutes * 60 * 1000);

async function main() {
  await prisma.message.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.aiMessage.deleteMany();
  await prisma.aiConversation.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.authToken.deleteMany();
  await prisma.session.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.knowledgeArticle.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.user.deleteMany();

  const password = await bcrypt.hash('password123', 10);

  const viviana = await prisma.user.create({
    data: { name: 'Viviana', email: 'viviana@aisupport.dev', password, role: 'ADMIN' },
  });
  const sophia = await prisma.user.create({
    data: { name: 'Sophia', email: 'sophia@aisupport.dev', password, role: 'AGENT' },
  });
  const michael = await prisma.user.create({
    data: { name: 'Michael', email: 'michael@aisupport.dev', password, role: 'AGENT' },
  });
  const david = await prisma.user.create({
    data: { name: 'David', email: 'david@aisupport.dev', password, role: 'AGENT' },
  });

  const john = await prisma.customer.create({
    data: { name: 'John Doe', email: 'john@test.com', company: 'Google', status: 'ACTIVE' },
  });
  const sarah = await prisma.customer.create({
    data: { name: 'Sarah Lee', email: 'sarah@test.com', company: 'Microsoft', status: 'ACTIVE' },
  });
  await prisma.customer.create({
    data: { name: 'Michael Smith', email: 'mike@test.com', company: 'Amazon', status: 'INACTIVE' },
  });
  const emily = await prisma.customer.create({
    data: { name: 'Emily Brown', email: 'emily@test.com', company: 'Netflix', status: 'ACTIVE' },
  });
  await prisma.customer.create({
    data: { name: 'Daniel Wilson', email: 'daniel@test.com', company: 'Spotify', status: 'INACTIVE' },
  });
  const carlos = await prisma.customer.create({
    data: { name: 'Carlos Ruiz', email: 'carlos@test.com', company: 'Airbnb', status: 'ACTIVE' },
  });

  await prisma.ticket.createMany({
    data: [
      {
        subject: 'Login issue',
        status: 'OPEN',
        priority: 'HIGH',
        customerId: john.id,
        agentId: sophia.id,
        createdById: viviana.id,
        createdAt: minutesAgo(120),
        updatedAt: minutesAgo(5),
      },
      {
        subject: 'Payment failed',
        status: 'PENDING',
        priority: 'MEDIUM',
        customerId: sarah.id,
        agentId: michael.id,
        createdById: viviana.id,
        createdAt: minutesAgo(360),
        updatedAt: minutesAgo(20),
      },
      {
        subject: 'Refund request',
        status: 'CLOSED',
        priority: 'LOW',
        customerId: emily.id,
        agentId: david.id,
        createdById: viviana.id,
        createdAt: minutesAgo(4320),
        updatedAt: minutesAgo(1440),
      },
      {
        subject: 'AI generated wrong answer',
        status: 'OPEN',
        priority: 'HIGH',
        customerId: carlos.id,
        agentId: sophia.id,
        createdById: viviana.id,
        createdAt: minutesAgo(2880),
        updatedAt: minutesAgo(60),
      },
    ],
  });

  await prisma.conversation.create({
    data: {
      customerId: john.id,
      avatar: 'JD',
      online: true,
      unread: 2,
      lastMessage: 'I need help with my order.',
      messages: {
        create: [
          { sender: 'CUSTOMER', text: 'Hello', createdAt: minutesAgo(30) },
          { sender: 'AGENT', text: 'Hi John! How can I help?', createdAt: minutesAgo(29) },
          { sender: 'CUSTOMER', text: 'I need help with my order.', createdAt: minutesAgo(27) },
        ],
      },
    },
  });

  await prisma.conversation.create({
    data: {
      customerId: sarah.id,
      avatar: 'SL',
      online: false,
      unread: 0,
      lastMessage: 'Thanks!',
      messages: {
        create: [
          { sender: 'CUSTOMER', text: 'Payment failed', createdAt: minutesAgo(120) },
          { sender: 'AGENT', text: 'Please try again.', createdAt: minutesAgo(117) },
        ],
      },
    },
  });

  await prisma.knowledgeArticle.createMany({
    data: [
      {
        title: 'Getting Started',
        slug: 'getting-started',
        category: 'General',
        status: 'PUBLISHED',
        content: 'Step-by-step guide to get started with the support dashboard.',
        authorId: viviana.id,
        publishedAt: minutesAgo(10080),
        views: 842,
        createdAt: minutesAgo(10080),
        updatedAt: minutesAgo(8640),
      },
      {
        title: 'Reset Password',
        slug: 'reset-password',
        category: 'Authentication',
        status: 'DRAFT',
        content: 'How to reset a forgotten password on your account.',
        authorId: viviana.id,
        views: 215,
        createdAt: minutesAgo(5760),
        updatedAt: minutesAgo(2880),
      },
      {
        title: 'Manage Tickets',
        slug: 'manage-tickets',
        category: 'Support',
        status: 'PUBLISHED',
        content: 'Best practices for triaging and resolving support tickets.',
        authorId: viviana.id,
        publishedAt: minutesAgo(17280),
        views: 1360,
        createdAt: minutesAgo(17280),
        updatedAt: minutesAgo(14400),
      },
    ],
  });

  console.log('Database seeded successfully.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
