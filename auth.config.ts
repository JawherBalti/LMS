import bcrypt from 'bcryptjs';
import Credentials from "next-auth/providers/credentials"
import { LoginSchema } from "./schemas"
import type { NextAuthConfig } from "next-auth"
import { getUserByEmail } from "./data/user"
import Google from 'next-auth/providers/google';
import Github from 'next-auth/providers/github';
import Discord from "next-auth/providers/discord";
import Wordpress from "next-auth/providers/wordpress";
import Linkedin from "next-auth/providers/linkedin";
import Zoom from "next-auth/providers/zoom";
import Reddit from "next-auth/providers/reddit";

export default {
  providers: [
    Reddit({
      clientId: process.env.REDDIT_CLIENT_ID,
      clientSecret: process.env.REDDIT_CLIENT_SECRET,
    }),
    Zoom({
      clientId: process.env.ZOOM_CLIENT_ID,
      clientSecret: process.env.ZOOM_CLIENT_SECRET,
    }),
    Linkedin({
      clientId: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    }),
    Wordpress({
      clientId: process.env.WORDPRESS_CLIENT_ID,
      clientSecret: process.env.WORDPRESS_CLIENT_SECRET,
      token: {
        url: 'https://public-api.wordpress.com/oauth2/token',
        async request(context: any) {
          const { provider, params: parameters, checks, client } = context
          const { callbackUrl } = provider
          console.log(context)
          const tokenset = await client.grant({
            grant_type: 'authorization_code',
            code: parameters.code,
            redirect_uri: callbackUrl,
            code_verifier: checks.code_verifier,
            client_id: process.env.WORDPRESS_CLIENT_ID,
            client_secret: process.env.WORDPRESS_CLIENT_SECRET,
          })
          return { tokens: tokenset }
        },
      },
    }),
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET
    }),
    Github({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials)
        if (validatedFields.success) {
          const { email, password } = validatedFields.data

          const user = await getUserByEmail(email)
          if (!user || !user.password) return null

          const passwordMatch = await bcrypt.compare(password, user.password)

          if (passwordMatch) return user
        }
        return null
      }
    })
  ],
} satisfies NextAuthConfig