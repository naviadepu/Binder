import type { Config } from "tailwindcss";
import * as defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			fontFamily: {
				poppins: ["var(--font-poppins)", ...defaultTheme.fontFamily.sans],
			},
			colors: {
				salmonpink: "#e4959e",
				licorice: "oklch(31.22% 0.012 256.37 / <alpha-value>)",
				header: "oklch(28.16% 0.0091 256.37 / <alpha-value>)",
				melon: "#f3b3a6",
				celadon: "#bbd8b3",
				xanthous: "#f3b61f",
				oldgold: "#a29f15",
				rosewood: "#510d0a",
				smokyblack: "#191102",
				back: "e4ddeaff",
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				primary: {
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				chart: {
					"1": "hsl(var(--chart-1))",
					"2": "hsl(var(--chart-2))",
					"3": "hsl(var(--chart-3))",
					"4": "hsl(var(--chart-4))",
					"5": "hsl(var(--chart-5))",
				},
			},
			// borderRadius: {
			// 	lg: "var(--radius)",
			// 	md: "calc(var(--radius) - 2px)",
			// 	sm: "calc(var(--radius) - 4px)",
			// },
		},
	},
	plugins: [require("tailwindcss-animate")],
};
export default config;
