// code adapted from https://github.com/LIT-Protocol/hotwallet-signing-example/blob/main/sign.js
import { fromString as uint8arrayFromString } from "uint8arrays/from-string";
import ethers from "ethers";
import siwe from "siwe";

export const getAuthSig = async () => {
  if (!process.env.PRIVATE_KEY) throw new Error("No private key found");
  const privKey = process.env.PRIVATE_KEY!;
  const privKeyBuffer = uint8arrayFromString(privKey, "base16");
  const wallet = new ethers.Wallet(privKeyBuffer);

  const domain = "localhost";
  const origin = "https://localhost/login";
  const statement =
    "This is a test statement.  You can put anything you want here.";

  const siweMessage = new siwe.SiweMessage({
    domain,
    address: wallet.address,
    statement,
    uri: origin,
    version: "1",
    chainId: 1,
  });

  const messageToSign = siweMessage.prepareMessage();

  const signature = await wallet.signMessage(messageToSign);

  console.log("signature", signature);

  const recoveredAddress = ethers.utils.verifyMessage(messageToSign, signature);

  const authSig = {
    sig: signature,
    derivedVia: "web3.eth.personal.sign",
    signedMessage: messageToSign,
    address: recoveredAddress,
  };
  return authSig;
};
