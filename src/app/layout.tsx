import type {Metadata} from "next";
import localFont from "next/font/local";

const myFonts = localFont({
    src: [
        {
            path: "../assets/fonts/SF-Pro-Display-Medium.otf",
            weight: "500",
            style: "normal"
        },
        {
            path: "../assets/fonts/SF-Pro-Display-Regular.otf",
            weight: "400",
            style: "normal"
        },
        {
            path: "../assets/fonts/SF-Pro-Display-Semibold.otf",
            weight: "600",
            style: "normal"
        }
    ]
});

import "./globals.css"; // Import global CSS styles
import { PopupProvider } from "@/context/PopupContext";

export const metadata: Metadata = {
    title: "Create Next App",
    description: "Generated by create next app"
};

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${myFonts.className} bg-primary`}>
                <PopupProvider>{children}</PopupProvider>
            </body>
        </html>
    );
}
