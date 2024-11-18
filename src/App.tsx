import { useState } from 'react';
import ConnectDot from './components/ConnectDot';

function App() {
  const [initialValue, setInitialValue] = useState(0);
  const [result, setResult] = useState(0);

  return (
    <section className='min-w-screen min-h-screen bg-home bg-cover flex p-20 justify-between'>
      <div className='max-w-[115px] flex justify-start items-center flex-col gap-2 mt-[171px]'>
        <p className='bg-label rounded-full text-white text-xs font-bold h-[22px] flex items-center w-full justify-center'>
          Initial value of x
        </p>
        <div className='h-[50px] w-full rounded-2xl border-2 border-initial_input flex justify-evenly items-center overflow-hidden bg-white'>
          <input
            type='number'
            value={initialValue}
            onChange={(e) => {
              setInitialValue(Number(e.target.value));
            }}
            placeholder='0'
            className='w-2/3 px-4 h-full decoration-transparent outline-none text-lg text-black font-bold'
          />
          <div className='w-1/3 flex justify-center items-center h-full border-l border-l-label_light'>
            <ConnectDot id='input-start' />
          </div>
        </div>
      </div>

      <div className='max-w-[115px] flex justify-start items-center flex-col gap-2 mt-[171px]'>
        <p className='bg-success_label rounded-full text-white text-xs font-bold h-[22px] flex items-center w-full justify-center'>
          Final output y
        </p>
        <div className='h-[50px] w-full rounded-2xl border-2 border-final_output flex justify-evenly items-center overflow-hidden bg-white'>
          <div className='w-1/3 flex justify-center items-center h-full border-r border-r-success_label_light'>
            <ConnectDot id='output-end' />
          </div>
          <input
            disabled
            type='number'
            value={result}
            className='w-2/3 px-4 h-full decoration-transparent outline-none text-lg text-black font-bold text-right'
          />
        </div>
      </div>
    </section>
  );
}

export default App;
