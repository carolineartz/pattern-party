import * as React from "react"
import "styled-components/macro"
import styled, { css } from "styled-components"
import { IconProps } from "grommet-icons"

export const BannerStyle1 = (props: any): JSX.Element => (
  <Icon viewBox="0 0 24 24" a11yTitle="Banner Icon" {...props}>
    <g>
      <polygon points="2.55 8.8 1.31 14.64 3.88 14.22 6.26 15.97 7.17 9.84 2.55 8.8" fill="#ffec8d"/>
      <path d="M4.87,9.4l-3,1.79-.34,2.25,5.61-3.6Z" fill="#ff9d7b"/>
      <polygon points="6.88 12.27 3.88 14.22 4.77 14.54 6.26 15.97 6.88 12.27" fill="#ff9d7b"/>
      <polygon points="9.03 10.05 13.08 10.23 15.56 9.97 12.42 15.71 9.03 10.05" fill="#f95252"/>
      <path d="M21.54,8.65l-3.07.74-1.92.46,1.26,6.09L20,13.86,23,15Z" fill="#3bd2d3"/>
      <polygon points="18.46 9.39 18.49 9.77 17.04 12.44 17.7 14.75 20.68 9.01 18.46 9.39" fill="#74deda"/>
      <polygon points="22 10.51 20.18 13.78 21.61 14.44 22.54 12.65 22 10.51" fill="#74deda"/>
      <path d="M21.84,10.84c.17.71.32,1.42.46,2.14l-.8,1.21-1.09-.51Zm-.08,3.47.6-1c.09.48.18,1,.26,1.44Zm-1.64-.77,0,0a.25.25,0,0,0-.34.09,8.77,8.77,0,0,1-1.78,2l-.13-.68,0,0c1-1.89,1.88-3.82,2.8-5.74l.7-.23c.14.54.28,1.08.41,1.62-.56,1-1.11,2-1.66,3Zm-2.37.91-.3-1.5c0-.17-.06-.34-.1-.51v0c.45-.9.87-1.82,1.31-2.72l.17,0c.55-.12,1.09-.27,1.63-.44C19.55,11,18.62,12.69,17.75,14.45Zm-.61-3a6.93,6.93,0,0,0-.35-1.41c.52-.08,1.05-.18,1.57-.29-.36.75-.74,1.48-1.1,2.23Zm-4.79,3.87c-1.08-1.65-2.09-3.34-3.11-5h.1a31.75,31.75,0,0,0,5.85-.06C14.25,12,13.31,13.64,12.35,15.33ZM6.7,12.13A19.34,19.34,0,0,0,4,14a2.81,2.81,0,0,0-1.15.12,4.46,4.46,0,0,1-1.31.3c.07-.31.12-.64.17-1,.92-.56,1.83-1.13,2.74-1.7l1.38-.88c.38-.24.79-.47,1.16-.74Zm-.55,3.5a4.54,4.54,0,0,1-.8-.78,2.52,2.52,0,0,0-1.13-.8h0a20.81,20.81,0,0,0,2.44-1.54C6.47,13.55,6.31,14.59,6.15,15.63Zm-4.1-3.9c0-.17.08-.34.11-.51.92-.53,1.85-1,2.73-1.61.59.14,1.18.27,1.78.37-.37.22-.72.47-1.07.7l-1.34.86L1.77,13.19C1.86,12.7,2,12.22,2.05,11.73ZM2.64,9q.93.32,1.89.57c-.78.45-1.54.94-2.3,1.42C2.37,10.27,2.52,9.61,2.64,9ZM23.82,7.64a34.47,34.47,0,0,1-9.18,2.09A33,33,0,0,1,5.23,9.2,29,29,0,0,1,.14,7.75C0,7.7-.06,7.92.08,8c.75.3,1.51.6,2.28.87a20.88,20.88,0,0,0-.78,2.81c-.11.48-.21,1-.3,1.46A8.41,8.41,0,0,0,1,14.61a.23.23,0,0,0,.23.23,6,6,0,0,0,1.39-.2,2.48,2.48,0,0,1,1.47-.13,2.79,2.79,0,0,1,1.08.91,3,3,0,0,0,1.06.83.26.26,0,0,0,.31-.18c.3-2,.59-4,.91-6l1.36.16A49.58,49.58,0,0,0,12.14,16a.27.27,0,0,0,.46,0c1-1.93,2.1-3.85,3.16-5.77l.76-.11a6.83,6.83,0,0,0,.19,1.49c.08.5.16,1,.25,1.5l.58,3.09a.26.26,0,0,0,.39.16,9,9,0,0,0,2.12-2.27l2.78,1.36a.29.29,0,0,0,.42-.31,47.37,47.37,0,0,0-1.42-6.35c.71-.26,1.41-.55,2.1-.86C24.07,7.83,24,7.58,23.82,7.64Z" fill="#272442"/>
    </g>
    <rect width="24" height="24" fill="none"/>
  </Icon>
)

const colorCss = css`
  fill: ${(props: any) => props.color || props.theme.global.colors.icon};
  stroke: ${(props: any) => props.color || props.theme.global.colors.icon};
  g {
    fill: inherit;
    stroke: inherit;
  }
  *:not([stroke]) {
    &[fill="none"] {
      stroke-width: 0;
    }
  }
  *[stroke*="#"],
  *[STROKE*="#"] {
    stroke: inherit;
    fill: none;
  }
  *[fill-rule],
  *[FILL-RULE],
  *[fill*="#"],
  *[FILL*="#"] {
    fill: inherit;
    stroke: none;
  }
`

const IconInner = ({ a11yTitle, color: _color, size: _size, ...rest }: IconProps): JSX.Element => (
  <svg aria-label={a11yTitle} {...rest} />
)

IconInner.displayName = "Icon"

const parseMetricToNum = (string: string): number => {
  const match = string.match(/\d+(\.\d+)?/)
  if (match) {
    return Number.parseFloat(match[0])
  }
    return 24
}

export const Icon = styled(IconInner)<IconProps & { viewBox: string }>`
  display: inline-block;
  flex: 0 0 auto;
  ${({ size = "medium", theme, viewBox }) => {
    const [, , w, h] = (viewBox || "0 0 24 24").split(" ")
    const scale = (Number.parseInt(w, 2) || 24) / (Number.parseInt(h, 2) || 24)
    const dimension = parseMetricToNum(theme.icon.size[size] || size)
    if (w < h) {
      return `
      width: ${dimension}px;
      height: ${dimension / scale}px;
    `
    }
    if (h < w) {
      return `
      width: ${dimension * scale}px;
      height: ${dimension}px;
    `
    }
    return `
      width: ${dimension}px;
      height: ${dimension}px;
    `
  }}
  ${({ color }) => color !== "plain" && colorCss}
  ${({ theme }) => theme && theme.icon.extend}
`
