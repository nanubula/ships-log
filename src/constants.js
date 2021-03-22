import * as Web3 from 'web3'
import BigNumber from 'bignumber.js'
import { PortisProvider } from 'portis'
const sigUtil = require('eth-sig-util');

export const GOOGLE_ANALYTICS_ID = 'UA-111688253-4'
export const OPENSEA_URL = "https://opensea.io"
export const OPENSEA_JS_URL = "https://github.com/ProjectOpenSea/opensea-js"
export const GITHUB_URL = "https://github.com/ProjectOpenSea/ships-log"
export const DEFAULT_DECIMALS = 18
export const SEACREATURES_FACTORY_ADDRESS = "0xeb391f33b7da0abb89a68adcb92ae10ee7b24e78"
export const SEACREATURES_INDIVIDUAL_ADDRESS = "0xbd4cfd135aaeaf77b760c1a0f778c5e1ca876c5a"
export let web3Provider = typeof web3 !== 'undefined'
  ? window.web3.currentProvider
  : new Web3.providers.HttpProvider('https://mainnet.infura.io')

// Replace this with Redux for more complex logic
const networkCallbacks = []
export const onNetworkUpdate = (callback) => {
  networkCallbacks.push(callback)
}

export async function connectWallet() {
  if (!window.web3) {
    web3Provider = new PortisProvider({
      // Put your Portis API key here
    })
  } else if (window.ethereum) {
    //window.ethereum.enable()
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    networkCallbacks.map((c) => c(web3Provider))

    return accounts[0];
  } else {
    const errorMessage = 'You need an Ethereum wallet to interact with this marketplace. Unlock your wallet, get MetaMask.io or Portis on desktop, or get Trust Wallet or Coinbase Wallet on mobile.'
    alert(errorMessage)
    throw new Error(errorMessage)
  }
  networkCallbacks.map((c) => c(web3Provider))
}

export async function signMsg(signer, data) {
  return new Promise((resolve, reject) => { window.web3.currentProvider.sendAsync(
    {
        method: "eth_signTypedData_v3",
        params: [signer, JSON.stringify(data)],
        from: signer
    },
    function(err, result) {
        if (err) {
            return console.error(err);
        }
        // const signature = result.result.substring(2);
        // const r = "0x" + signature.substring(0, 64);
        // const s = "0x" + signature.substring(64, 128);
        // const v = parseInt(signature.substring(128, 130), 16);
        // The signature is now comprised of r, s, and v.

        const recovered = sigUtil.recoverTypedSignature({
          data: data,
          sig: result.result
        })
        resolve(recovered)
        }       
    )});
}

export function toUnitAmount(baseAmount, tokenContract = null) {
  const decimals = tokenContract && tokenContract.decimals != null
    ? tokenContract.decimals
    : DEFAULT_DECIMALS

  const amountBN = new BigNumber(baseAmount.toString())
  return amountBN.div(new BigNumber(10).pow(decimals))
}

export function toBaseUnitAmount(unitAmount, tokenContract = null) {
  const decimals = tokenContract && tokenContract.decimals != null
    ? tokenContract.decimals
    : DEFAULT_DECIMALS

  const amountBN = new BigNumber(unitAmount.toString())
  return amountBN.times(new BigNumber(10).pow(decimals))
}

export async function promisify(inner) {
  return new Promise((resolve, reject) =>
    inner((err, res) => {
      if (err) { reject(err) }
      resolve(res)
    })
  )
}
