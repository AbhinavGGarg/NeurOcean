import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1280px"
      }
    },
    extend: {
      colors: {
        bg: {
          950: "#03070f",
          900: "#050b18",
          800: "#08142b"
        },
        ocean: {
          100: "#dff6ff",
          200: "#b4e9ff",
          300: "#86dcff",
          400: "#4cc8ff",
          500: "#21b3f5",
          600: "#148ac2"
        },
        seafoam: {
          300: "#6cf7d4",
          400: "#36eac4",
          500: "#16cda8"
        },
        indigo: {
          500: "#6675ff"
        }
      },
      boxShadow: {
        ambient: "0 30px 80px rgba(5, 15, 30, 0.55)",
        glow: "0 0 0 1px rgba(126, 214, 255, 0.35), 0 20px 45px rgba(15, 126, 201, 0.24)"
      },
      backgroundImage: {
        "mesh-gradient": "radial-gradient(60% 55% at 20% 20%, rgba(67, 175, 255, 0.35), transparent 60%), radial-gradient(50% 50% at 80% 15%, rgba(52, 237, 192, 0.28), transparent 65%), radial-gradient(65% 70% at 60% 90%, rgba(103, 114, 255, 0.22), transparent 75%)"
      },
      keyframes: {
        drift: {
          "0%, 100%": { transform: "translate3d(0,0,0)" },
          "50%": { transform: "translate3d(0,-12px,0)" }
        },
        wave: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-120px)" }
        },
        pulseSoft: {
          "0%, 100%": { opacity: "0.45", transform: "scale(1)" },
          "50%": { opacity: "0.9", transform: "scale(1.06)" }
        }
      },
      animation: {
        drift: "drift 8s ease-in-out infinite",
        wave: "wave 20s linear infinite",
        pulseSoft: "pulseSoft 2.4s ease-in-out infinite"
      },
      borderRadius: {
        xl2: "1.25rem",
        xl3: "1.5rem"
      }
    }
  },
  plugins: []
};

export default config;
