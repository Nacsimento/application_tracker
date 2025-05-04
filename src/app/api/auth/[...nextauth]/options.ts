import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { User } from "next-auth"; // import User type from next-auth
import clientPromise from '@/lib/mongodb'
import bcrypt from 'bcrypt';


declare module "next-auth" {
  interface Session {
    user: {
      name: string;
      role?: string;
    };
  }

  interface User {
    role?: string;
  }
}


export const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "username",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "password",
        },
      },
      async authorize(credentials): Promise<User | null> {

        if (!credentials?.username || !credentials?.password) return null;

        

        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB || "jobboard");
        const user = await db.collection("users").findOne({
          name: credentials.username,
        });

        if (!user || !user.password) {
          console.log("User not found");
          return null;
        }

        const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);

        if (isPasswordCorrect) {
          return { id: user._id.toString(), name: user.name , role: user.role || 'Allpicant'};
        }
        console.log("Login failed");
        return null; // Invalid credentials
      },
    }),
  ],

  callbacks: {
    async session({ session, token, user }) {
      if (token) {
        session.user.role = token.role as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role; // role added to JWT token
      }
      return token;
    },
  },

};
