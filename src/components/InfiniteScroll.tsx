import React, { useState, useEffect, useRef } from 'react';
import takeRight from "lodash.takeright"
import take from "lodash.take"
import { Box } from "grommet"
import "styled-components/macro"

type InfiniteScrollProps<D> = {
  items: D[]
  hasMore: boolean
  cursor: firebase.firestore.QueryDocumentSnapshot<D>
  loadMore: (cursor: firebase.firestore.QueryDocumentSnapshot<D>) => LoadMoreResponse<D>
  renderFn: (item: D, i: number) => JSX.Element
}

export function InfiniteScroll<D>({items, cursor, loadMore, renderFn, hasMore}: InfiniteScrollProps<D>) {
  const [element, setElement] = useState<HTMLElement | null>(null);

  const cursorRef = useRef<firebase.firestore.QueryDocumentSnapshot<D>>(cursor)
  const moreRef = useRef<boolean>(hasMore)
  const [done, setDone] = React.useState<boolean>(!hasMore)

  const prevY = useRef(0);
  const observer = useRef(
    new IntersectionObserver(
      entries => {
        const firstEntry = entries[0];
        const y = firstEntry.boundingClientRect.y;

        if (moreRef.current && prevY.current > y) {
          console.log("loading!")
          loadMore(cursorRef.current).then(([nextCursor, nextMore]) => {
            cursorRef.current = nextCursor
            moreRef.current = nextMore
            if (!nextMore) {
              setDone(true)
            }
          })
        }

        prevY.current = y;
      },
      { threshold: 0 }
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

  let _tail = takeRight(items, 9)
  const head = take(items, items.length - 9)
  const [target, ...tail] = _tail

  if (items.length < 17) {
    return (
      <>
        {items.map(renderFn)}
        <Box ref={setElement}></Box>
        {done && <Box>DONE!</Box>}
      </>
    )
  }
  else {
    return (
      <>
        {head.map(renderFn)}
        <Box
          width="100%"
          height="100%"
          css={`
          > div {
            height: 100%;
            width: 100%;
          }
        `}
          className="ITEM" ref={setElement}>{renderFn(target, items.length - 6)}</Box>
        {tail.map(renderFn)}
      </>
    );
  }
}
