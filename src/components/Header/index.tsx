import * as React from "react"
import "styled-components/macro"

import { Header as GHeader, Box, Button, Text, Nav, Anchor, RoutedAnchor, RoutedAnchorProps } from "grommet"
import { ReactComponent as Logo } from "./../../images/logo-p.svg"
import { withRouter, Link } from 'react-router-dom';
import * as ROUTES from "./../../constants/routes"
// import { Link } from 'react-router-dom';

type Foo = RoutedAnchorProps

const Header = () => {
  return (
    <GHeader border={{
      "color": "light-4",
      "size": "xsmall",
      "style": "solid",
      "side": "bottom"
    }}>
      <Brand />
      <Nav direction="row" pad={{right: "medium"}}>
        <Link to={ROUTES.EXPLORE}>
          <Text color="text" weight="normal">Explore</Text>
        </Link>
        <Link to={ROUTES.SIGN_IN}>
          <Text color="text" weight="normal">Sign in</Text>
        </Link>
        <Link to={ROUTES.SIGN_OUT}>
          <Text color="text" weight="normal">Sign out</Text>
        </Link>
      </Nav>
    </GHeader>
  )
}


const Brand = () => {
  return (
    <Box direction="row" responsive pad="xsmall"  justify="center" align="center" >
      <Box height={{ max: "52px" }}><Logo /></Box>
      <Text>PatternParty</Text>
    </Box>
  )
}

// const Brand = () => {
//   return (
//     <Box
//       direction="row"
//       css={`
//         font-family: 'Montserrat Subrayada', sans-serif;
//       `}
//     >
//       <Text
//         weight="bold"

