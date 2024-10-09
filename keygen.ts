import { Keypair } from "@solana/web3.js";
import dotenv from 'dotenv';
import fs from 'fs';
import bs58 from 'bs58';
import promptSync from 'prompt-sync';

dotenv.config();

let kp = Keypair.generate();

console.log(`You've generated a new Solana wallet:
${kp.publicKey.toBase58()}
To save your wallet, copy and paste the output of the following into a JSON file:`);

console.log(`[${kp.secretKey.toString()}]`);


function base58ToWallet(base58: string): Uint8Array {
    return bs58.decode(base58);
}

function walletToBase58(wallet: Uint8Array): string {
    return bs58.encode(wallet);
}
const prompt = promptSync();

function promptBase58ToWallet() {
    const base58Input = prompt('Enter your base58 private key: ');

    if (base58Input) {
        const wallet = base58ToWallet(base58Input);
        console.log('Wallet (byte array):', Array.from(wallet));

        const base58Output = walletToBase58(wallet);
        console.log('Base58 representation:', base58Output);
    } else {
        console.log('No base58 key provided.');
    }
}

