import { mnemonicToAccount, privateKeyToAccount } from "viem/accounts";
import {
  EthereumWalletMockAbstract,
  type WalletMock,
} from "../api/EthereumWalletMockAbstract";

export class EthereumWalletMock extends EthereumWalletMockAbstract {
  constructor(wallet: WalletMock = "metamask") {
    super(wallet);
    this.wallet = wallet;
  }

  // /**
  //  * Imports a wallet using the given seed phrase.
  //  *
  //  * @param seedPhrase - The seed phrase to import.
  //  */
  importWallet(seedPhrase: string) {
    this.seedPhrase = seedPhrase;

    cy.window().then((cypressWindow) => {
      cypressWindow.Web3Mock.mock({
        blockchain: "ethereum",
        wallet: "metamask",
        accounts: { return: ["0xd73b04b0e696b0945283defa3eee453814758f1a"] },
      });
    });
  }

  // /**
  //  * Retrieves the current account address.
  //  */
  // async getAllAccounts(): Promise<string[]> {}
  //
  // /**
  //  * Adds a new account. This account is based on the initially imported seed phrase.
  //  */
  // async addNewAccount() {
  //   const accounts = await this.getAllAccounts();
  // }

  // /**
  //  * Imports a wallet using the given private key.
  //  *
  //  * @param privateKey - The private key to import.
  //  */
  importWalletFromPrivateKey(privateKey: `0x${string}`) {
    const newAccount = privateKeyToAccount(privateKey);

    cy.window().then((cypressWindow) => {
      cypressWindow.Web3Mock.mock({
        blockchain: "ethereum",
        wallet: "metamask",
        accounts: { return: [newAccount.address] },
      });
    });
  }

  // /**
  //  * Switches to the account with the given name.
  //  *
  //  * @param accountAddress - The name of the account to switch to.
  //  */
  // async switchAccount(accountAddress: string) {}
  //
  // /**
  //  * Adds a new network.
  //  *
  //  * @param network - The network object to use for adding the new network.
  //  */
  // async addNetwork(network: Network) {}
  //
  // /**
  //  * Retrieves the current account address.
  //  */
  // async getAccountAddress() {
  //   return (await this.getAllAccounts())[0];
  // }
  //
  // /**
  //  * Switches to the network with the given name.
  //  *
  //  * @param networkName - The name of the network to switch to.
  //  */
  // async switchNetwork(networkName: string) {}
  //
  // /**
  //  * Connects wallet to the dapp.
  //  *
  //  * @param wallet - The wallet to connect to the dapp.
  //  */
  // async connectToDapp(wallet: WalletMock = "metamask") {
  //   this.wallet = wallet;
  // }
}
