import '@/styles/globals.scss'
import type {AppProps} from 'next/app'
import 'bootstrap/dist/css/bootstrap.css'
import {useStore} from "react-redux";
import {PersistGate} from "redux-persist/integration/react";
import {wrapper} from "@/slices/store";

function App({Component, pageProps}: AppProps) {
    const store: any = useStore();
    return (
        <PersistGate persistor={store.__persist} loading={<div>Loading..</div>}>
            <Component {...pageProps} />
        </PersistGate>
    );
}

export default wrapper.withRedux(App);