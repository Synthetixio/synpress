import reactLogo from '../assets/react.svg';
import viteLogo from '/vite.svg';
import agoricLogo from '/agoric.svg';

const Logos = () => (
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src={viteLogo} className="logo" alt="Vite logo" />
    </a>
    <a href="https://react.dev" target="_blank">
      <img src={reactLogo} className="logo react" alt="React logo" />
    </a>
    <a href="https://agoric.com/develop" target="_blank">
      <img src={agoricLogo} className="logo agoric" alt="Agoric logo" />
    </a>
  </div>
);

export { Logos };
