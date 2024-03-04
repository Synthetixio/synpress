import { stringifyAmountValue } from '@agoric/ui-components';

type InventoryProps = {
  address: string;
  istPurse: Purse;
  itemsPurse: Purse;
};

const Inventory = ({ address, istPurse, itemsPurse }: InventoryProps) => (
  <div className="card">
    <h3>My Wallet</h3>
    <div>
      <div>
        <small>
          <code>{address}</code>
        </small>
      </div>

      <div style={{ textAlign: 'left' }}>
        <div>
          <b>IST: </b>
          {stringifyAmountValue(
            istPurse.currentAmount,
            istPurse.displayInfo.assetKind,
            istPurse.displayInfo.decimalPlaces,
          )}
        </div>
        <div>
          <b>Items:</b>
          {itemsPurse ? (
            <ul style={{ marginTop: 0, textAlign: 'left' }}>
              {(itemsPurse.currentAmount.value as CopyBag).payload.map(
                ([name, number]) => (
                  <li key={name}>
                    {String(number)} {name}
                  </li>
                ),
              )}
            </ul>
          ) : (
            'None'
          )}
        </div>
      </div>
    </div>
  </div>
);

export { Inventory };
