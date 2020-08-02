import React, { useState, useEffect, useCallback, useRef } from 'react';

import { Box } from "grommet"
import "styled-components/macro"
import uniqBy from "lodash.uniqby"

type InfiniteScrollProps<D> = {
  items: D[]
  // hasMore: boolean
  cursor: firebase.firestore.QueryDocumentSnapshot<D>
  loadMore: (cursor: firebase.firestore.QueryDocumentSnapshot<D>) => Promise<firebase.firestore.QueryDocumentSnapshot<D>>
  renderFn: (item: D, i: number) => JSX.Element
}

export function InfiniteScroll<D>({items, cursor, loadMore, renderFn}: InfiniteScrollProps<D>) {
// export const InfiniteScrollWrapped = <D extends {}>(props: InfiniteScrollProps<D>) => {
// export const InfiniteScrollWrapped<D>(props: InfiniteScrollProps<D>) {
  const [element, setElement] = useState<HTMLElement | null>(null);

  const cursorRef = useRef<firebase.firestore.QueryDocumentSnapshot<D>>(cursor)

  const prevY = useRef(0);
  const observer = useRef(
    new IntersectionObserver(
      entries => {
        const firstEntry = entries[0];
        const y = firstEntry.boundingClientRect.y;

        if (cursor && prevY.current > y) {
          console.log("loading!")

          setTimeout(() => {
            loadMore(cursorRef.current).then((curs) => {
              cursorRef.current = curs
            })
          }, 1000)
        }

        prevY.current = y;
      },
      { threshold: 1 }
    )
  );

  useEffect(() => {
    const currentElement = element;
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

// export const InfiniteScroll = React.memo(InfiniteScrollWrapped)
