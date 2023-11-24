import pencil from "../../assets/icon_pencil.png";
import home from "../../assets/icon_home.png";

export default function StartReflectionLine({ startReflection, setCurrentPage }) {
  return (
    <div className='flex justify-center'>
        <button onClick={() => startReflection()} className="bg-transparent hover:bg-[#1993D6] text-white py-2 px-4 mx-3 border border-[#494949] hover:border-transparent rounded-full inline-flex items-center">
            <img className='w-4 h-4 mr-2' src={pencil} alt="Reflection pencil" />
            <span>Start Reflection Now</span>
        </button>
        
        <button onClick={() => setCurrentPage('welcome')} className="bg-transparent hover:bg-[#1993D6] text-white py-2 px-4 mx-3 border border-[#494949] hover:border-transparent rounded-full inline-flex items-center">
            <img className='w-4 h-4 mr-2' src={home} alt="Home icon" />
            <span>Back to Homepage</span>
        </button>
    </div>
  )
}
