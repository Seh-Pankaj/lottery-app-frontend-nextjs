import { useEffect } from "react";
import { useMoralis } from "react-moralis"

export default function ManualHeader() {
    const { enableWeb3, account, isWeb3Enabled, Moralis, deactivateWeb3, isWeb3EnableLoading } = useMoralis();
    useEffect(() => {
        if (isWeb3Enabled) return;
        if (typeof window !== "undefined") {
            if (window.localStorage.getItem("connected")) {
                enableWeb3();
            }
        }
    }, [isWeb3Enabled, enableWeb3])

    useEffect(() => {
        Moralis.onAccountChanged((account) => {
            if (account == null) {
                window.localStorage.removeItem("connected")
                deactivateWeb3()
            }
        })
    }, [account, deactivateWeb3, Moralis])
    return (
        <div>
            {account ? <div>Connected! to {account}</div> : <button disabled={isWeb3EnableLoading} onClick={async () => {
                await enableWeb3()
                window.localStorage.setItem("connected", "injected")
            }}>Connect</button>}
        </div>
    )
}