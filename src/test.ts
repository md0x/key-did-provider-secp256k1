import { CeramicClient } from "@ceramicnetwork/http-client";
import { TileDocument } from "@ceramicnetwork/stream-tile";
import { getResolver } from "key-did-resolver";
import { DID } from "dids";

import { encodeDIDWithLit, Secp256k1ProviderWithLit } from "./index";

const PKP_PUBLIC_KEY =
  "0x04e9cf329c3a902299e0636e963f8d4ac7d681dfc7324be8cffe067cd7d0b7bdcf001ff2dda1e7a35c6bc7c28da389c636a0fe3aba179c79493732e987824e9222";

const run = async () => {
  //   const authSig = await getAuthSig();
  const ceramic = new CeramicClient("https://ceramic-clay.3boxlabs.com");
  // -- get your encode did with your PKP public key
  const encodedDID = await encodeDIDWithLit(PKP_PUBLIC_KEY);
  // -- static lit action code hosted on https://ipfs.io/ipfs/QmYrfiMf6TDuU3NiTbZANiELNBCyn2f66Zok3gEuzRTYmL
  const provider = new Secp256k1ProviderWithLit({
    did: encodedDID,
    ipfsId: "QmYrfiMf6TDuU3NiTbZANiELNBCyn2f66Zok3gEuzRTYmL",
  });
  const did = new DID({ provider, resolver: getResolver() as any });
  // -- authenticate
  await did.authenticate();
  ceramic.did = did;
  console.log("DID:", did);
  // -- write to ceramic stream
  const doc = await TileDocument.create(ceramic, "Hola hola ¿Cómo estás?");
  console.log("Doc/StreamID:", doc.id.toString());
  // -- read a ceramic stream
  var loadDoc = await TileDocument.load(ceramic, doc.id.toString());
  console.log("Specific doc:", loadDoc.content);
};

run().catch(console.error);
console.log("test");