//       >
//         Pattern
//       </Text>
//       <Text
//         color="text"
//         weight="bold"
//         css={`
//           background: url("data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%20width%3D%22100%25%22%20height%3D%22100%25%22%3E%20%3Cdefs%3E%20%3Cpattern%20id%3D%22pattern%22%20width%3D%2253%22%20height%3D%2253%22%20viewBox%3D%220%200%2040%2C40%22%20patternUnits%3D%22userSpaceOnUse%22%20patternTransform%3D%22rotate(221)%22%3E%20%3Crect%20id%3D%22pattern-background%22%20width%3D%22400%25%22%20height%3D%22400%25%22%20fill%3D%22rgba(255%2C%20190%2C%2077%2C1)%22%2F%3E%20%3Cpath%20filter%3D%22url(%23filter1pattern)%22%20fill%3D%22rgba(137%2C%20217%2C%20225%2C1)%22%20d%3D%22M0%2034.5%20a%204.5%20-4.5%200%200%200%204.5%20-4.5%20a%2015.5%20-15.5%200%200%201%2015.5%20-15.5%20a%204.5%20-4.5%200%200%200%204.5%20-4.5%20a%2015.5%20-15.5%200%200%201%2015.5%20-15.5%20v11%20a%20-4.5%204.5%200%200%200%20-4.5%204.5%20a%20-15.5%2015.5%200%200%201%20-15.5%2015.5%20a%20-4.5%204.5%200%200%200%20-4.5%204.5%20a%20-15.5%2015.5%200%200%201%20-15.5%2015.5z%20M0%20-5.5%20a%204.5%20-4.5%200%200%200%204.5%20-4.5%20h11%20a%20-15.5%2015.5%200%200%201%20-15.5%2015.5z%20M0%20-5.5%20a%2015.5%2015.5%200%200%201%2015.5%2015.5%20a%204.5%204.5%200%200%200%204.5%204.5%20a%2015.5%2015.5%200%200%201%2015.5%2015.5%20a%204.5%204.5%200%200%200%204.5%204.5%20a%2015.5%2015.5%200%200%201%2015.5%2015.5%20a%204.5%204.5%200%200%201%204.5%204.5%20v11%20a%20-15.5%20-15.5%200%200%201%20-15.5%20-15.5%20a%20-4.5%20-4.5%200%200%200%20-4.5%20-4.5%20a%20-15.5%20-15.5%200%200%201%20-15.5%20-15.5%20a%20-4.5%20-4.5%200%200%200%20-4.5%20-4.5%20a%20-15.5%20-15.5%200%200%201%20-15.5%20-15.5%20a%20-4.5%20-4.5%200%200%200%20-4.5%20-4.5%20a%20-15.5%20-15.5%200%200%201%20-15.5%20-15.5%20a%20-4.5%20-4.5%200%200%201%20-4.5%20-4.5%20a%20-15.5%20-15.5%200%200%200%20-15.5%20-15.5%20h11%20a%204.5%204.5%200%200%201%204.5%204.5%20a%204.5%204.5%200%200%200%204.5%204.5z%20M40%20-5.5%20a%2015.5%2015.5%200%200%201%2015.5%2015.5%20h-11%20a%20-4.5%20-4.5%200%200%201%20-4.5%20-4.5%20a%20-15.5%20-15.5%200%200%201%20-15.5%20-15.5%20a%20-4.5%20-4.5%200%200%201%20-4.5%20-4.5%20a%20-15.5%20-15.5%200%200%201%20-15.5%20-15.5z%22%2F%3E%20%3Cpath%20filter%3D%22url(%23filter2pattern)%22%20fill%3D%22rgba(95%2C%20178%2C%20241%2C1)%22%20d%3D%22M-8%2037.5%20a%207.5%20-7.5%200%200%200%207.5%20-7.5%20a%2012.5%20-12.5%200%200%201%2012.5%20-12.5%20a%207.5%20-7.5%200%200%200%207.5%20-7.5%20a%2012.5%20-12.5%200%200%201%2012.5%20-12.5%20v5%20a%20-7.5%207.5%200%200%200%20-7.5%207.5%20a%20-12.5%2012.5%200%200%201%20-12.5%2012.5%20a%20-7.5%207.5%200%200%200%20-7.5%207.5%20a%20-12.5%2012.5%200%200%201%20-12.5%2012.5z%20M-8%20-2.5%20a%207.5%20-7.5%200%200%200%207.5%20-7.5%20h5%20a%20-12.5%2012.5%200%200%201%20-12.5%2012.5z%20M-8%20-2.5%20a%2012.5%2012.5%200%200%201%2012.5%2012.5%20a%207.5%207.5%200%200%200%207.5%207.5%20a%2012.5%2012.5%200%200%201%2012.5%2012.5%20a%207.5%207.5%200%200%200%207.5%207.5%20a%2012.5%2012.5%200%200%201%2012.5%2012.5%20a%207.5%207.5%200%200%201%207.5%207.5%20v5%20a%20-12.5%20-12.5%200%200%201%20-12.5%20-12.5%20a%20-7.5%20-7.5%200%200%200%20-7.5%20-7.5%20a%20-12.5%20-12.5%200%200%201%20-12.5%20-12.5%20a%20-7.5%20-7.5%200%200%200%20-7.5%20-7.5%20a%20-12.5%20-12.5%200%200%201%20-12.5%20-12.5%20a%20-7.5%20-7.5%200%200%200%20-7.5%20-7.5%20a%20-12.5%20-12.5%200%200%201%20-12.5%20-12.5%20a%20-7.5%20-7.5%200%200%201%20-7.5%20-7.5%20a%20-12.5%20-12.5%200%200%200%20-12.5%20-12.5%20h5%20a%207.5%207.5%200%200%201%207.5%207.5%20a%207.5%207.5%200%200%200%207.5%207.5z%20M32%20-2.5%20a%2012.5%2012.5%200%200%201%2012.5%2012.5%20a%207.5%207.5%200%200%200%207.5%207.5%20a%2012.5%2012.5%200%200%201%2012.5%2012.5%20h-5%20a%20-7.5%20-7.5%200%200%200%20-7.5%20-7.5%20a%20-12.5%20-12.5%200%200%201%20-12.5%20-12.5%20a%20-7.5%20-7.5%200%200%200%20-7.5%20-7.5%20a%20-12.5%20-12.5%200%200%201%20-12.5%20-12.5%20a%20-7.5%20-7.5%200%200%201%20-7.5%20-7.5%20a%20-12.5%20-12.5%200%200%201%20-12.5%20-12.5z%20M32%2037.5%20a%207.5%20-7.5%200%200%200%207.5%20-7.5%20a%2012.5%20-12.5%200%200%201%2012.5%20-12.5%20a%207.5%20-7.5%200%200%200%207.5%20-7.5%20a%2012.5%20-12.5%200%200%201%2012.5%20-12.5%20v5%20a%20-7.5%207.5%200%200%200%20-7.5%207.5%20a%20-12.5%2012.5%200%200%201%20-12.5%2012.5%20a%20-7.5%207.5%200%200%200%20-7.5%207.5%20a%20-12.5%2012.5%200%200%201%20-12.5%2012.5z%22%2F%3E%20%3C%2Fpattern%3E%20%3Cfilter%20id%3D%22filter1pattern%22%3E%20%3CfeTurbulence%20baseFrequency%3D%220.01%200.2%22%20numOctaves%3D%222%22%20result%3D%22result1%22%2F%3E%20%3CfeDisplacementMap%20in2%3D%22result1%22%20scale%3D%225%22%20result%3D%22result2%22%20xChannelSelector%3D%22R%22%20yChannelSelector%3D%22G%22%20in%3D%22SourceGraphic%22%2F%3E%20%3CfeComposite%20in2%3D%22result2%22%20in%3D%22SourceGraphic%22%20operator%3D%22atop%22%20result%3D%22compositeGraphic%22%2F%3E%20%3CfeOffset%20in%3D%22compositeGraphic%22%20result%3D%22fbSourceGraphic%22%20dx%3D%22-0.5%22%3E%20%3C%2FfeOffset%3E%20%3C%2Ffilter%3E%20%3Cfilter%20id%3D%22filter2pattern%22%3E%20%3CfeTurbulence%20baseFrequency%3D%220.15%200.01%22%20numOctaves%3D%222%22%20result%3D%22result1%22%2F%3E%20%3CfeDisplacementMap%20in2%3D%22result1%22%20scale%3D%226%22%20result%3D%22result2%22%20xChannelSelector%3D%22R%22%20yChannelSelector%3D%22G%22%20in%3D%22SourceGraphic%22%2F%3E%20%3CfeComposite%20in2%3D%22result2%22%20in%3D%22SourceGraphic%22%20operator%3D%22atop%22%20result%3D%22compositeGraphic%22%2F%3E%20%3CfeOffset%20in%3D%22compositeGraphic%22%20result%3D%22fbSourceGraphic%22%20dy%3D%22-0.6%22%3E%20%3C%2FfeOffset%3E%20%3C%2Ffilter%3E%20%3C%2Fdefs%3E%20%3Crect%20fill%3D%22url(%23pattern)%22%20height%3D%22100%25%22%20width%3D%22100%25%22%2F%3E%3C%2Fsvg%3E");
//           padding: 2px;
//         `}
//       >
//         Party
//       </Text>
//     </Box>
//   )
// }

// {/* <RoutedAnchor path="/signin" label={<Text color="text" weight="normal">Login</Text>} /> */}
export default withRouter(Header)
