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

