import { useEffect, useState } from "react";

export default function StageLine(props) {
    const [text, setText] = useState();

    useEffect(() => {
        if (props.text.length > 10) {
            setText(props.text);
        } else if (props.text === "complete") {
            setText(<>This is the end of this coaching. Back to <a className="text-[#1993D6] hover:text-[#9ADBFF] underline" href="/welcome">Home</a> page</>);
        } else {
            setText(`Below is ${props.text.charAt(0).toUpperCase() + props.text.slice(1)} Stage`);
        }
    }, [])

    // https://stackoverflow.com/questions/70203473/creating-a-horizontal-rule-hr-divider-that-contains-text-with-tailwind-css
    return (
        <div className="relative flex py-5 items-center" id={`stageLine-${props.text}`}>
            <div className="flex-grow border-t border-[#494949]"></div>
            <span className="flex-shrink mx-4 text-[#a3a3a3]">{text}</span>
            <div className="flex-grow border-t border-[#494949]"></div>
        </div>
    );
}
