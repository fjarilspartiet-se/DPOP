import NextAuth, { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import prisma from '@/lib/db';
import { withErrorHandler } from '@/middleware/error';

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error('NEXTAUTH_SECRET is not defined');
}

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

// Verify database connection
async function validateDatabaseConnection() {
  try {
    await prisma.$connect();
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Missing credentials');
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          });

          if (!user?.passwordHash) {
            return null;
          }

          const isValid = await compare(credentials.password, user.passwordHash);

          if (!isValid) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          };
        } catch (error) {
          console.error('Authorization error:', error);
          throw new Error('Authentication failed');
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      try {
        return true;
      } catch (error) {
        console.error('Sign in callback error:', error);
        return false;
      }
    },
    async jwt({ token, user, account }) {
      try {
        if (user) {
          token.id = user.id;
        }
        return token;
      } catch (error) {
        console.error('JWT callback error:', error);
        return token;
      }
    },
    async session({ session, token }) {
      try {
        if (session.user) {
          session.user.id = token.id as string;
        }
        return session;
      } catch (error) {
        console.error('Session callback error:', error);
        return session;
      }
    }
  },
  events: {
    async error(error) {
      console.error('NextAuth error event:', error);
    }
  },
  logger: {
    error(code, error) {
      console.error('NextAuth error:', { code, error });
    },
    warn(code) {
      console.warn('NextAuth warning:', code);
    },
    debug(code, ...args) {
      if (process.env.NODE_ENV === 'development') {
        console.debug('NextAuth debug:', code, ...args);
      }
    }
  },
  debug: process.env.NODE_ENV === 'development',
};

async function handler(req, res) {
  // Validate database connection before proceeding
  const isDbConnected = await validateDatabaseConnection();
  if (!isDbConnected) {
    return res.status(500).json({ error: 'Database connection failed' });
  }

  return NextAuth(req, res, authOptions);
}

export default withErrorHandler(handler);
