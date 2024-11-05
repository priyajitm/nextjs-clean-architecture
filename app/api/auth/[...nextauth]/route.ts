import NextAuth, { NextAuthOptions, Session, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { container } from "@infrastructure/di/container";
import { IUserService } from "@/services/interfaces/IUserService";
import { TYPES } from "@infrastructure/di/types";
import { JWT } from "next-auth/jwt";
import { LoginDTO } from "@domain/dto/LoginDTO";

// connectToDatabase();

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsedCredentials = LoginDTO.safeParse(credentials);
        if (!parsedCredentials.success) {
          throw new Error("Invalid login input");
        }

        const userService = container.get<IUserService>(TYPES.UserService);
        const { email, password } = parsedCredentials.data;
        const user = await userService.findByEmail(email);

        // if (!user || !(await compare(password, user.password))) {
        //   return null;
        // }

        return {
          id: user._id.toString(),
          email: user.email,
          roles: user.roles,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        token.roles = user.roles;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.roles = token.roles;
      }
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export const { GET, POST } = NextAuth(authOptions);
