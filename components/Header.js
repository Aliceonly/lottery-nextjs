import { ConnectButton } from "web3uikit"

export default function Header() {
    return (
        <div className="p-5 border-b-2 flex felx-row">
            Lottery
            <ConnectButton moralisAuth={false} />
        </div>
    )
}
