import {TailSpin} from 'react-loader-spinner';

export default function ReactLoader() {
  return (
    <div className="w-screen h-screen z-10 flex justify-center items-center">
      <TailSpin
        color="#00000059"
        height={100}
        width={100}
        ariaLabel="Loading"
      />
    </div>
  );
}