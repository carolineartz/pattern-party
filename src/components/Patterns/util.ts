const Pizzaz = require("./../../libs/pizzaz")

export const createTreeWalker = (el: HTMLElement) => document.createTreeWalker(
  el,
  NodeFilter.SHOW_TEXT,
  {
    acceptNode: function (node) {
      if (node.textContent && (node.textContent.startsWith("#") || node.textContent.startsWith("rg"))) {
        return NodeFilter.FILTER_ACCEPT;
      } else {
        return NodeFilter.FILTER_REJECT
      }
    }
  },
  false
);

export function addColors(treeWalker: TreeWalker) {
  const nodeList: Node[] = [];
  let currentNode: Node | null = treeWalker.currentNode;

  while(currentNode) {
    nodeList.push(currentNode);
    currentNode = treeWalker.nextNode();
  }

  nodeList.forEach((node: Node) => {
    const parent = node.parentNode
    if (parent && !parent.querySelector(".inline-color")) {
      if (parent instanceof HTMLElement && parent.classList.contains("attr-value")) {
        const newNode = document.createElement("span")
        newNode.classList.add("inline-color")
        newNode.style.backgroundColor = node.textContent || "transparent"
        parent.insertBefore(newNode, node)
      }
    }
  })
}

const pizzazArgs = {
  size: 25,
  buffer: 5,
  spacing: 20,
  speed: 1,
  strokeWidth: 2.5
}

export const  animateClickPatternOption = (el: Element, markup: string) => {
    let color = "rgba(240, 101, 122, 1.000)"
    const regex = /fill="([r#].*?)"/gm;
    const found = Array.from(markup.matchAll(regex)).map((x: RegExpMatchArray) => x[1]);
    if (found.length) {
      color = found[1] || found[0] || color
    }
    const pizazz = new Pizzaz({
      stroke: color,
      ...pizzazArgs
    })

    pizazz.play(el)
  }


export const formatSVG = (markup: string) => {
  return markup.replace(/^((\s+)([^<])*")>/gm, (_match: string, offset: string) => offset + "/>");
}
