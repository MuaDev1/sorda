import NextAuth from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

const handler = NextAuth({
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID || '',
      clientSecret: process.env.DISCORD_CLIENT_SECRET || '',
      authorization: {
        params: {
          scope: 'identify email guilds.join', // إضافة guilds.join
        },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET || '',
  callbacks: {
    async signIn({ user, account }) {
      await dbConnect();

      // تحقق من وجود المستخدم في قاعدة البيانات
      const existingUser = await User.findOne({ email: user.email });
      if (!existingUser) {
        await User.create({
          name: user.name,
          email: user.email,
          image: user.image,
          role: 'user', // تعيين الرتبة الافتراضية "user"
        });
      }

      // إدخال العضو تلقائيًا إلى السيرفر
      const GUILD_ID = process.env.DISCORD_GUILD_ID; // معرف السيرفر الخاص بك
      const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN; // التوكن الخاص بالبوت

      try {
        if (account?.access_token) {
          const response = await fetch(`https://discord.com/api/v10/guilds/${GUILD_ID}/members/${user.id}`, {
            method: 'PUT',
            headers: {
              Authorization: `Bot ${BOT_TOKEN}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              access_token: account.access_token,
            }),
          });

          if (!response.ok) {
            console.error(`Failed to add user to Discord server: ${response.status} ${response.statusText}`);
            return false;
          }
        }
      } catch (error) {
        console.error('Error adding user to Discord server:', error);
        return false;
      }

      return true;
    },
    async session({ session }) {
      await dbConnect();

      const dbUser = await User.findOne({ email: session.user?.email });
      if (dbUser) {
        session.user.id = dbUser._id;
        session.user.role = dbUser.role;
      }

      return session;
    },
  },
});

export { handler as GET, handler as POST };
