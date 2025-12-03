// import type { APIRoute } from 'astro';

// export const prerender = false;

// export const POST: APIRoute = async ({ cookies, redirect, request }) => {
//   const formData = await request.formData();

//   const decision = formData.get('decision');
//   const preferences = formData.getAll('preferences');

//   // e.g.: { decision: "selected" | "none", preferences: ["analytics", "marketing"] }
//   const value = JSON.stringify({
//     decision,
//     preferences,
//   });

//   cookies.set('cookie-consent', value, {
//     httpOnly: true,
//     maxAge: 60 * 60 * 24 * 365,
//     path: '/',
//     sameSite: 'lax',
//     secure: false,
//   });

//   const referer = request.headers.get('referer') ?? '/';
//   return redirect(referer);
// };
