import { useWeb3Contract } from "react-moralis"
import { abi, contractAddress } from "../constants"
import { useMoralis } from "react-moralis"
import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { useNotification } from "web3uikit"

export default function LotteryEntrance() {
    const { chainId: chainIdHex } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const raffleAddress = chainId in contractAddress ? contractAddress[chainId][0] : null
  const [entranceFee, setEntranceFee] = useState("0")
  const [numPlayer,setNumPlayer] = useState("0")
  const [recentWinner, setRecentWinner] = useState("0")


    const dispatch = useNotification()

        const { runContractFunction: enterRaffle, isLoading,isFetching } = useWeb3Contract({
            abi: abi,
            contractAddress: raffleAddress,
            functionName: "enterRaffle",
            params: {},
            msgValue: entranceFee,
        })

    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getEntranceFee",
        params: {},
    })
  
      const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
          abi: abi,
          contractAddress: raffleAddress,
          functionName: "getNumberOfPlayers",
          params: {},
      })
  
       const { runContractFunction: getRecentWinner } = useWeb3Contract({
           abi: abi,
           contractAddress: raffleAddress,
           functionName: "getRecentWinner",
           params: {},
       })
  
              async function updateUI() {
                  const fee = (await getEntranceFee()).toString()
                  const numPlayers = (await getNumberOfPlayers()).toString()
                  const recentWinner = (await getRecentWinner()).toString()
                  setEntranceFee(fee)
                  setNumPlayer(numPlayers)
                  setRecentWinner(recentWinner)
              }


    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled])
  
  const handleSuccess = async function (tx) {
    await tx.wait(1)
    handleNewNotification(tx)
    updateUI()
  }

  

  const handleNewNotification = function () {
    dispatch({
      type: "info",
      message: "Transaction Compelete",
      title: "Tx Notification",
      position: "topR",
      icon:"bell"
    })
   }



    return (
        <div>
            {raffleAddress ? (
                <button
                    onClick={async function () {
                        await enterRaffle({
                            onSuccess: handleSuccess,
                            onError: (error) => console.log(error),
                        })
                    }}
                    disabled={isLoading || isFetching}
                >
                    Enter Raffle
                </button>
            ) : (
                <div>No Raffle Address</div>
            )}
        <div>Entrance Fee: {ethers.utils.formatUnits(entranceFee, "ether")} ETH
          Players:{numPlayer}
          RecentWinner:{recentWinner}
        </div>
              
      </div>
    )
}
