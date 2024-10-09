import { Transaction, SystemProgram, Connection, Keypair, LAMPORTS_PER_SOL, sendAndConfirmTransaction, PublicKey } from "@solana/web3.js";
import walletFile from "./dev-wallet.json"; 



const from = Keypair.fromSecretKey(new Uint8Array(walletFile.wallet));
const to = new PublicKey("4hCpB3PiJssDo15uCTJ4eH13eLAa4QEepnkyTCYJR4Zy");
const connection = new Connection("https://api.devnet.solana.com");

(async () => {
    try {
    
        const balance = await connection.getBalance(from.publicKey);
        console.log(`Solde initial du portefeuille: ${balance / LAMPORTS_PER_SOL} SOL`);

        if (balance < LAMPORTS_PER_SOL / 100) {
            throw new Error("Solde insuffisant pour effectuer le transfert");
        }

        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: from.publicKey,
                toPubkey: to,
                lamports: balance, 
            })
        );

        // Obtenir le dernier blockhash
        transaction.recentBlockhash = (await connection.getLatestBlockhash('confirmed')).blockhash;
        transaction.feePayer = from.publicKey;

        // Calculate exact fee rate to transfer entire SOL amount out
    const fee = (await
    connection.getFeeForMessage(transaction.compileMessage(),
    'confirmed')).value || 0;
    // Remove our transfer instruction to replace it
    transaction.instructions.pop();

    transaction.add(
        SystemProgram.transfer({
            fromPubkey: from.publicKey,
            toPubkey: to,
            lamports: balance - fee,
    }) );

        // Signer et confirmer la transaction
        const signature = await sendAndConfirmTransaction(
            connection,
            transaction,
            [from]
        );

        console.log(`Succès ! Consulte ta transaction ici : https://explorer.solana.com/tx/${signature}?cluster=devnet`);
    } catch (e) {
        console.error(`Erreur lors du transfert : ${e}`);
    }
})();
