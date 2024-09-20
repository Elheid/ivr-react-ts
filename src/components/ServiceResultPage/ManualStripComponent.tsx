
import { useEffect, useRef } from "react";
import { tryJsonParse } from "../../utill";
import VideoComponent from "../VideoComponent";

import PopupContainer from "./InfoCards/PopupContainer";

type IconLinks = Record<number, string>;

// Функция для вставки иконок
const iconInsertion = (textFromBd: string, iconLinks: IconLinks): string => {
    const iconRegex = /\\icon(\d+)/g;

    // Замена иконок
    const replacedText = textFromBd.replace(iconRegex, ( p1) => {
        let icon = iconLinks[Number(p1)];
        icon = tryJsonParse(icon, "link");
        return `<img class="icons" src="${icon}" alt="icon${p1}" />`;
    });

    return replacedText;
};

// Функция для вставки блоков текста с иконками
const insertBlocks = (
    textElement: React.RefObject<HTMLPreElement>,
    textFromBd: string,
    icons: IconLinks
) => {
    let textOfBlocks = extractSubstrings(textFromBd);

    if (!textFromBd.includes("\n-")) {
        textOfBlocks = extractSubstringsInfo(textFromBd);
    }

    if (!textFromBd.includes("\\icon")) {
        if (textElement.current) {
            //textElement.current.innerHTML = textOfBlocks;
            textElement.current.innerHTML = textOfBlocks.join('');
        }
    } else {
        const blocks = partingByBlocks(textOfBlocks, icons);
        if (textElement.current) {
            blocks.forEach(block => textElement.current?.appendChild(block));
        }
    }
};

// Функция для разделения текста на блоки
const partingByBlocks = (blocksOfText: string[], icons: IconLinks): HTMLSpanElement[] => {
    const blocks: HTMLSpanElement[] = [];
    for (let i = 0; i < blocksOfText.length; i++) {
        const text = blocksOfText[i];
        const block = document.createElement('span');
        block.classList.add("text-icon-block");
        block.innerHTML = iconInsertion(text, icons);
        blocks.push(block);
    }
    return blocks;
};

// Функция для извлечения подстрок по регулярному выражению
const extractSubstrings = (input: string): string[] => {
    const regex = /\n-.*?\n\\icon\d+/gs;
    const blocks: string[] = [];
    let lastIndex = 0;

    const matches = input.matchAll(regex);

    for (const match of matches) {
        if (match.index && match.index > lastIndex) {
            blocks.push(input.slice(lastIndex, match.index).trim());
        }

        blocks.push(match[0].trimStart());

        lastIndex = match.index + match[0].length;
    }

    if (lastIndex < input.length) {
        blocks.push(input.slice(lastIndex).trim());
    }

    return blocks;
};

// Вспомогательная функция для извлечения подстрок без переноса строк
const extractSubstringsInfo = (input: string): string[] => {
    const regex = /.*?\n\\icon\d+/gs;
    const blocks = input.match(regex);
    return blocks || [];
};


interface ManualStrpComponentProps {
    gifLink: string;
    description: string;
    iconLinks: string[];
    additionIds: number[];
}

const ManualStrpComponent = ({ gifLink, description, iconLinks, additionIds }: ManualStrpComponentProps) => {
    gifLink = tryJsonParse(gifLink, "video")
    description = tryJsonParse(description, "description")

    const textRef = useRef<HTMLPreElement>(null);

    useEffect(() => {
        insertBlocks(textRef, description, iconLinks);
    }, [description, iconLinks]);

    //console.log("iconLinks  ", iconLinks);
    console.log("Id additional info cards ", additionIds);
    return (
        <div className="manual-strp true-manual">
            <VideoComponent class={"instruct-video"} gifSrc={gifLink}></VideoComponent>
            <div className="manual">
                <PopupContainer />
                <pre ref={textRef} className="manual-text result-text">
                </pre>
            </div>
        </div>
    );
};

export default ManualStrpComponent;