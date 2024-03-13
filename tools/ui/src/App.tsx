import { useEffect } from 'react';

import './App.css';
import {
  makeAgoricChainStorageWatcher,
  AgoricChainStoragePathKind as Kind,
} from '@agoric/rpc';
import { create } from 'zustand';
import {
  makeAgoricWalletConnection,
  suggestChain,
} from '@agoric/web-components';
import { subscribeLatest } from '@agoric/notifier';
import { makeCopyBag } from '@agoric/store';
import { Logos } from './components/Logos';
import { Inventory } from './components/Inventory';
import { Trade } from './components/Trade';

const { entries, fromEntries } = Object;

const RUN_ENV = import.meta.env.VITE_RUN_ENV || 'localhost';
if (!['localhost', 'agoric_chain'].includes(RUN_ENV))
  throw new Error("VITE_RUN_ENV can only be 'agoric_chain' or 'localhost'");

type Wallet = Awaited<ReturnType<typeof makeAgoricWalletConnection>>;

const ENDPOINTS = {
  RPC: `http://${RUN_ENV}:26657`,
  API: `http://${RUN_ENV}:1317`,
};

const watcher = makeAgoricChainStorageWatcher(ENDPOINTS.API, 'agoriclocal');

interface AppState {
  wallet?: Wallet;
  offerUpInstance?: unknown;
  brands?: Record<string, unknown>;
  purses?: Array<Purse>;
}

const useAppStore = create<AppState>(() => ({}));

const setup = async () => {
  watcher.watchLatest<Array<[string, unknown]>>(
    [Kind.Data, 'published.agoricNames.instance'],
    instances => {
      console.log('got instances', instances);
      useAppStore.setState({
        offerUpInstance: instances.find(([name]) => name === 'offerUp')!.at(1),
      });
    },
  );

  watcher.watchLatest<Array<[string, unknown]>>(
    [Kind.Data, 'published.agoricNames.brand'],
    brands => {
      console.log('Got brands', brands);
      useAppStore.setState({
        brands: fromEntries(brands),
      });
    },
  );
};

const connectWallet = async () => {
  await suggestChain(`http://localhost:3004/${RUN_ENV}`);
  const wallet = await makeAgoricWalletConnection(watcher, ENDPOINTS.RPC);
  useAppStore.setState({ wallet });
  const { pursesNotifier } = wallet;
  for await (const purses of subscribeLatest(pursesNotifier)) {
    console.log('got purses', purses);
    useAppStore.setState({ purses });
  }
};

const makeOffer = (giveValue: bigint, wantChoices: Record<string, bigint>) => {
  const { wallet, offerUpInstance, brands } = useAppStore.getState();
  if (!offerUpInstance) throw Error('no contract instance');
  if (!(brands && brands.IST && brands.Item))
    throw Error('brands not available');

  const value = makeCopyBag(entries(wantChoices));
  const want = { Items: { brand: brands.Item, value } };
  const give = { Price: { brand: brands.IST, value: giveValue } };

  wallet?.makeOffer(
    {
      source: 'contract',
      instance: offerUpInstance,
      publicInvitationMaker: 'makeTradeInvitation',
    },
    { give, want },
    undefined,
    (update: { status: string; data?: unknown }) => {
      if (update.status === 'error') {
        alert(`Offer error: ${update.data}`);
      }
      if (update.status === 'accepted') {
        alert('Offer accepted');
      }
      if (update.status === 'refunded') {
        alert('Offer rejected');
      }
    },
  );
};

function App() {
  useEffect(() => {
    setup();
  }, []);

  const { wallet, purses } = useAppStore(({ wallet, purses }) => ({
    wallet,
    purses,
  }));
  const istPurse = purses?.find(p => p.brandPetname === 'IST');
  const itemsPurse = purses?.find(p => p.brandPetname === 'Item');

  const tryConnectWallet = () => {
    connectWallet().catch(err => {
      switch (err.message) {
        case 'KEPLR_CONNECTION_ERROR_NO_SMART_WALLET':
          alert(
            'no smart wallet at that address; try: yarn docker:make print-key',
          );
          break;
        default:
          alert(err.message);
      }
    });
  };

  return (
    <>
      <Logos />
      <h1>Items Listed on Offer Up</h1>

      <div className="card">
        <Trade
          makeOffer={makeOffer}
          istPurse={istPurse as Purse}
          walletConnected={!!wallet}
        />
        <hr />
        {wallet && istPurse ? (
          <Inventory
            address={wallet.address}
            istPurse={istPurse}
            itemsPurse={itemsPurse as Purse}
          />
        ) : (
          <button onClick={tryConnectWallet}>Connect Wallet</button>
        )}
      </div>
    </>
  );
}

export default App;
