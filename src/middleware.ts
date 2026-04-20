import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const pathname = req.nextUrl.pathname

    // Redirect candidates away from employer routes and vice versa
    if (pathname.startsWith('/employer') && token?.role !== 'EMPLOYER' && token?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/candidate/dashboard', req.url))
    }

    if (pathname.startsWith('/candidate') && token?.role !== 'CANDIDATE' && token?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/employer/dashboard', req.url))
    }

    if (pathname.startsWith('/admin') && token?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: ['/candidate/:path*', '/employer/:path*', '/admin/:path*'],
}
