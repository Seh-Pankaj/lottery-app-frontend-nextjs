import { ConnectButton } from "web3uikit";

export default function Header() {
    return (
        <div className="p-5 border-b-4 flex flex-row">
            <div className="py-2 px-4 text-3xl">Decentralized Lottery</div>
            <div className="ml-auto py-2 pr-10">
                <ConnectButton />
            </div>
        </div>
    )
}