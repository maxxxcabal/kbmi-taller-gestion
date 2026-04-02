import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: [
    "/",
    "/ordenes/:path*",
    "/clientes/:path*",
    "/inventario/:path*",
    "/stats/:path*",
    "/pos/:path*",
    "/settings/:path*",
    "/config/:path*",
    "/kb/:path*",
    "/kb",
    "/settings",
  ],
};
