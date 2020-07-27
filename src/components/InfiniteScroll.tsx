
import React from 'react';
import { Box } from "grommet"
import "styled-components/macro"
import uniqBy from "lodash.uniqby"

type InfiniteScrollProps<D> = {
  items: D[]
  more: boolean
  renderFn: (item: D, i: number) => JSX.Element
  cursor?: firebase.firestore.QueryDocumentSnapshot<D>
  fetch: (startAfter?: firebase.firestore.QueryDocumentSnapshot<D>) => Promise<DataResponse<D>>
  set: (data: DataResponse<D>) => void
  setMore: (hasMore: boolean) => void
}

const InfiniteScrollWrapped = <D extends{}>(props: InfiniteScrollProps<D>) => {
  console.log("InfiniteScroll props ", props)
  const { items: initialItems, renderFn, set: updateItems, cursor: initialCursor, fetch: fetchItems, more: initialMore, setMore } = props
  const [element, setElement] = React.useState<HTMLDivElement | null>(null);
  const [loading, setLoading] = React.useState(false);

  const [hasMore, setHasMore] = React.useState<boolean>(initialMore)
  const [done, setDone] = React.useState<boolean>(!initialMore)
  // const [cursor, setCursor] = React.useState<firebase.firestore.QueryDocumentSnapshot<D> | undefined>(initialCursor)
  const [items, setItems] = React.useState<D[]>(initialItems)
  // const [localItems, setLocalItems] = React.useState<D[]>([])

  const localItems = React.useRef<D[]>(initialItems)
  const cursor = React.useRef<firebase.firestore.QueryDocumentSnapshot<D> | undefined>(initialCursor);

  // const page = React.useRef(1);
  const prevY = React.useRef(0);
  const observer = React.useRef(
    new IntersectionObserver(
      entries => {
        const firstEntry = entries[0];
        const y = firstEntry.boundingClientRect.y;

        if (prevY.current > y) {
          const fn = () => {
            console.log("done", done)
            if (!done) {
              loadMore()
            } else {
              console.log("no more")
            }
          }
          setTimeout(fn, 1000); // 1 sec delay
        }

        prevY.current = y;
      },
      { threshold: 1 }
    )
  );

  const fetchData = React.useCallback(async startAfter => {
    if (done) {
      console.log("DONE IN FETCH DATA", hasMore, done)
      setHasMore(false)
      setMore(false)
      return Promise.resolve({})
    }

    else {
      setLoading(true);
      // debugger
      try {
        debugger
        const res = await fetchItems(startAfter)

        console.log(res)

        if (!res.more) {
          setDone(true)
        }
        // const { status, data } = res;

        setLoading(false);
        return res;
      } catch (e) {
        setLoading(false);
        return e;
      }
    }

  }, [fetchItems, done, setHasMore, hasMore, initialMore, setDone]);

  const handleInitial = React.useCallback(
    async after => {
      console.log(after)
      const res: { items: D[], lastVisible: firebase.firestore.QueryDocumentSnapshot<D>, more: boolean} = await fetchData(after)

      if (res.items) {

        if (!done) {
          setDone(!res.more)
        }

        cursor.current = res.lastVisible

        setItems((currentItems: D[]) => {
          return uniqBy([...currentItems, ...res.items], 'id')
        })

        localItems.current = localItems.current.concat(res.items)
      } else {
        setMore(false)
      }
    },
    [fetchData, setItems, setHasMore, done]
  );

  const loadMore = () => {
    if (!hasMore) {
      debugger
    }
    if (initialMore && hasMore) {
      handleInitial(cursor.current);
    }
  };

  React.useEffect(() => {
    if (initialMore && hasMore) {
      handleInitial(cursor.current);
    }

    return () => {
      debugger
      updateItems({more: !done, items: localItems.current, lastVisible: cursor.current})
    }
  }, [handleInitial, hasMore, initialMore]);

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

  console.log(localItems.current)
  return (
    <>
      {items.map(renderFn)}
      {hasMore && <Box ref={setElement}>{loading && <Box>Loading ...</Box>}</Box>}
    </>
  );
}

export const InfiniteScroll = React.memo(InfiniteScrollWrapped)
