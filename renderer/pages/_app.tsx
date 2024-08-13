import { AppProps } from "next/app";
import "../public/globals.css"

export default function App({ Component, pageProps }: AppProps): JSX.Element {
    return (
        <Component {...pageProps} />
    )
}