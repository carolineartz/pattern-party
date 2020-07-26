
import React from 'react';
import { Box } from "grommet"

type InfiniteScrollProps = {
  items: any[],
  fetch: any,
  more: boolean
  renderFn: (item: any, i: number) => JSX.Element
}
export const InfiniteScroll = (props: InfiniteScrollProps) => {
  console.log(props)
  const { items, fetch, more, renderFn } = props
  const [element, setElement] = React.useState<HTMLDivElement | null>(null);
  // const [loading, setLoading] = React.useState(false);

  const page = React.useRef(1);
  const prevY = React.useRef(0);
  const observer = React.useRef(
    new IntersectionObserver(
      entries => {
        const firstEntry = entries[0];
        const y = firstEntry.boundingClientRect.y;

        if (prevY.current > y) {
          setTimeout(() => loadMore(), 1000); // 1 sec delay
        }

        prevY.current = y;
      },
      { threshold: 1 }
    )
  );

  const fetchData = React.useCallback(async (pageNumber: number) => {
    const foo = await fetch()
    debugger
  }, []);

  const handleInitial = React.useCallback(
    async page => {
      console.log(page)
      debugger
      fetchData(page)
    },
    [fetchData]
  );

  const loadMore = () => {
    page.current++;

    if (more) {
      handleInitial(page.current);
    }
  };

  React.useEffect(() => {
    handleInitial(page.current);
  }, [handleInitial]);

  React.useEffect(() => {
    const currentElement = element;
    console.log("currentElement", currentElement)
    const currentObserver = observer.current;

    if (currentElement) {
      currentObserver.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        currentObserver.unobserve(currentElement);
      }
    };
  }, [element]);

  return (
    <>
      {items.map(renderFn)}
      <Box ref={setElement}></Box>
    </>
  );
}

    // <div className="appStyle">
    //   {images && (
    //     <ul className="imageGrid">
    //       {images.map((image, index) => (
    //         <li key={index} className="imageContainer">
    //           <img src={image.download_url} alt={image.author} className="imageStyle" />
    //         </li>
    //       ))}
    //     </ul>
    //   )}

    //   {loading && <li>Loading ...</li>}

    //   <div ref={setElement} className="buttonContainer">
    //     <button className="buttonStyle">Load More</button>
    //   </div>
    // </div>
