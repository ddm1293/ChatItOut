import offline from "../../assets/icon_nowifi.png";

export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center justify-center absolute top-24 md:top-12 right-0 w-full sm:w-4/5 h-[90%]">
        <img src={offline} className="w-32 h-32 mb-8" alt="Lost connection" />

        <p className="text-white font-calibri font-medium text-3xl mb-4 "> 
            Ooops... 
        </p>
        
        <p className="text-white font-calibri text-xl w-[40%] text-center mb-12"> 
            There is a connection error. Please check your Internet and try again. 
        </p>

        <button className="bg-[#1993D6] hover:bg-[#4EB7F0] rounded-xl py-2 px-16 text-black font-medium text-xl">
            Try again
        </button>
    </div>
  )
}
