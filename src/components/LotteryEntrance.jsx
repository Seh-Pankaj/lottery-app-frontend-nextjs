import { useMoralis, useWeb3Contract } from "react-moralis"
import { abi, contractAddresses } from "../constants"
import { useEffect, useState } from "react";
import { ethers } from "ethers"
import { useNotification } from "web3uikit";

export default function LotteryEntrance() {
    const [entranceFee, setEntranceFee] = useState("0");
    const [numberOfPlayers, setNumberOfPlayers] = useState("0");
    const [recentWinner, setRecentWinner] = useState("0");
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
    const chainId = parseInt(chainIdHex);
    const lotteryAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null;

    const dispatch = useNotification();

    const { runContractFunction: enterLottery, isLoading, isFetching } = useWeb3Contract({
        abi: abi,
        contractAddress: lotteryAddress,
        functionName: "enterLottery",
        params: {},
        msgValue: entranceFee,
    })

    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: lotteryAddress,
        functionName: "getEntryFee",
        params: {},
    })
    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: lotteryAddress,
        functionName: "getRecentWinner",
        params: {},
    })
    const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress: lotteryAddress,
        functionName: "getNumberOfPlayers",
        params: {},
    })

    async function updateUI() {
        const updatedEntranceFee = (await getEntranceFee()).toString();
        const updatedNumberOfPlayers = (await getNumberOfPlayers()).toString();
        const updatedRecentWinner = await getRecentWinner();
        setEntranceFee(updatedEntranceFee);
        setNumberOfPlayers(updatedNumberOfPlayers);
        setRecentWinner(updatedRecentWinner);
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            // try to read the lottery entrance fee
            updateUI();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isWeb3Enabled])

    const handleSuccess = async (txn) => {
        await txn.wait(1);
        handleNewNotification()
        updateUI();
    }

    const handleNewNotification = () => {
        dispatch({
            type: "info",
            position: "topR",
            message: "Transaction Complete",
            title: "Enter Lottery Transaction",
        })
    }

    return (
        <div>
            {lotteryAddress ? (
                <div className="p-5">
                    <button className='bg-blue-300 hover:bg-blue-500 text-white font-medium p-2 rounded-md'
                        disabled={isLoading || isFetching}
                        onClick={async () => await enterLottery({
                            onSuccess: handleSuccess,
                            onError: (e) => console.log(e)
                        })} >{isFetching || isLoading ? (<div class="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>)
                            : (<div>Enter Lottery</div>)}</button><br />
                    Entrance Fee : {ethers.utils.formatUnits(entranceFee, "ether")} ETH <br />
                    Number of Players : {numberOfPlayers} <br />
                    Recent Winner : {recentWinner}
                </div>) :
                (<div>
                    No address selected
                </div>)

            }
        </div >
    )
}