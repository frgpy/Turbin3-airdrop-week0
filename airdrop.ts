import { Connection, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import walletFile from "./dev-wallet.json"; 


const secretKeyArray = new Uint8Array(walletFile.wallet);
const keypair = Keypair.fromSecretKey(secretKeyArray);

const connection = new Connection("https://api.devnet.solana.com");

(async () => {
    try {
        
        const txhash = await connection.requestAirdrop(keypair.publicKey, 2 * LAMPORTS_PER_SOL);
        console.log(`Success! Check out your TX here: https://explorer.solana.com/tx/${txhash}?cluster=devnet`);
    } catch (e) {
        console.error(`Oops, something went wrong: ${e}`);
    }
})();
