import { getSessionCookie } from "better-auth/cookies";
import { type NextRequest, NextResponse } from "next/server";
import { createI18nMiddleware } from "next-international/middleware";

const I18nMiddleware = createI18nMiddleware({
	locales: ["en", "fr"],
	defaultLocale: "fr",
});

export async function middleware(request: NextRequest) {
	const sessionCookie = getSessionCookie(request);
	const { pathname } = request.nextUrl;

	const locale = pathname.split("/")[1];

	if (sessionCookie && pathname.startsWith(`/${locale}/auth`)) {
		return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
	}

	if (!sessionCookie && pathname.startsWith(`/${locale}/dashboard`)) {
		return NextResponse.redirect(new URL(`/${locale}/`, request.url));
	}

	const i18nResponse = I18nMiddleware(request);
	if (i18nResponse) return i18nResponse;

	return NextResponse.next();
}

export const config = {
	matcher: [
		"/((?!api|static|.*\\..*|_next|favicon.ico|robots.txt).*)",
		"/(fr|en)/auth/:path*",
		"/(fr|en)/dashboard/:path*",
	],
};
