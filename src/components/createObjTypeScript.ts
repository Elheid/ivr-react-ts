//import { getCellNameById, getParamFromURL, isAdmin, tryJsonParse } from "../utill.ts";
/*
interface Service {
  id: number;
  title: string;
  gifPreview: string;
  mainIconLink: string;
  gifLink: string;
  itemsInCategoryIds: number[];
  categoryId: number;
}

interface Catalog {
  id: number;
  title: string;
  gifPreview: string;
  mainIconLink: string;
  itemsInCategoryIds: number[];
  childrenCategoryIds: number[];
  parentCategoryId: number;
}

interface Info {
  id: number;
  title: string;
  description: string;
  gifLink: string;
  gifPreview: string;
  mainIconLink: string;
  iconLinks: string[];
  additionIds: number[];
}

interface Result {
  title: string;
  description: string;
  gifLink: string;
  iconLinks: string[];
  additionIds: number[];
}

const createLogo = (): HTMLElement => {
  const div = document.createElement("div");
  div.classList.add("logo-container");
  if (
    localStorage.getItem("language") === "clear-language" &&
    window.location.href.indexOf("services") >= 0 ||
    window.location.href.indexOf("instruction") >= 0
  )
    div.classList.add("logo-in-clear");
  else div.classList.remove("logo-in-clear");
  div.classList.add("inner-box");
  div.classList.add("box-of-content");

  const logo = document.createElement("img");
  logo.classList.add("logo");
  logo.src = "/img/logoWhite.svg";

  const text = document.createElement("span");
  text.classList.add("logo-text");
  text.textContent =
    "Модель распознавания русского жестового языка разработана командой:";

  div.appendChild(text);
  div.appendChild(logo);

  return div;
};

const iconInsertion = (textFromBd: string, iconLinks: string[]): string => {
  const iconRegex = /\icon(d+)/g;

  const replacedText = textFromBd.replace(iconRegex, (match, p1) => {
    let icon = iconLinks[Number(p1)];
    icon = tryJsonParse(icon, "link");
    return <img class="icons" src="${icon}" alt="icon${p1}">;
  });

  return replacedText;
};

const insertBlocks = (
  text: HTMLElement,
  textFromBd: string,
  icons: string[]
): void => {
  let textOfBlocks = extractSubstrings(textFromBd);
  if (!textFromBd.includes("n-")) {
    textOfBlocks = extractSubstringsInfo(textFromBd);
  }
  if (!textFromBd.includes("icon")) {
    text.innerHTML = textOfBlocks;
  } else {
    const blocks = partingByBlocks(textOfBlocks, icons);
    blocks.forEach((block) => {
      text.appendChild(block);
    });
  }
};

const partingByBlocks = (
  blocksOfText: string[],
  icons: string[]

ChatGPT4 | Midjourney, [14.09.2024 0:24]
): HTMLElement[] => {
  const blocks: HTMLElement[] = [];
  blocksOfText.forEach((text) => {
    const block = document.createElement('span');
    block.classList.add("text-icon-block");
    block.innerHTML = iconInsertion(text, icons);
    blocks.push(block);
  });
  return blocks;
};

const extractSubstrings = (input: string): string[] => {
  const regex = /\n-.*?\n\\icon\d+/gs;
  const blocks: string[] = [];
  let lastIndex = 0;

  const matches = input.matchAll(regex);

  for (const match of matches) {
    if (match.index > lastIndex) {
      blocks.push(input.slice(lastIndex, match.index).trim());
    }
    blocks.push(match[0].trimStart());
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < input.length) {
    blocks.push(input.slice(lastIndex).trim());
  }

  return blocks || [];
};

const extractSubstringsInfo = (input: string): string[] => {
  const regex = /.*?\n\\icon\d+/gs;
  const blocks = input.match(regex);
  return blocks || [];
};

const createRes = (result: Result, clear: string): DocumentFragment => {
  const template = document.querySelector('#result').content;
  const res = document.importNode(template, true);
  const gif = res.querySelector("video") as HTMLVideoElement;

  const title = tryJsonParse(result.title, "title");
  const description = tryJsonParse(result.description, "description");
  const gifLink = tryJsonParse(result.gifLink, "resVideo");

  if (clear !== "true") {
    gif.src = gifLink;
    gif.setAttribute("type", "video/mp4");
    gif.muted = true;
    gif.classList.add("result-video");
    gif.play().catch((error) => {
      console.log("Autoplay failed:", error);
    });
  } else {
    gif.classList.add("hidden");
  }
  const text = res.querySelector(".manual-text") as HTMLElement;
  const cardTitle = document.querySelector(".res-title") as HTMLElement;
  cardTitle.classList.add("card-title");
  cardTitle.textContent = title;

  const textFromBd = description;
  insertBlocks(text, textFromBd, result.iconLinks);

  const popup = document.getElementById("popup") as HTMLElement;
  if (result.additionIds !== null) {
    popup.setAttribute("addition-info-id", result.additionIds.toString());
  } else {    popup.setAttribute("addition-info-id", null);
  }

  return res;
};

const infoRes = (info: Info): DocumentFragment => {
  const template = document.querySelector('#result-info').content;
  const res = document.importNode(template, true);
  const gif = res.querySelector("video") as HTMLVideoElement;
  gif.classList.add("result-info-gif");
  gif.classList.add("result-video");
  gif.muted = true;

  const title = tryJsonParse(info.title, "title");
  const description = tryJsonParse(info.description, "description");
  const gifLink = tryJsonParse(info.gifLink, "resVideo");

  document.querySelector(".additional-info-res").classList.add(info.id.toString());
  const text = res.querySelector(".manual-text") as HTMLElement;
  text.parentNode.classList.remove("manual");
  text.parentNode.classList.add("info-manual");
  const cardTitle = document.querySelector(".popup-title") as HTMLElement;
  cardTitle.textContent = title;
  if (getParamFromURL()[1] == "true") {
    gif.classList.add("hidden");
  } else {
    gif.src = gifLink;
  }

  const undefindCheck = typeof description !== "undefined";
  const emptyString = description !== "";
  if (emptyString && undefindCheck) {
    insertBlocks(text, description, info.iconLinks);
  }
  return res;
};

const createInfoCard = (info: Info): HTMLLIElement => {
  const infoTemplate = document.querySelector(
    '#additional-info'
  ).content.querySelector('li') as HTMLLIElement;

  const title = tryJsonParse

ChatGPT4 | Midjourney, [14.09.2024 0:24]
(info.title, "title");
  const gifPreview = tryJsonParse(info.gifPreview, "video");

  const infoCard = document.importNode(infoTemplate, true);
  const cardTitle = infoCard.querySelector(".card-description") as HTMLElement;

  const imgOrGif = infoCard.querySelector(".info-card-gif") as HTMLVideoElement;

  const cardButton = infoCard.querySelector(".card-button") as HTMLButtonElement;

  if (info.gifPreview) cardButton.setAttribute("data-gifSrc", gifPreview);
  if (info.mainIconLink)
    cardButton.setAttribute(
      "data-iconSrc",
      tryJsonParse(info.mainIconLink, "image")
    );
  if (info.gifLink)
    cardButton.setAttribute(
      "data-resSrc",
      tryJsonParse(info.gifLink, "resVideo")
    );

  imgOrGif.src = gifPreview;
  imgOrGif.muted = true;
  cardTitle.textContent = title;
  infoCard.setAttribute("info-id", info.id.toString());
  return infoCard;
};

const createAndUpdateInfoCard = (data: Info): HTMLLIElement => {
  const card = createInfoCard(data);

  const clear = getParamFromURL()[1];
  if (clear === "true") {
    card.classList.add("clear-card");
    const img = document.createElement("img");
    img.classList.add("icon-in-card");
    img.src = tryJsonParse(data.mainIconLink, "image");
    card.querySelector(".card-button")?.appendChild(img);
    const vid = card.querySelector("video") as HTMLVideoElement;
    vid.classList.add("hidden");
  }
  return card;
};

const createPlayButton = (): HTMLImageElement => {
  const playButton = document.createElement("img");
  playButton.classList.add("play-button");
  playButton.src = "img/play2.svg";
  return playButton;
};

const createVidContainer = (): HTMLDivElement => {
  const videoOverlay = document.createElement("div");
  videoOverlay.classList.add("video-overlay");

  const videoElement = document.createElement("video");
  videoElement.classList.add("gif");
  videoElement.src = "";
  videoElement.setAttribute("playsinline", true);
  videoElement.muted = true;

  videoOverlay.appendChild(videoElement);
  return videoOverlay;
};

const getCurList = (): HTMLUListElement | null => {
  const viewChooseSection = document.querySelector(".view-choose");
  if (viewChooseSection) {
    const divs = viewChooseSection.querySelectorAll("div:not(.hidden)");

    divs.forEach((div) => {
      const ul = div.querySelector("ul");
      if (
        ul &&
        ul.children.length > 0 &&
        !ul.classList.contains("hidden")
      ) {
        return ul;
      }
    });
  }
  return null;
};

const createClarLangCard = (
  cardParent: HTMLLIElement,
  title: string,
  count: number,
  iconGif: string,
  word = "услуг: "
): HTMLLIElement => {
  title = tryJsonParse(title, "title");
  iconGif = tryJsonParse(iconGif, "image");

  cardParent.children[0].classList.add("clear-card");
  const card = cardParent.querySelector("button") as HTMLButtonElement;

  const iconContainer = document.createElement("div");
  iconContainer.classList.add("icon-container");

  let svgUrl = iconGif;

  const changeSvgAttributes = (id: string): void => {
    const svgElement = document.getElementById(id) as SVGElement | null;
    if (svgElement) {
      let width = svgElement.getAttribute("width");
      let height = svgElement.getAttribute("height");
      if (width?.indexOf("%") > 0) {
        width = width.slice(0, width.length - 1);
      }
      if (height?.indexOf("%") > 0) {
        height = height.slice(0, height.length - 1);
      }

      svgElement.setAttribute("viewBox", 0 0 ${width} ${height});
      svgElement.removeAttribute("width");
      svgElement.removeAttribute("width");
      svgElement.setAttribute("width", "100%");
      svgElement.setAttribute("height", "100%");
    }
  };

  const loadSVG = async (svgUrl: string): Pro

ChatGPT4 | Midjourney, [14.09.2024 0:24]
mise<void> => {
    try {
      const response = await fetch(svgUrl);
      const svgText = await response.text();

      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(svgText, "image/svg+xml");

      const fillElements = svgDoc.querySelectorAll("[fill]");
      fillElements.forEach((el) => {
        el.setAttribute("fill", "#ffffff");
      });

      let id = cardParent.getAttribute("catalog-id");
      if (
        window.location.href.includes("catalog") ||
        window.location.href.includes("query")
      ) {
        id = cardParent.getAttribute("service-id");
      }
      svgDoc.documentElement.setAttribute("id", id!);
      svgDoc.documentElement.style = "fill:white;";

      const modifiedSvgUrl = URL.createObjectURL(
        new Blob([svgDoc.documentElement.outerHTML], {
          type: "image/svg+xml",
        })
      );

      const img = document.createElement("img");
      img.src = modifiedSvgUrl;
      iconContainer.appendChild(img);

      changeSvgAttributes(id!);
    } catch (error) {
      console.error("Ошибка при загрузке или изменении SVG:", error);
      console.error("svg -> ", iconGif);
      const icon = document.createElement("img");
      icon.classList.add("icon");
      icon.src = iconGif;
      if (!window.location.href.includes("catalog")) {
        card.appendChild(icon);
      }
    }
  };

  if (iconGif) {
    loadSVG(svgUrl);
  }
  card.appendChild(iconContainer);

  const cardTitle = document.createElement("h3");
  cardTitle.classList.add("card-title");
  cardTitle.classList.add("card-description");
  cardTitle.textContent = title;

  const cardHeader = document.createElement("div");
  cardHeader.classList.add("card-header");
  cardHeader.appendChild(cardTitle);

  const cardFooter = document.createElement("div");
  cardFooter.classList.add("card-footer");

  if (cardParent.classList.contains("catalog-card")) {
    const countServices = document.createElement("p");
    countServices.classList.add("count-services");
    countServices.textContent = word + count;
    cardFooter.appendChild(countServices);
  }

  const arrow = document.createElement("img");
  arrow.classList.add("arrow-img");
  arrow.src = "/img/arrow.svg";
  cardFooter.appendChild(arrow);

  cardHeader.appendChild(cardFooter);
  card.appendChild(cardHeader);
  return cardParent;
};

const createSubstrate = (): HTMLDivElement => {
  const container = document.createElement("div");
  container.classList.add("substrate");

  const title = document.createElement("h3");
  title.classList.add("card-title");
  title.classList.add("card-description");

  const arrow = document.createElement("img");
  arrow.src = "/img/arrow-right.svg";

  container.appendChild(title);
  container.appendChild(arrow);
  return container;
};

const createCatalogCard = (
  catalog: Catalog,
  clearLanguage: boolean
): HTMLLIElement => {
  const catalogTemplate = document.querySelector(
    '#catalog-template'
  ).content.querySelector('li') as HTMLLIElement;
  const cardCatalog = document.importNode(catalogTemplate, true);

  cardCatalog.setAttribute("catalog-id", catalog.id.toString());
  cardCatalog.setAttribute(
    "children-count",
    catalog.itemsInCategoryIds.length.toString()
  );

  const cardButton = cardCatalog.querySelector(".card-button") as HTMLButtonElement;

  const title = tryJsonParse(catalog.title, "title");

  if (catalog.gifPreview)
    cardButton.setAttribute("data-gifSrc", tryJsonParse(catalog.gifPreview, "video"));
  if (catalog.mainIconLink)
    cardButton.setAttribute(
      "data-iconSrc",
      tryJsonParse(catalog.mainIconLink, "image")
    );

  if (!clearLanguage) {
    cardButton.appendChild(createVidContainer());
    cardButton.appendChil

ChatGPT4 | Midjourney, [14.09.2024 0:24]
d(createSubstrate());

    const vidOrGif = cardCatalog.querySelector("video.gif") as HTMLVideoElement;
    const cardTitle = cardCatalog.querySelector(
      ".card-description"
    ) as HTMLElement;

    const gifPreview = tryJsonParse(catalog.gifPreview, "video");

    vidOrGif.src = gifPreview;
    vidOrGif.loop = true;
    vidOrGif.muted = true;
    vidOrGif.autoplay = true;

    cardTitle.textContent = title;
  } else {
    const mainIcon = tryJsonParse(catalog.mainIconLink, "image");
    if (!mainIcon) {
      catalog.mainIconLink = "/img/close.jpg";
    }
    if (mainIcon.length != 0) {
      if (
        catalog.childrenCategoryIds &&
        catalog.childrenCategoryIds.length !== 0
      ) {
        const clearCard = createClarLangCard(
          cardCatalog,
          title,
          catalog.childrenCategoryIds.length,
          mainIcon,
          "подкатегорий: "
        );
        cardCatalog = clearCard;
      } else {
        const clearCard = createClarLangCard(
          cardCatalog,
          title,
          catalog.itemsInCategoryIds.length,
          mainIcon
        );
        cardCatalog = clearCard;
      }
    } else {
      const clearCard = createClarLangCard(
        cardCatalog,
        title,
        catalog.itemsInCategoryIds.length
      );
      cardCatalog = clearCard;
    }
  }

  if (catalog.childrenCategoryIds) {
    if (catalog.childrenCategoryIds.length !== 0) {
      const subCategoryContainer = document.createElement("div");
      subCategoryContainer.classList.add("sub-catalogs");
      const language = localStorage.getItem("language");
      subCategoryContainer.classList.add(language!);
      const listSubCategory = document.createElement("ul");
      listSubCategory.classList.add("list-of-cards");
      listSubCategory.classList.add("catalogs-list");
      listSubCategory.classList.add("sub-catalogs-list");
      listSubCategory.classList.add("hidden");
      subCategoryContainer.appendChild(listSubCategory);
      document
        .querySelector(".view-choose")
        ?.insertBefore(
          subCategoryContainer,
          document.getElementById("card-form-container")
        );

      cardCatalog.classList.add("has-sub-catalogs");
      subCategoryContainer.setAttribute("parent-id", catalog.id.toString());
    }
  }
  if (catalog.parentCategoryId) {
    if (catalog.parentCategoryId !== 0) {
      cardCatalog.classList.add("sub-catalog-card");
      cardCatalog.setAttribute(
        "parent-id",
        catalog.parentCategoryId.toString()
      );
    }
  }

  return cardCatalog;
};

const addNameIfQuery = (service: Service): string => {
  const subCatalogs = document.querySelectorAll("div.sub-catalogs");
  let isSubCatalog = false;
  let subParentId: string | null = null;
  subCatalogs.forEach((subCatalog) => {
    const subWithSameId = subCatalog.querySelector(
      [catalog-id="${service.categoryId}"]
    );
    if (subWithSameId) {
      isSubCatalog = true;
      subParentId = subWithSameId.getAttribute("parent-id");
    }
  });
  let categoryName = "";
  const prevCellName = getCellNameById(service.categoryId);
  if (isSubCatalog) {
    categoryName = getCellNameById(Number(subParentId!));
    if (prevCellName !== service.title) {
      categoryName += " : " + prevCellName;
    }
  } else {
    if (prevCellName !== service.title) {
      categoryName += " " + prevCellName;
    }
  }
  return categoryName;
};

const createServiceCard = (
  service: Service,
  clearLanguage: boolean
): HTMLLIElement => {
  const serviceTemplate = document.querySelector(
    '#service-template'
  ).content.querySelector('li') as HTMLLIElement;
  const cardService = document.importNode(serviceTemplate, true);

  cardService.setAttribute("service-id", service.id.toString());

ChatGPT4 | Midjourney, [14.09.2024 0:25]
const cardButton = cardService.querySelector(".card-button") as HTMLButtonElement;
  const title = tryJsonParse(service.title, "title");

  if (service.gifPreview)
    cardButton.setAttribute("data-gifSrc", tryJsonParse(service.gifPreview, "video"));
  if (service.mainIconLink)
    cardButton.setAttribute(
      "data-iconSrc",
      tryJsonParse(service.mainIconLink, "image")
    );
  if (service.gifLink)
    cardButton.setAttribute(
      "data-resSrc",
      tryJsonParse(service.gifLink, "resVideo")
    );

  if (!clearLanguage) {
    const query = window.location.href;

    cardButton.appendChild(createVidContainer());
    if (query.includes("query")) {
      const categoryName = addNameIfQuery(service);

      const categoryNameSpan = document.createElement("h3");
      categoryNameSpan.classList.add("categoryName");
      categoryNameSpan.textContent = categoryName;
      cardButton.append(categoryNameSpan);
    }
    cardButton.appendChild(createSubstrate());

    const vidOrGif = cardService.querySelector("video.gif") as HTMLVideoElement;

    const gifPreview = tryJsonParse(service.gifPreview, "video");
    vidOrGif.src = gifPreview;
    vidOrGif.loop = true;
    vidOrGif.muted = true;
    vidOrGif.autoplay = true;
  } else {
    const mainIcon = tryJsonParse(service.mainIconLink, "image");
    if (!mainIcon) {
      service.mainIconLink = "/img/close.jpg";
    }
    if (mainIcon.length != 0) {
      const clearCard = createClarLangCard(
        cardService,
        title,
        service.itemsInCategoryIds
          ? service.itemsInCategoryIds.length
          : 0,
        mainIcon
      );
      cardService = clearCard;
    } else {
      const clearCard = createClarLangCard(
        cardService,
        title,
        service.itemsInCategoryIds
          ? service.itemsInCategoryIds.length
          : 0
      );
      cardService = clearCard;
    }

    const query = window.location.href;
    if (query.includes("query")) {
      const categoryName = addNameIfQuery(service);
      const categoryNameSpan = document.createElement("h3");
      categoryNameSpan.classList.add("categoryName");
      categoryNameSpan.textContent = categoryName;
      cardService.querySelector(".card-header")?.append(categoryNameSpan);
    }
  }

  const cardTitle = cardService.querySelector(
    ".card-description"
  ) as HTMLElement;
  cardTitle.textContent = title;

  const nextButton = cardService.querySelector(
    ".service-button"
  ) as HTMLButtonElement;

  nextButton.addEventListener("click", (evt) => {
    const liEl = evt.target.closest("li") as HTMLLIElement | null;
    const serviceId = liEl?.getAttribute("service-id");
    const language = document.querySelector(".services");
    const saveData = (data: string): void => {
      localStorage.setItem("header", data);
    };

    const data = document.querySelector(".header-list") as HTMLElement | null;
    const detaHTML = data?.outerHTML;
    saveData(detaHTML!);

    localStorage.setItem(
      "pre-res-search",
      window.location.search
    );

    window.location.href = result.html?serviceId=${encodeURIComponent(
      serviceId!
    )}&language=${encodeURIComponent(
      language?.classList.contains("clear-language")
    )}&;
  });

  return cardService;
};

const loadHeaderData = (): string | null => {
  const savedData = localStorage.getItem("header");
  if (savedData != null) {
    return savedData;
  }
  return null;
};

const rowButtonEvent = (
  listOfCards: HTMLUListElement,
  remove: boolean,
  marginTop: string,
  marginTop2: string
): void => {
  if (listOfCards.children.length === 0) {
    listOfCards = listOfCards.children[0] as HTMLUListElement;
  } else {
    listOfCards = listOfCards.children[1] as HTMLUListElement;
  }
  if (remove) {
    lis

ChatGPT4 | Midjourney, [14.09.2024 0:25]
tOfCards.classList.remove("list");
  } else {
    listOfCards.classList.add("list");
  }

  const list = listOfCards.children;
  for (let i = 0; i < list.length; i++) {
    const card = list[i] as HTMLLIElement;
    if (card.querySelector(".card-button"))
      card.querySelector(".card-button")!.style.marginTop = marginTop;
    document.querySelector(".view-choose")!.style.marginTop = marginTop2;
  }
};

const changeVidLists = (lists: NodeListOf<HTMLUListElement>): void => {
  lists.forEach((list) => {
    list.style = "width: 80%; margin-left: auto; margin-right: auto;";
  });
};

const returnVidLists = (lists: NodeListOf<HTMLUListElement>): void => {
  lists.forEach((list) => {
    list.style = "";
  });
};

const adminButtonsCrutch = (): void => {
  if (isAdmin()) {
    document.querySelector(".toggleContainer")?.click();
    document.querySelector(".toggleContainer")?.click();
  }
};

const createEventsButtons = (listOfCards: NodeListOf<HTMLUListElement>): void => {
  const catalog = document.querySelector(".catalogs") as HTMLElement | null;
  const twoInRow = document.querySelector(".two-in-row") as HTMLElement | null;
  const oneInRow = document.querySelector(".one-in-row") as HTMLElement | null;

  if (!catalog?.classList.contains("clear-language")) {
    oneInRow?.addEventListener("click", () => {
      changeVidLists(listOfCards);
      rowButtonEvent(
        listOfCards[0] as HTMLUListElement,
        false,
        "20px",
        "8.6%"
      );
      adminButtonsCrutch();
    });
    twoInRow?.addEventListener("click", () => {
      returnVidLists(listOfCards);
      rowButtonEvent(
        listOfCards[1] as HTMLUListElement,
        true,
        "0",
        "6%"
      );
      adminButtonsCrutch();
    });
  } else {
    twoInRow?.classList.add("opacity");
    oneInRow?.classList.add("opacity");
  }
};

const createGoButtons = (): void => {
  const lists = document.querySelectorAll(
    ".list-of-cards:not(.sceleton-list)"
  ) as NodeListOf<HTMLUListElement>;
  createEventsButtons(lists);
};

const createGastrualSkeleton = (count: number, isClear: boolean): DocumentFragment => {
  let template = document.querySelector("#gastrual-skeleton")?.content;
  if (isClear) {
    template = document.querySelector("#clear-skeleton")?.content;
  }
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < count; i++) {
    const skeleton = document.importNode(template!, true);
    fragment.appendChild(skeleton);
  }
  return fragment;
};

export {
  createRes,
  createGoButtons,
  createServiceCard,
  createGastrualSkeleton,
  createCatalogCard,
  createInfoCard,
  infoRes,
  loadHeaderData,
  createAndUpdateInfoCard,
  extractSubstrings,
  iconInsertion,
  createLogo,
};*/